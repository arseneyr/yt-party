import React, { PropTypes, Component } from 'react'
import { AppBar, IconButton, AutoComplete as MuiAutoComplete, MenuItem } from 'material-ui'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { Link } from 'react-router'

let fontStyle = { fontSize: 24, fontWeight:400 }

export class AutoComplete extends Component {
  constructor (props) {
    super(props)
    this.state = { searchText: '' }
  }

  static propTypes = {
    textUpdated : PropTypes.func.isRequired,
    startSearch: PropTypes.func.isRequired,
    suggestions   : PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  }

  updateText (searchText) {
    this.setState({ searchText })
    return this.props.textUpdated(searchText)
  }

  render () {
    const styledSuggestions = this.props.suggestions.map(s => {
      const searchText = this.state.searchText
      const loc = s.indexOf(searchText)
      return {
        text: s,
        value: loc === 0
          ? <MenuItem
            primaryText={[
              s.substring(0, searchText.length),
              <b key={s}>{s.substring(searchText.length, s.length)}</b>]} />
          : s }
    })

    return <AppBar
      iconElementLeft={<IconButton containerElement={<Link to='/' />}><ArrowBack /></IconButton>}
      iconElementRight={this.state.searchText
      ? <IconButton onTouchTap={() => {
        this.updateText('')
        this.refs.autoComplete.focus()
      }}><CloseIcon /></IconButton>
      : null}
      title={
        <MuiAutoComplete
          ref='autoComplete'
          inputStyle={{ ...fontStyle, color: '#ffffff' }}
          dataSource={styledSuggestions}
          underlineShow={false}
          hintText='Search'
          hintStyle={{ ...fontStyle, color: 'rgba(255, 255, 255, 0.4)' }}
          fullWidth
          onUpdateInput={text => this.updateText(text)}
          menuCloseDelay={0}
          autoFocus
          searchText={this.state.searchText}
          onNewRequest={selected => this.props.startSearch(typeof selected === 'string' ? selected : selected.text)}
        />
      }
    />
  }
}

export default AutoComplete
