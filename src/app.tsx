import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Match } from 'react-router';
import Router from 'react-router-addons-controlled/ControlledBrowserRouter';
import MainContainer from './container/MainContainer';

import actions from './actions';

import Home from './routes/home';
import Counter from './routes/counter';

import 'react-toolbox/lib/commons.css';
import './styles/main.css';

const App = ({ router, setLocation }: any) => (
  <Router
    history={router.history}
    location={router.location}
    action={router.action}
    onChange={(routerState: any, action: any) => {
      // https://github.com/ReactTraining/react-router-addons-controlled/blob/master/redux-example/index.js#L55
      setLocation(routerState, action === 'SYNC' ? router.action : action);
    }}
  >
      <MainContainer>
        <Match exactly pattern="/" component={Home} />
        <Match exactly pattern="/counter" component={Counter} />
      </MainContainer>
  </Router>
);

const stateToProps = ({ router }: any) => ({ router });

const dispatchToProps = {
  setLocation: actions.setLocation
}

export default connect(stateToProps, dispatchToProps)(App);
