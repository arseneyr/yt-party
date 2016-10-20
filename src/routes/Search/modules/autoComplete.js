// ------------------------------------
// Constants
// ------------------------------------
import jsonp from 'jsonp'
import { Observable } from 'rxjs'
import { createDefaultReducer } from 'store/reducers'

import { LOCATION_CHANGE } from 'store/location'
import { START_SEARCH } from './searchResults'
import Immutable from 'immutable'

import APP_CONFIG from 'config'

export const TEXT_UPDATED = 'TEXT_UPDATED'
export const UPDATED_SUGGESTIONS = 'UPDATED_SUGGESTIONS'

const createAction = action => (...args) => ({ type: action, payload: Immutable.fromJS(args.length === 1 ? args[0] : args) })

// ------------------------------------
// Actions
// ------------------------------------

export const textUpdated = createAction(TEXT_UPDATED)
export const updatedSuggestions = createAction(UPDATED_SUGGESTIONS)

const jsonpObservable = Observable.bindNodeCallback(jsonp)
window.search = (term,fn) => jsonp(APP_CONFIG.YOUTUBE_AUTOCOMPLETE_ENDPOINT + term, (err, data) => fn(data))

export function epic (actions$, store) {
  return actions$.ofType(TEXT_UPDATED)
    .debounceTime(100)
    .filter(action => action.payload.length > 0)
    .mergeMap(action =>
      jsonpObservable(APP_CONFIG.YOUTUBE_AUTOCOMPLETE_ENDPOINT + action.payload)
      .takeUntil(actions$.ofType(LOCATION_CHANGE, START_SEARCH)))
    .map(e => updatedSuggestions(e[1].map(f => f[0])))
}

window.epic = epic
window.Observable = Observable

export const actions = {
  // updateSearch
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TEXT_UPDATED] : (state, payload) => state.set('searchText', payload),
  [UPDATED_SUGGESTIONS] : (state, payload) => state.set('suggestions', payload),
  [LOCATION_CHANGE] : () => initialState
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Immutable.fromJS({ searchText: '', suggestions: [] })

export default createDefaultReducer(ACTION_HANDLERS, initialState)
