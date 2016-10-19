import { createAction } from 'redux-actions'
import { createDefaultReducer } from 'store/reducers'

export const QUEUE_UPDATED = 'QUEUE_UPDATED'
export const VIDEO_QUEUED_START = 'VIDEO_QUEUED_START'
export const DUPLICATE_VIDEO_QUEUED = 'DUPLICATE_VIDEO_QUEUED'
export const REQUEST_SNACKBAR = 'REQUEST_SNACKBAR'
export const SNACKBAR_POP = 'SNACKBAR_POP'

export const queueUpdated = createAction(QUEUE_UPDATED)
const videoQueuedStart = createAction(VIDEO_QUEUED_START)
const duplicateVideoQueued = createAction(DUPLICATE_VIDEO_QUEUED)
export const popSnackbar = createAction(SNACKBAR_POP)
export const requestSnackbar = createAction(REQUEST_SNACKBAR)

export const tryQueueVideo = video => (dispatch, getState) => {
  const state = getState().queue
  if (state.queue.find(v => v.videoId === video.id) ||
      state.pending.find(v => v.videoId === video.id)) {
        dispatch(duplicateVideoQueued(video))
      } else {
        dispatch(videoQueuedStart(video))
      }
}

export const epic = (actions$, store) =>
  actions$.ofType(REQUEST_SNACKBAR)
    .throttleTimeDistinct(2000, (x,y) => x.payload.message === y.payload.message)
    .map(e => popSnackbar(e.payload))

const ACTION_HANDLERS = {
  [QUEUE_UPDATED]: (state, payload) => ({ ...state, queue: payload }),
  [VIDEO_QUEUED_START]: (state, payload) => ({ ...state, queue: state.queue.concat({ videoId: payload.id }) }),
  [SNACKBAR_POP]: (state, payload) => ({ ...state, snackbar: payload })
}

const initialState = { queue: [], pending: [], snackbar: null }

export default createDefaultReducer(ACTION_HANDLERS, initialState)