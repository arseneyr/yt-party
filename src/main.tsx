import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import appReducer from './reducer';

import App from './app';

const devTools = DEVELOPMENT ? window.__REDUX_DEVTOOLS_EXTENSION__ : undefined;
if (devTools) {
  devTools.open();
}

const store = createStore(appReducer, devTools && devTools());

const rootEl = document.getElementById('root');
const renderApp = (Component = App) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    rootEl
  );
};

if (module.hot) {
  module.hot.accept('./reducer', () => {
    const nextReducer = require('./reducer').default;
    store.replaceReducer(nextReducer);
  });

  module.hot.accept('./app', () => renderApp());
}

injectTapEventPlugin();
renderApp();
