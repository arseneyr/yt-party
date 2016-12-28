import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import QueueComponent from '../components/Queue';

export const query = gql`
  query Test {
    queue {
      id
      thumbnailUrl
      title
      queuedBy
    }
    nowPlaying {
      id
      thumbnailUrl
      title
      queuedBy
    }
  }
`;

export default graphql(query)(QueueComponent);