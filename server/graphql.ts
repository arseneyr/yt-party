import { graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import * as Chance from 'chance';
import * as Promise from 'bluebird';
import { createServer } from 'http';
import * as db from './db';
import {serverConfig as APP_CONFIG} from '../config';
import * as rp from 'request-promise';
import * as uuid from 'uuid';

const chance = new Chance();
const mockData: {videos: {id: string}[]} = require('../testdata.json');
let currentUser: {id:string, admin:boolean} = null;
let wrongTries = 1;

let inFlightNames: {[name:string]: boolean} = {};
let videoList: any = [];

const websocketServer = createServer((req,res) => {
  res.writeHead(404);
  res.end();
});

websocketServer.listen(9090);

const getVideos = () => mockData.videos.map((v,i) => ({...v, title: chance.sentence({words: chance.integer({min: 1, max: 20})}), queuedBy:{name:chance.name(),id:chance.string(),admin:false}, thumbnailUrl: `https://img.youtube.com/vi/${v.id}/${i==0 ? 'maxresdefault' : 'default'}.jpg`}));

const schema = makeExecutableSchema({
  typeDefs: `
    type Video {
      id: String!
      title: String!
      youtubeId: String!
      thumbnailUrl: String
      queuedBy: User
    }

    type User {
      id: String!
      name: String
      admin: Boolean!
    }

    type Query {
      currentUser: User
      queue: [Video]!
    }

    type Error {
      errorString: String!
    }

    type CreateUserResult {
      user: User
      error: String
    }

    type QueueVideoResult {
      error: String
    }

    type Mutation {
      createUser(name: String!): CreateUserResult
      queueVideo(id: String!): QueueVideoResult
      deleteVideo(id: String!): QueueVideoResult
      skipVideo: QueueVideoResult
    }

    type Subscription {
      queueChanged: [Video]
    }

    schema {
      query: Query
      mutation: Mutation
      subscription: Subscription
    }
  `,
  resolvers: {
    Query: {
      queue: () => videoList,
      currentUser: (_, __, {userId}) => {
        if (!userId) {
          return null;
        }

        return db.findUser(userId);
      }
    },

    Mutation: {
      createUser: (_, {name}, {userId}) => {
        if (!userId) {
          return {user: null, error: "HACKER!"};
        }

        if (inFlightNames[name]) {
          return {user: null, error: "Name already taken!"};
        }

        inFlightNames[name] = true;

        return db.doesNameExist(name).then(exists => {
          if (exists) {
            delete inFlightNames[name];
            return {user:null, error: "Name already taken!"};
          }

          const newUser = {id: userId, name, admin: APP_CONFIG.ADMIN_NAMES.indexOf(name) !== -1};
          return db.createUser(newUser).then(() => {delete inFlightNames[name]; return {error: null, user: newUser}});
        })
      },
      queueVideo: (_, {id}, {userId}) => db.findUser(userId).then((user: any) => {
        if (!user) {
          return {error: "No username!"};
        }
        if (!user.admin && videoList.find(v => v.youtubeId == id)) {
          return {error: "Already queued!"};
        }

        let newVideo: any = {
          id: uuid.v4(),
          queuedAt: new Date(),
          youtubeId: id,
          queuedBy: user,
        };
        const thumbnailUrl = `https://img.youtube.com/vi/${id}/${videoList.length==0 ? 'hqdefault' : 'default'}.jpg`;
        videoList.push(newVideo);
        return rp(APP_CONFIG.YOUTUBE_VIDEOS_ENDPOINT, {
          json: true,
          qs: {
            key: APP_CONFIG.YOUTUBE_API_KEY,
            part: 'snippet',
            id,
            fields: 'items(snippet(title))'
        }}).then(body => {
          newVideo.title = body.items[0].snippet.title;
          const p = db.addVideo(newVideo);
          newVideo.thumbnailUrl = thumbnailUrl;
          pubsub.publish('queueChanged', videoList);
          return p;
        }).then(() => ({error: null}))
      }),
      deleteVideo: (_, {id}, {userId}) => db.findUser(userId).then((user:any) => {
        const videoIndex = videoList.findIndex((v:any) => v.id == id);
        if (!user || videoIndex === -1 || (videoList[videoIndex].queuedBy.id !== userId && !user.admin)) {
          return {error:null};
        }

        videoList.splice(videoIndex, 1);
        if (videoIndex === 0 && videoList.length > 0) {
          videoList[0].thumbnailUrl = `https://img.youtube.com/vi/${videoList[0].youtubeId}/hqdefault.jpg`;
        }
        pubsub.publish('queueChanged', videoList);
        return db.deleteVideo(id).then(() => ({error:null}));
      }),
      skipVideo: () => {
        const id = videoList[0].id;
        videoList.splice(0, 1);
        if (videoList.length > 0) {
          videoList[0].thumbnailUrl = `https://img.youtube.com/vi/${videoList[0].youtubeId}/hqdefault.jpg`;
        }
        pubsub.publish('queueChanged', videoList);
        return db.deleteVideo(id).then(() => ({error:null}));
      }
    },

    Subscription: {
      queueChanged: () => videoList
    }
  }
});

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
  schema,
  setupFunctions: {
    queueChanged: () => ({
      queueChanged: () => true
    })
  },
  pubsub
});

new SubscriptionServer({
  subscriptionManager
}, websocketServer);

export default db.connect()
  .then(db.getVideos)
  .then(videos => {
    videoList = videos.map((v,i) => ({...v,thumbnailUrl:`https://img.youtube.com/vi/${v.youtubeId}/${i==0 ? 'hqdefault' : 'default'}.jpg`}));
    return graphqlExpress(req => ({ schema, context: { userId: req.signedCookies && req.signedCookies.user } }));
  });