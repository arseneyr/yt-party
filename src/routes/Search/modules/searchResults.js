import { Observable } from 'rxjs'
import { createAction } from 'redux-actions'
import { createDefaultReducer } from 'store/reducers'
import { canVideoBeQueued } from 'routes/Home'
import xhr from 'xhr'

import { LOCATION_CHANGE } from 'store/location'
import { TEXT_UPDATED } from './autoComplete'
import { VIDEO_QUEUED_START, DUPLICATE_VIDEO_QUEUED } from 'routes/Home/modules/queue'

import APP_CONFIG from 'config'

export const START_SEARCH = 'START_SEARCH'
export const SEARCH_RESULTS = 'SEARCH_RESULTS'
export const SELECT_SEARCH_RESULT = 'SELECT_SEARCH_RESULT'

const standardSelectSearchResult = createAction(SELECT_SEARCH_RESULT)

export const startSearch = createAction(START_SEARCH)
export const searchResults = createAction(SEARCH_RESULTS)
export const selectSearchResult = id => {
  return (dispatch, getState) => {
    if (canVideoBeQueued(getState(), id)) {
      dispatch(standardSelectSearchResult(id))
    }
  }
}

const xhrObservable = Observable.bindNodeCallback(xhr)

function runSearch (query) {
  const searchParams = {
    part: 'snippet',
    q: query,
    type: 'video',
    key: APP_CONFIG.YOUTUBE_API_KEY,
    maxResults: 25,
    fields: 'items(id/videoId, snippet(title,thumbnails/medium/url))'
  }

  let queryString = ''
  for (let key in searchParams) {
    if (queryString !== '') {
      queryString += '&'
    }

    queryString += key + '=' + encodeURIComponent(searchParams[key])
  }

  return xhrObservable(
    APP_CONFIG.YOUTUBE_SEARCH_ENDPOINT + '?' + queryString,
    { useXDR: true, json: true })
    .map(e => e[0].body.items)
}

export function epic (actions$, store) {
  return actions$.ofType(START_SEARCH)
    .filter(action => action.payload.length > 0)
    .mergeMap(action => runSearch(action.payload).takeUntil(actions$.ofType(LOCATION_CHANGE)))
    .map(results => searchResults(results.map(e => ({
      id: e.id.videoId,
      title: e.snippet.title,
      thumbnailUrl: e.snippet.thumbnails.medium.url }))))
}

const ACTION_HANDLERS = {
  [TEXT_UPDATED] : state => ({
    ...state,
    searchInProgress: false,
    searchResults: null }),
  [START_SEARCH] : state => ({ ...state, searchInProgress: true, searchResults: null }),
  [SEARCH_RESULTS] : (state, payload) => ({
    ...state,
    searchInProgress: false,
    searchResults: payload.map(e => ({ ...e, selected: false }))
  }),
  [VIDEO_QUEUED_START] : (state, payload) => {
    const searchResults = [...state.searchResults]
    searchResults.find(e => e.id === payload).selected = true
    return { ...state, searchResults }
  },
  [DUPLICATE_VIDEO_QUEUED] : (state, payload) => ({ ...state, duplicateItem: payload }),
  [LOCATION_CHANGE] : () => initialState
}

const initialState = { searchInProgress: false, searchResults: null, duplicateItem: null }

export default createDefaultReducer(ACTION_HANDLERS, initialState)
