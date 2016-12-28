import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as numeral from 'numeral';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import { Avatar } from 'react-toolbox/lib/avatar'
import theme from './SearchResults.css'

interface SearchResultsProps {
  results: {
    id: string
    thumbnailUrl: string,
    title: string,
    duration: number,
    views: number,
    selected: boolean
  }[],
  loading: boolean,
  addToQueue: (video: any) => void
};

function toHHMMSS (sec_num: number) {
  let hours:any   = Math.floor(sec_num / 3600);
  let minutes:any = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds:any = sec_num - (hours * 3600) - (minutes * 60);

  if (hours === 0) { hours = '' }
  else {hours = hours+':' }
  if (minutes < 10 && hours !== '') {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+''+minutes+':'+seconds;
}

const SearchResults = ({ results, loading, addToQueue }: SearchResultsProps) => (
  <List theme={theme}>
    {
      !loading && results.length > 0 ?
        results.map(v => (
          <ListItem
            theme={theme}
            key={v.id}
            caption={v.title}
            selectable={!v.selected}
            ripple={!v.selected}
            legend={`${toHHMMSS(v.duration)} - ${numeral(v.views).format('0a')} Views`}
            onClick={() => !v.selected && addToQueue(v)}
            rightIcon={v.selected && 'check_circle'}
            leftActions={[ <img
                key={v.id}
                src={v.thumbnailUrl}
            />]} />
        )) : []
    }
  </List>
);

export default SearchResults;
