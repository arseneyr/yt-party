import React, { Component, PropTypes } from 'react'
import VideoListItem from 'components/VideoListItem'
import { List, Snackbar } from 'material-ui'
import CheckIcon from 'material-ui/svg-icons/action/check-circle'

export class SearchResultList extends Component {
  static propTypes = {
    searchResults: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      selected: PropTypes.bool.isRequired
    }).isRequired),
    searchInProgress: PropTypes.bool.isRequired,
    tryQueueVideo: PropTypes.func.isRequired
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }

  render () {
    if (this.props.searchResults) {
      if (this.props.searchResults.length > 0) {
        return <List key='list'>
          {this.props.searchResults.map(r =>
            <SearchResult
              {...r}
              key={r.id}
              onClick={this.props.tryQueueVideo}
            />)}
        </List>
      } else {
        return <h1 key='no_results' style={{
          color: context.muiTheme.palette.secondaryTextColor,
          fontWeight: 300
        }}><i>Hmm... couldn't find anything</i></h1>
      }
    }

    return null
  }
}

export class SearchResult extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }

  //
  // binding like this avoids creating a new function on every render
  //
  onClick = () => this.props.selected
    ? null
    : this.props.onClick({
      id: this.props.id,
      title: this.props.title,
      thumbnailUrl: this.props.thumbnailurl
    })

  render () {
    return <VideoListItem
      title={<b key={this.props.id}>{this.props.title}</b>}
      thumbnailUrl={this.props.thumbnailUrl}
      rightIcon={this.props.selected ? <CheckIcon /> : null}
      onTouchTap={this.onClick}
    />
  }
}

export default SearchResultList
