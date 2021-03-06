import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import makeRootReducer from './reducers'
import { updateLocation } from './location'
import { createEpicMiddleware } from 'redux-observable'
import { rootEpic } from './epics'
import { Map, Set } from 'immutable'

export default (initialState = Map()) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const middleware = [thunk, epicMiddleware]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}
  store.epics = Set()

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })

    module.hot.accept('./epics', () => {
      const newRootEpic = require('./epics').rootEpic
      epicMiddleware.replaceEpic(newRootEpic)
    })
  }

  return store
}
