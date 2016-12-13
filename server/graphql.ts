import { graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

const mockData: {videos: {id: string}[]} = require('../testdata.json');

export default graphqlExpress({ schema: makeExecutableSchema({
  typeDefs: `
    type Video {
      id: String!
      thumbnailUrl: String
    }

    type Query {
      videos: [Video]!
    }

    schema {
      query: Query
    }
  `,
  resolvers: {
    Query: {
      videos: () => mockData.videos.map(v => ({...v, thumbnailUrl: `https://img.youtube.com/vi/${v.id}/default.jpg`}))
    }
  }
})
})