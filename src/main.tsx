import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore, combineReducers, applyMiddleware, compose, Reducer } from 'redux';
import { Provider } from 'react-redux';

import 'normalize.css/normalize.css';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient();

import { getReducer, injectReducer } from './reducer';
import App from './app';

const devTools = DEVELOPMENT ? window.__REDUX_DEVTOOLS_EXTENSION__ : undefined;
if (devTools) {
  devTools.open();
}

injectReducer({ apollo: client.reducer() });

const store = createStore(getReducer(), compose(
  applyMiddleware(client.middleware()),
  devTools ? devTools() : (f: any) => f
));

const rootEl = document.getElementById('root');
const renderApp = (Component = App) => {
  if (DEVELOPMENT) {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <ApolloProvider store={store} client={client}>
            <Component />
          </ApolloProvider>
        </Provider>
      </AppContainer>,
      rootEl
    );
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <ApolloProvider store={store} client={client}>
          <Component />
        </ApolloProvider>
      </Provider>,
      rootEl
    );
  }
};

if (DEVELOPMENT && module.hot) {
  store.replaceReducer(getReducer());
  module.hot.accept('./app', () => renderApp());
}

renderApp();
