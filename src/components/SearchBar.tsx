import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import { Autocomplete as OldAutocomplete } from 'react-toolbox/lib/autocomplete';
import { connect } from 'react-redux';
import actions from '../actions';
import theme from './SearchBar.css';

const Autocomplete: any = OldAutocomplete;

interface SearchBarProps {
  suggestions?: string[];
  onChange: (newText: string) => void;
  onSubmit: (text: string) => void;
};

interface SearchBarState {
  searchText: string;
};

export default class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor() {
    super();
    this.state = {
      searchText: ''
    }
  }

  onChange = (newText: string) => {
    this.setState({
      ...this.state,
      searchText: newText
    });

    this.props.onChange(newText);

  }

  onSubmit = (text: string) => {
    this.setState({
      ...this.state,
      searchText: text
    });

    this.props.onSubmit(text);
  }

  render() {
   return (
    <AppBar theme={theme}
      fixed
      leftIcon='arrow_back'
      onLeftIconClick={() => window.history.back()}
      rightIcon={this.state.searchText && 'close'}
      onRightIconClick={() => this.setState({...this.state, searchText: ''})}
    >
      <form action='.'>
        <Autocomplete
          multiple={false}
          allowCreate
          source={this.props.suggestions}
          theme={theme}
          value={this.state.searchText}
          onQueryChange={this.onChange}
          onChange={this.onSubmit}
          hint='Search'
          showSuggestionsWhenValueIsSet
          type='search'
        />
      </form>
    </AppBar>
   )
  }
}
