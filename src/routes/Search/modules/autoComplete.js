// ------------------------------------
// Constants
// ------------------------------------
import jsonp from 'jsonp'
import { Observable } from 'rxjs'
import { createAction } from 'redux-actions'
import { createDefaultReducer } from 'store/reducers'

import { LOCATION_CHANGE } from 'store/location'
import { START_SEARCH } from './searchResults'

import APP_CONFIG from 'config'

export const TEXT_UPDATED = 'TEXT_UPDATED'
export const UPDATED_SUGGESTIONS = 'UPDATED_SUGGESTIONS'

// ------------------------------------
// Actions
// ------------------------------------

export const textUpdated = createAction(TEXT_UPDATED)
export const updatedSuggestions = createAction(UPDATED_SUGGESTIONS)

const jsonpObservable = Observable.bindNodeCallback(jsonp)

export function epic (actions$, store) {
  return actions$.ofType(TEXT_UPDATED)
    .debounceTime(100)
    .filter(action => action.payload.length > 0)
    .mergeMap(action =>
      jsonpObservable(APP_CONFIG.YOUTUBE_AUTOCOMPLETE_ENDPOINT + action.payload)
      .takeUntil(actions$.ofType(LOCATION_CHANGE, START_SEARCH)))
    .map(e => updatedSuggestions(e[1].map(f => f[0])))
}

export const actions = {
  // updateSearch
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TEXT_UPDATED] : (state, payload) => ({
    ...state,
    searchText: payload }),
  [UPDATED_SUGGESTIONS] : (state, payload) => ({ ...state, suggestions: payload }),
  [LOCATION_CHANGE] : () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { searchText: '', suggestions: [] }

export default createDefaultReducer(ACTION_HANDLERS, initialState)
