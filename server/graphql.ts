import { graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import * as Chance from 'chance';
import * as Promise from 'bluebird';
import { createServer } from 'http';

const chance = new Chance();
const mockData: {videos: {id: string}[]} = require('../testdata.json');
let currentUser: {id:string, admin:boolean} = null;
let wrongTries = 1;

const websocketServer = createServer((req,res) => {
  res.writeHead(404);
  res.end();
});

websocketServer.listen(8080);

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
      queue: getVideos,
      currentUser: () => currentUser
    },

    Mutation: {
      createUser: (_, {name}, {user}) => Promise.delay(1000).then(() => {
        if (!user) {
          return {error: "HACKER!"};
        }
        if (wrongTries-- > 0) {
          return { error: "Name already taken!" };
        }
        currentUser = { id: user, admin:false };
        return {
          user: currentUser
        }
      }),
      queueVideo: (_, {id}) => {
        mockData.videos.push({id});
        pubsub.publish('queueChanged', getVideos());
        return {
          error: null
        }
      }
    },

    Subscription: {
      queueChanged: () => getVideos()
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

export default graphqlExpress(req => ({ schema, context: { user: req.signedCookies.user } }));