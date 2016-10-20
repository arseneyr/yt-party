import { combineReducers } from 'redux-immutable'
import locationReducer from './location'
import { reducerShape } from 'routes/Home'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    ...reducerShape,
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
