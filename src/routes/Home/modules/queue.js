import { createAction } from 'redux-actions'
import { createDefaultReducer } from 'store/reducers'

export const QUEUE_UPDATED = 'QUEUE_UPDATED'
export const VIDEO_QUEUED_START = 'VIDEO_QUEUED_START'
export const DUPLICATE_VIDEO_QUEUED = 'DUPLICATE_VIDEO_QUEUED'

export const queueUpdated = createAction(QUEUE_UPDATED)
const videoQueuedStart = createAction(VIDEO_QUEUED_START)
const duplicateVideoQueued = createAction(DUPLICATE_VIDEO_QUEUED)
export const tryQueueVideo = videoId => (dispatch, getState) => {
  const state = getState().queue
  if (state.queue.find(v => v.videoId === videoId) ||
      state.pending.find(v => v.videoId === videoId)) {
        dispatch(duplicateVideoQueued(videoId))
      } else {
        dispatch(videoQueuedStart(videoId))
      }
}

export const canVideoBeQueued = (state, videoId) => {
  const test = v => v.videoId === videoId
  return !state.queue.find(test) && !state.pending.find(test)
}

const ACTION_HANDLERS = {
  [QUEUE_UPDATED]: (state, payload) => ({ ...state, queue: payload }),
  [VIDEO_QUEUED_START]: (state, payload) => ({ ...state, queue: state.queue.concat({ videoId: payload }) })
}

const initialState = { queue: [], pending: [] }

export default createDefaultReducer(ACTION_HANDLERS, initialState)