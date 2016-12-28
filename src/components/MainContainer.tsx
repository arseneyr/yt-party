import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import theme from './MainContainer.css';
import NameDialog from './NameDialog';
import { query } from '../container/Queue';

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

const MainContainer1 = (props: React.HTMLProps<HTMLDivElement>) => (
  <div className={theme.container}>
    <NameDialog />
    { props.children }
  </div>
);

export default graphql(query)(MainContainer);