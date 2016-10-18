import React, { PropTypes } from 'react'
import VideoListItem from 'components/VideoListItem'
import { List } from 'material-ui'
import CheckIcon from 'material-ui/svg-icons/action/check-circle'

export const SearchResults = ({ searchResults, searchInProgress, selectSearchResult }, context) =>
  searchResults
    ? searchResults.length > 0
      ? <List>
        {searchResults.map(r =>
          <VideoListItem
            key={r.id}
            title={<b key={r.id}>{r.title}</b>}
            thumbnailUrl={r.thumbnailUrl}
            rightIcon={r.selected ? <CheckIcon /> : null}
            onTouchTap={() => r.selected ? null : selectSearchResult(r.id)}
          />)}
      </List>
      : <h1 style={{
        color: context.muiTheme.palette.secondaryTextColor,
        fontWeight: 300
      }}><i>Hmm... couldn't find anything</i></h1>
    : null

SearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired
  }).isRequired),
  searchInProgress: PropTypes.bool.isRequired,
  selectSearchResult: PropTypes.func.isRequired
}

SearchResults.contextTypes = {
  muiTheme: PropTypes.object.isRequired
}

export default SearchResults
