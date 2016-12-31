import { injectReducer, injectEpic } from '../reducer';
import { createAction, handleActions, Action, Reducer } from 'redux-actions';
import { withQueue } from './Queue';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import * as xhr from 'xhr';
import { Observable } from 'rxjs';
import { Epic } from 'redux-observable';
import SearchResultsComponent from '../components/SearchResults';
import SearchBarComponent from '../components/SearchBar';

interface SearchResult {
  id: string,
  title: string,
  views: number,
  duration: number,
  thumbnailUrl: string
}

interface SearchState {
  loading: boolean,
  results: SearchResult[]
}

const START_SEARCH = 'START_SEARCH';
const SEARCH_RESULTS = 'SEARCH_RESULTS';
type START_SEARCH = Action<string>;
type SEARCH_RESULTS = Action<SearchResult[]>

export const actions = {
  startSearch: createAction<string>(START_SEARCH),
  getSearchResults: createAction<SearchResult[]>(SEARCH_RESULTS)
};

const defaultState: SearchState = {
  loading: false,
  results: []
};

const reducer = handleActions<SearchState, any>({
  [START_SEARCH]: (state, action: START_SEARCH) => ({
    ...state,
    loading: true,
    results: []
  }),
  [SEARCH_RESULTS]: (state, action: SEARCH_RESULTS) => ({
    ...state,
    loading: false,
    results: action.payload
  }),
  LOCATION_CHANGE: (state) => ({
    ...state,
    loading: false,
    results: []
  })
}, defaultState);

injectReducer({
  search: reducer
});

const xhrObservable = Observable.bindNodeCallback(xhr);

function encodeParams(searchParams) {
  let queryString = ''
  for (let key in searchParams) {
    if (queryString !== '') {
      queryString += '&'
    }

    queryString += key + '=' + encodeURIComponent(searchParams[key])
  }
  return queryString;
}

function parseDuration(duration) {
   const matches = duration.match(/^PT([0-9]+H|)?([0-9]+M|)?([0-9]+S|)?$/);
   return (
     matches[1] ? parseInt(matches[1]) * 3600 : 0) +
     (matches[2] ? parseInt(matches[2]) * 60 : 0) +
     (matches[3] ? parseInt(matches[3]) : 0);
}

function runSearch (query) {
  const searchParams = {
    part: 'snippet',
    q: query,
    type: 'video',
    key: APP_CONFIG.YOUTUBE_API_KEY,
    maxResults: 25,
    fields: 'items(id/videoId,snippet(title,thumbnails/default/url))'
  }

  return xhrObservable(
    APP_CONFIG.YOUTUBE_SEARCH_ENDPOINT + '?' + encodeParams(searchParams),
    { useXDR: true, json: true })
    .mergeMap(e => {
      const results = e[0].body.items.map(f => ({
        id: f.id.videoId,
        title: f.snippet.title,
        thumbnailUrl: f.snippet.thumbnails.default.url
      }));
      const ids = results.map(f => f.id).join(',');
      const videoParams = {
        part: 'statistics,contentDetails',
        id: ids,
        maxResults: 25,
        key: APP_CONFIG.YOUTUBE_API_KEY,
        fields: 'items(statistics/viewCount,contentDetails/duration)'
      };

      return xhrObservable(
        APP_CONFIG.YOUTUBE_VIDEOS_ENDPOINT + '?' + encodeParams(videoParams),
        { useXDR: true, json: true })
        .map(videoResults => (
          results.map((r,i) => ({
            ...r,
            views: videoResults[0].body.items[i].statistics.viewCount,
            duration: parseDuration(videoResults[0].body.items[i].contentDetails.duration)
          }))
        ));
      })
}

const epic: Epic<START_SEARCH | SEARCH_RESULTS> = (actions$, store) =>
  actions$.ofType(START_SEARCH)
    .filter(action => action.payload.length > 0)
    .mergeMap(action => runSearch(action.payload).takeUntil(actions$.ofType('LOCATION_CHANGE')))
    .map(actions.getSearchResults);

injectEpic({name: 'search', epic});

const mutation = gql`
  mutation QueueVideoMutation($id: String!) {
    queueVideo(id: $id) {
      error
    }
  }
`
const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    addToQueue: ({id, title, thumbnailUrl}) => mutate({
      variables: {id},
      optimisticResponse: {
        __typename: 'Mutation',
        queueVideo: {
          __typename: 'QueueVideoResult',
          error: null
        }
      },
      updateQueries: {
        Queue: (prev, { mutationResult }) => (prev && prev.queue && !prev.queue.find(v=>v.youtubeId === id) ?
        {...prev, queue: prev.queue.concat({__typename: 'Video', title, id: '', queuedBy: {name:'',id:''}, youtubeId: id, thumbnailUrl})} : prev)
      }
    })
  })
});

export const SearchResults = compose(
  withMutation,
  withQueue,
  connect((state: any, ownProps: any) => ({
    ...ownProps,
    ...state.search,
    results: state.search.results.map((r,i) => ({...r, selected: !!ownProps.queue.find(q => q.youtubeId === r.id)}))
  })),
)(SearchResultsComponent);

export const SearchBar = (connect as any)(undefined, {onSubmit: actions.startSearch})(SearchBarComponent);