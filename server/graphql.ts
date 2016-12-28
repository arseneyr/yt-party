import { graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import * as Chance from 'chance';
import * as Promise from 'bluebird';

const chance = new Chance();
const mockData: {videos: {id: string}[]} = require('../testdata.json');
let currentUser: string = null;
let wrongTries = 1;

export default graphqlExpress({ schema: makeExecutableSchema({
  typeDefs: `
    type Video {
      id: String!
      title: String!
      thumbnailUrl: String
      queuedBy: String
    }

    type CurrentUser {
      name: String
      admin: Boolean!
    }

    type Query {
      currentUser: CurrentUser!
      nowPlaying: Video
      queue: [Video]!
      video(id: String!) : Video
    }

    type Error {
      errorString: String!
    }

    type CreateUserResult {
      user: CurrentUser
      error: String
    }

    type QueueVideoResult {
      error: String
    }

    type Mutation {
      createUser(name: String!): CreateUserResult
      queueVideo(id: String!): QueueVideoResult
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `,
  resolvers: {
    Query: {
      queue: () => mockData.videos.map(v => ({...v, title: chance.sentence({words: chance.integer({min: 1, max: 20})}), queuedBy:chance.name(), thumbnailUrl: `https://img.youtube.com/vi/${v.id}/default.jpg`})),
      nowPlaying: () => ({...mockData.videos[0], title: chance.sentence({words: 10}), thumbnailUrl: `http://img.youtube.com/vi/${mockData.videos[0].id}/maxresdefault.jpg`, queuedBy: chance.name()}),
      currentUser: () => ({ admin: false, name: currentUser })
    },

    Mutation: {
      createUser: (_, {name}) => Promise.delay(1000).then(() => {
        if (wrongTries-- > 0) {
          return { error: "Name already taken!" };
        }
        currentUser = name;
        return {
          user: {
            name: currentUser,
            admin: false
          }
        }
      }),
      queueVideo: (_, {id}) => {
        mockData.videos.push({id});
        return {
          error: null
        }
      }
    }
  }
})
})