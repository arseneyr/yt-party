import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import QueueComponent from '../components/Queue';
import { withCurrentUser } from '../components/NameDialog';

export const withQueue = graphql(gql`
  query Queue {
    queue {
      id
      youtubeId
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

const withDeleteMutation = graphql(gql`
  mutation DeleteVideoMutation($id: String!) {
    deleteVideo(id: $id) {
      error
    }
  }
`, {
  props: ({ownProps, mutate}) => ({
    ...ownProps,
    deleteVideo: (id) => mutate({
      variables: {id},
      /*optimisticResponse: {
        __typename: 'Mutation',
        deleteVideo: {
          __typename: 'Boolean',

        }
      }*/

    })
  })
})

export default withDeleteMutation(withCurrentUser(withQueue(QueueComponent)));