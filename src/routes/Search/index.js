import { injectReducer } from '../../store/reducers'
import { injectEpic } from '../../store/epics'
import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux-immutable'

export default (store) => ({
  path : 'search',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Search = require('./containers/SearchContainer').default

      const autoComplete = require('./modules/autoComplete').default
      const searchResults = require('./modules/searchResults').default

      const autoCompleteEpic = require('./modules/autoComplete').epic
      const searchResultsEpic = require('./modules/searchResults').epic

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, {
        key: 'search',
        reducer: combineReducers({ autoComplete, searchResults })
      })

      injectEpic(store, autoCompleteEpic)
      injectEpic(store, searchResultsEpic)

      /*  Return getComponent   */
      cb(null, Search)

    /* Webpack named bundle   */
    }, 'search')
  }
})
