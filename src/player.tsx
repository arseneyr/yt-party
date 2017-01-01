import React from 'react';
import ReactDOM from 'react-dom';
import YouTube from 'react-youtube';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Client } from 'subscriptions-transport-ws';
import addGraphQLSubscriptions from './helper';

const client = new ApolloClient({
  networkInterface: addGraphQLSubscriptions(createNetworkInterface({
    uri: '/graphql',
    opts: {
      credentials: 'same-origin'
    }
  }), new Client(`ws://${window.location.hostname}:9090`))
});

const subscription = gql`
  subscription QueueChanged {
    queueChanged {
      youtubeId
    }
  }
`;

class PlayerComponent extends React.Component<any,any> {
  constructor() {
    super();
    this.subscription = null;
  }

  subscription:any = null;

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
    return <YouTube
      videoId={this.props.data.queue && this.props.data.queue.length > 0 && this.props.data.queue[0] && this.props.data.queue[0].youtubeId}
      onReady={event => event.target.playVideo()}
      opts={{playerVars:{
        iv_load_policy: 3
      }}}
      onEnd={() => this.props.skipVideo()}
      onStateChange={event => {console.log(event); if (event.data === 5 ) {event.target.playVideo()}}}
    />
  }
}

const withSkipMutation = graphql(gql`
  mutation SkipVideo {
    skipVideo {
      error
    }
  }
`, {
  props: ({ mutate }) => ({
    skipVideo: mutate
  })
});

const Player = withSkipMutation(graphql(gql`
  query Queue {
    queue {
      youtubeId
    }
  }
`)(PlayerComponent));

ReactDOM.render(
  <ApolloProvider client={client}>
    <Player />
  </ApolloProvider>,
  document.getElementById('root')
)