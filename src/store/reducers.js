import { combineReducers } from 'redux'
import locationReducer from './location'
import { queueReducerShape } from 'routes/Home'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    ...queueReducerShape,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export function createDefaultReducer(actionHandlers, initialState) {
  return (state = initialState, action) =>
  {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action.payload) : state
  }
}

export default makeRootReducer
