import React, { Component, PropTypes } from 'react'
import VideoListItem from 'components/VideoListItem'
import { List, Snackbar } from 'material-ui'
import CheckIcon from 'material-ui/svg-icons/action/check-circle'

export const SearchResults2 = ({ searchResults, searchInProgress, tryQueueVideo, duplicateItem }, context) =>
  <div>{[
    searchResults
      ? searchResults.length > 0
        ? <List>
          {searchResults.map(r =>
            <VideoListItem
              key={r.id}
              title={<b key={r.id}>{r.title}</b>}
              thumbnailUrl={r.thumbnailUrl}
              rightIcon={r.selected ? <CheckIcon /> : null}
              onTouchTap={() => r.selected ? null : tryQueueVideo(r.id)}
            />)}
        </List>
        : <h1 style={{
          color: context.muiTheme.palette.secondaryTextColor,
          fontWeight: 300
        }}><i>Hmm... couldn't find anything</i></h1>
      : null,

      <Snackbar message="sup" open autoHideDuration={3000}/>
  ]}</div>

export class SearchResultList extends Component {
  static propTypes = {
    searchResults: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      selected: PropTypes.bool.isRequired
    }).isRequired),
    searchInProgress: PropTypes.bool.isRequired,
    tryQueueVideo: PropTypes.func.isRequired,
    duplicateItem: PropTypes.string
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }

  renderList () {
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

  renderSnackbar () {
    if (this.props.duplicateItem) {
      const title = this.props.searchResults.find(r => r.id == this.props.duplicateItem).title
      return <Snackbar key='snackbar' message={title} open />
    }

    return null
  }

  render () {
    return <div>{[
      this.renderList(),
      this.renderSnackbar()
    ]}</div>
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

  onClick = () => this.props.selected ? null : this.props.onClick(this.props.id)

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
