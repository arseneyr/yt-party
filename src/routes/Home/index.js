import Home from './containers/HomeContainer'
import { injectReducer } from 'store/reducers'
import { injectEpic } from 'store/epics'
import reducer, { epic } from './modules/queue'

export const reducerShape = { queue: reducer }

injectEpic(epic)

// Sync route definition
export default {
    component : Home
}
