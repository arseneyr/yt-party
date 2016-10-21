import HomeView from '../components/HomeView'
import { connect } from 'react-redux'

export default connect(state => ({ queue: state.getIn(['queue','queue']) }))(HomeView)