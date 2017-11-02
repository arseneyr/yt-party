import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import QueueComponent from '../components/Queue';
import { withCurrentUser } from '../components/NameDialog';
import { onSubscriptionReconnect } from '../main';

const subscription = gql`
  subscription QueueChanged {
    queueChanged {
      id
      youtubeId
      title
      thumbnailUrl
      queuedBy {
        name
        id
      }
    }
  }
`;

export const withQueue = (WrappedComponent) => {

  class QueueWrapper extends Component<any,any> {
    constructor() {
      super();
    }

    subscription = null;

    componentWillReceiveProps() {
      if (!this.subscription) {
        this.subscription = this.props.data.subscribeToMore({
          document: subscription,
          updateQuery: (prev, newData) => ({
            ...prev,
            queue: newData.subscriptionData.data.queueChanged
          })
        });

        onSubscriptionReconnect(this.props.refetchQueue);
      }
    }

    render() {
      return <WrappedComponent
        {...this.props}
      />;
    }
  }

  return withDeleteMutation(withCurrentUser(withQueueQuery(QueueWrapper)));
}

export const withQueueQuery = graphql(gql`
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
  props: ({ownProps, data}) => ({...ownProps, data, refetchQueue: data.refetch, loading: data.loading, queue: data.queue})
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

export default withQueue(QueueComponent);