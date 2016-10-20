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
    this.state = { snackbar: null, open: false }
  }

  static propTypes = {
    children : React.PropTypes.element.isRequired,
    snackbar: React.PropTypes.object
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.snackbar && !nextProps.snackbar.equals(this.state.snackbar)) {
      this.setState({ snackbar: nextProps.snackbar, open: true })
    } else {
      this.setState({ open: false })
    }
  }

  render () {
    return <div className='container text-center'>
      {this.props.children}
      { this.props.snackbar
        ? <Snackbar
            open={this.state.open}
            message={this.props.snackbar.get('message')}
            autoHideDuration={this.props.snackbar.get('timeout')} />
        : null
      }
    </div>
  }
}

export default connect( state => ({ snackbar: state.getIn(['queue', 'snackbar']) }) )(CoreLayout)
