import React from 'react'
import { connect } from 'react-redux'
import { textUpdated } from '../modules/autoComplete'
import { startSearch, selectSearchResult } from '../modules/searchResults'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

import AutoComplete from '../components/AutoComplete'
const AutoCompleteContainer = connect(
  state => ({
    suggestions: state.search.autoComplete.suggestions
  }),
  { textUpdated, startSearch })(AutoComplete)

import SearchResults from '../components/SearchResults'
const SearchResultsContainer = connect(
  state => ({
    searchResults: state.search.searchResults.searchResults,
    searchInProgress: state.search.searchResults.searchInProgress
  }),
  { selectSearchResult })(SearchResults)

export default () => (
  <div>
    <AutoCompleteContainer />
    <SearchResultsContainer />
  </div>
)
