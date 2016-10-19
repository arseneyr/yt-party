import { Observable } from 'rxjs'
import { createAction } from 'redux-actions'
import { createDefaultReducer } from 'store/reducers'
import { canVideoBeQueued } from 'routes/Home'
import { combineEpics } from 'redux-observable'
import xhr from 'xhr'

import { LOCATION_CHANGE } from 'store/location'
import { TEXT_UPDATED } from './autoComplete'
import { VIDEO_QUEUED_START, DUPLICATE_VIDEO_QUEUED, requestSnackbar } from 'routes/Home/modules/queue'

import APP_CONFIG from 'config'

export const START_SEARCH = 'START_SEARCH'
export const SEARCH_RESULTS = 'SEARCH_RESULTS'

export const startSearch = createAction(START_SEARCH)
export const searchResults = createAction(SEARCH_RESULTS)

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

const duplicateEpic = (actions$, store) =>
  actions$.ofType(DUPLICATE_VIDEO_QUEUED)
  .map(action => {
    const title = store.getState().search.searchResults.searchResults.find(e => e.id === action.payload.id).title
    return requestSnackbar({ message: `Already queued "${title}"`, timeout: 3000 })
  })

const videoQueuedEpic = (actions$, store) =>
  actions$.ofType(VIDEO_QUEUED_START)
  .map()

const searchEpic = (actions$, store) =>
  actions$.ofType(START_SEARCH)
    .filter(action => action.payload.length > 0)
    .mergeMap(action => runSearch(action.payload).takeUntil(actions$.ofType(LOCATION_CHANGE)))
    .map(results => searchResults(results.map(e => ({
      id: e.id.videoId,
      title: e.snippet.title,
      thumbnailUrl: e.snippet.thumbnails.medium.url }))))

export const epic = combineEpics(duplicateEpic, searchEpic)

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
    searchResults.find(e => e.id === payload.id).selected = true
    return { ...state, searchResults }
  },
  [LOCATION_CHANGE] : () => initialState
}

const initialState = { searchInProgress: false, searchResults: null }

export default createDefaultReducer(ACTION_HANDLERS, initialState)
