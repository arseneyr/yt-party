import HomeView from '../components/HomeView'
import { connect } from 'react-redux'

export default connect(state => ({ queue: state.getIn(['queue','queue']), username: state.getIn(['queue','userId']), admin: state.getIn(['queue','admin']) }))(HomeView)