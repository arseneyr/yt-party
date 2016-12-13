import { graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import * as Chance from 'chance';

const chance = new Chance();

const mockData: {videos: {id: string}[]} = require('../testdata.json');

export default graphqlExpress({ schema: makeExecutableSchema({
  typeDefs: `
    type Video {
      id: String!
      title: String!
      thumbnailUrl: String
      queuedBy: String
    }

    type Query {
      nowPlaying: Video
      queue: [Video]!
    }

    schema {
      query: Query
    }
  `,
  resolvers: {
    Query: {
      queue: () => mockData.videos.map(v => ({...v, title: chance.sentence({words: 20}), queuedBy:chance.name(), thumbnailUrl: `https://img.youtube.com/vi/${v.id}/default.jpg`})),
      nowPlaying: () => ({...mockData.videos[0], title: chance.sentence({words: 10}), thumbnailUrl: `http://img.youtube.com/vi/${mockData.videos[0].id}/maxresdefault.jpg`, queuedBy: chance.name()})
    }
  }
})
})