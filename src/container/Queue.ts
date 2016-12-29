import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import QueueComponent from '../components/Queue';

export const withQueue = graphql(gql`
  query Queue {
    queue {
      id
      thumbnailUrl
      title
      queuedBy {
        name
        id
      }
    }
  }
`, {
  props: ({ownProps, data}) => ({...ownProps, data, loading: data.loading, queue: data.queue})
});

export default withQueue(QueueComponent);