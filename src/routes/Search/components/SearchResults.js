import React, { Component, PropTypes } from 'react'
import VideoListItem from 'components/VideoListItem'
import { List, Snackbar } from 'material-ui'
import CheckIcon from 'material-ui/svg-icons/action/check-circle'

export class SearchResultList extends Component {
  static propTypes = {
    searchResults: PropTypes.arrayOf(PropTypes.shape({
      video: PropTypes.shape({
        id: PropTypes.string.isRequired,
        thumbnailUrl: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
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
      if (this.props.searchResults.size > 0) {
        return <List key='list'>
          {this.props.searchResults.toArray().map(r =>
            <SearchResult
              video={r.get('video')}
              selected={r.get('selected')}
              key={r.getIn(['video','id'])}
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
    video: PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }

  onClick = () => this.props.selected
    ? null
    : this.props.onClick(this.props.video)

  render () {
    return <VideoListItem
      title={<b key={this.props.video.get('id')}>{this.props.video.get('title')}</b>}
      thumbnailUrl={this.props.video.get('thumbnailUrl')}
      rightIcon={this.props.selected ? <CheckIcon /> : null}
      onTouchTap={this.onClick}
    />
  }
}

export default SearchResultList
