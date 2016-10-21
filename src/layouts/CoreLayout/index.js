import CoreLayout from './CoreLayout'
import { connect } from 'react-redux'
import reducer, { epic, submitUsername } from './reducer'
import { injectEpic } from 'store/epics'
import { injectReducer } from 'store/reducers'

export * from './reducer'

export default store => {
  injectEpic(store, epic)
  injectReducer(store, { key: 'layout', reducer })
  return connect(state => ({ snackbar: state.getIn(['layout','snackbar']), usernameState: state.getIn(['layout','usernameState']) }), {submitUsername})(CoreLayout)
}
