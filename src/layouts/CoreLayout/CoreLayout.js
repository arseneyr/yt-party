import React from 'react'
import { Snackbar, Dialog, TextField, FlatButton, CircularProgress } from 'material-ui'
import { USERNAME_DIALOG_STATE } from './reducer'
import './CoreLayout.scss'
import '../../styles/core.scss'

export class CoreLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = { snackbar: null, open: false, usernameText: '', errorText: '', tempDisableButton: true }
  }

  static propTypes = {
    children : React.PropTypes.element.isRequired,
    snackbar: React.PropTypes.object,
    usernameState: React.PropTypes.number.isRequired,
    submitUsername: React.PropTypes.func.isRequired
  }

  componentWillReceiveProps (nextProps) {
    let state = {}
    if (nextProps.snackbar && !nextProps.snackbar.equals(this.state.snackbar)) {
      state = { snackbar: nextProps.snackbar, open: true }
    } else {
      state = { open: false }
    }

    if (nextProps.usernameState === USERNAME_DIALOG_STATE.ERROR &&
        this.props.usernameState !== USERNAME_DIALOG_STATE.ERROR) {

          state.errorText = 'This name is already taken'
          state.tempDisableButton = true
          this._input.focus()
    }

    this.setState(state)
  }

  componentDidUpdate (prevProps) {
    if (this.props.usernameState === USERNAME_DIALOG_STATE.ERROR &&
        prevProps.usernameState !== USERNAME_DIALOG_STATE.ERROR) {

        this._input.focus()
    }

  }

  handleUsernameFieldChange = (event) =>
    this.setState({
      usernameText: event.target.value, errorText: '',
      tempDisableButton: (event.target.value.length === 0)
    })

  submitUsername = (event) => {
    event.preventDefault()
    this.props.submitUsername(this.state.usernameText)
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
      <Dialog
        title="Please enter an alias"
        modal
        open={this.props.usernameState !== USERNAME_DIALOG_STATE.CLOSED}
        actions={
          <FlatButton
            label={this.props.usernameState !== USERNAME_DIALOG_STATE.WAITING ? "GO!" : null}
            onTouchTap={this.submitUsername}
            disabled={this.state.tempDisableButton || this.props.usernameState === USERNAME_DIALOG_STATE.WAITING}
            primary={this.state.usernameText.length > 0}
          >{this.props.usernameState === USERNAME_DIALOG_STATE.WAITING ? <CircularProgress style={{ paddingTop:'3px' }} size={25}/> : null}</FlatButton>}
      >
        <form onSubmit={this.state.errorText === '' ? this.submitUsername : e => e.preventDefault()} style={{ height:'62px' }}>
        <TextField
          autoFocus
          fullWidth
          ref={i => this._input = i}
          hintText='Cool nickname'
          errorText={this.state.errorText}
          onChange={this.handleUsernameFieldChange}
          disabled={this.props.usernameState === USERNAME_DIALOG_STATE.WAITING}
        />
        </form>
      </Dialog>
    </div>
  }
}

export default CoreLayout
