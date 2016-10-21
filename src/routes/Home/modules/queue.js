import { createDefaultReducer, createAction } from 'store/reducers'
import Immutable from 'immutable'

import { USERNAME_RESPONSE } from 'layouts/CoreLayout'

export const QUEUE_UPDATED = 'QUEUE_UPDATED'
export const VIDEO_QUEUED_START = 'VIDEO_QUEUED_START'
export const DUPLICATE_VIDEO_QUEUED = 'DUPLICATE_VIDEO_QUEUED'

export const queueUpdated = createAction(QUEUE_UPDATED)
const videoQueuedStart = createAction(VIDEO_QUEUED_START)
const duplicateVideoQueued = createAction(DUPLICATE_VIDEO_QUEUED)

export const tryQueueVideo = video => (dispatch, getState) => {
  const state = getState().get('queue')
  if (state.get('queue').find(e => e.get('video').equals(video)) ||
      state.get('pending').find(e => e.get('video').equals(video))) {
        dispatch(duplicateVideoQueued(video))
      } else {
        dispatch(videoQueuedStart(video))
      }
}

const ACTION_HANDLERS = {
  [QUEUE_UPDATED]: (state, payload) => ({ ...state, queue: payload }),
  [VIDEO_QUEUED_START]: (state, payload) => state.update('queue', l => l.push(Immutable.Map({video: payload}))),
  [USERNAME_RESPONSE]: (state, payload) => payload.get('valid') ? state.set('username', payload.get('username')) : state
}

const initialState = Immutable.fromJS({ queue: [], pending: [], username: null})

export default createDefaultReducer(ACTION_HANDLERS, initialState)