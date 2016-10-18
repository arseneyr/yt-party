import Home from './containers/HomeContainer'
import { injectReducer } from 'store/reducers'
import reducer, * as fromQueue from './modules/queue'

export const canVideoBeQueued = (state, videoId) =>
  fromQueue.canVideoBeQueued(state.queue, videoId)

export const reducerShape = { queue: reducer }

// Sync route definition
export default {
    component : Home
}
