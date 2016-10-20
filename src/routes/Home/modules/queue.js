import { createRegAction } from 'redux-actions'
import { createDefaultReducer } from 'store/reducers'
import Immutable from 'immutable'

export const QUEUE_UPDATED = 'QUEUE_UPDATED'
export const VIDEO_QUEUED_START = 'VIDEO_QUEUED_START'
export const DUPLICATE_VIDEO_QUEUED = 'DUPLICATE_VIDEO_QUEUED'
export const REQUEST_SNACKBAR = 'REQUEST_SNACKBAR'
export const SNACKBAR_POP = 'SNACKBAR_POP'

const createAction = action => (...args) => ({ type: action, payload: Immutable.fromJS(args.length === 1 ? args[0] : args) })

export const queueUpdated = createAction(QUEUE_UPDATED)
const videoQueuedStart = createAction(VIDEO_QUEUED_START)
const duplicateVideoQueued = createAction(DUPLICATE_VIDEO_QUEUED)
export const popSnackbar = createAction(SNACKBAR_POP)
export const requestSnackbar = createAction(REQUEST_SNACKBAR)

export const tryQueueVideo = video => (dispatch, getState) => {
  const state = getState().get('queue')
  if (state.get('queue').find(e => e.get('video').equals(video)) ||
      state.get('pending').find(e => e.get('video').equals(video))) {
        dispatch(duplicateVideoQueued(video))
      } else {
        dispatch(videoQueuedStart(video))
      }
}

export const epic = (actions$, store) =>
  actions$.ofType(REQUEST_SNACKBAR)
    .pluck('payload')
    .throttleTimeDistinct(2000, Immutable.is)
    //
    // Add the date to ensure that the prop changes
    //
    .map(e => popSnackbar(e.set('date', Date.now())))

const ACTION_HANDLERS = {
  [QUEUE_UPDATED]: (state, payload) => ({ ...state, queue: payload }),
  [VIDEO_QUEUED_START]: (state, payload) => state.update('queue', l => l.push(Immutable.Map({video: payload}))),
  [SNACKBAR_POP]: (state, payload) => state.set('snackbar', payload)
}

const initialState = Immutable.fromJS({ queue: [], pending: [], snackbar: null })

export default createDefaultReducer(ACTION_HANDLERS, initialState)