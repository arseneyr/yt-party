import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import theme from './MainContainer.css';
import NameDialog from './NameDialog';
import { withQueue } from '../container/Queue';

const subscription = gql`
  subscription QueueChanged {
    queueChanged {
      id
      title
      thumbnailUrl
      queuedBy
    }
  }
`;

class MainContainer extends React.Component<any,any> {
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
      })
    }
  }

  render() {
    return <div
      className={theme.container}>
        <NameDialog />
        { this.props.children }
      </div>
  }
}

export default withQueue(MainContainer);