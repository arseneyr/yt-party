import React from 'react';
import { SearchBar, SearchResults } from '../container/SearchResults';

export default () => (
  <div>
    <SearchBar
      onChange={() => null}
    />
    <SearchResults />
  </div>
);