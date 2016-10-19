import React from 'react'
import { Snackbar } from 'material-ui'
import { connect } from 'react-redux'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout2 = ({ children }) => (
  <div className='container text-center'>
    {children}
    <Snackbar open message='sup' />
  </div>
)

CoreLayout2.propTypes = {
  children : React.PropTypes.element.isRequired
}

export class CoreLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = { snackbar: null, message: null }
  }

  static propTypes = {
    children : React.PropTypes.element.isRequired,
    snackbar: React.PropTypes.object
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.snackbar !== this.state.snackbar) {
      this.setState({ snackbar: nextProps.snackbar, message: nextProps.snackbar.message})
    } else {
      //this.setState( { ...this.state, renderSnackbar: false } )
    }
  }

  render () {
    return <div className='container text-center'>
      {this.props.children}
      {this.state.message
        ? <Snackbar open message={this.state.message} autoHideDuration={this.props.snackbar.timeout} />
        : null
      }
    </div>
  }
}

export default connect( state => ({ snackbar: state.queue.snackbar }) )(CoreLayout)
