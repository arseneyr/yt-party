import { Observable } from 'rxjs'
import { createDefaultReducer, createAction } from 'store/reducers'
import { canVideoBeQueued } from 'routes/Home'
import { combineEpics } from 'redux-observable'
import xhr from 'xhr'
import Immutable from 'immutable'

import { LOCATION_CHANGE } from 'store/location'
import { TEXT_UPDATED } from './autoComplete'
import { VIDEO_QUEUED_START, DUPLICATE_VIDEO_QUEUED } from 'routes/Home/modules/queue'
import { requestSnackbar } from 'layouts/CoreLayout'

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
    return requestSnackbar({ message: `Already queued "${action.payload.get('title')}"`, timeout: 3000 })
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
  [TEXT_UPDATED] : state => state.merge({
    searchInProgress: false,
    searchResults: null }),
  [START_SEARCH] : state => state.merge({ searchInProgress: true, searchResults: null }),
  [SEARCH_RESULTS] : (state, payload) => state.merge({
    searchInProgress: false,
    searchResults: payload.map(e => Immutable.Map({ video: e, selected: false }))
  }),
  [VIDEO_QUEUED_START] : (state, payload) => {
    const index = state.get('searchResults').findIndex(e => e.get('video').equals(payload))
    return state.update('searchResults', r => r.update(index, m => m.set('selected', true)))
  },
  [LOCATION_CHANGE] : () => initialState
}

const initialState = Immutable.fromJS({ searchInProgress: false, searchResults: null })

export default createDefaultReducer(ACTION_HANDLERS, initialState)
