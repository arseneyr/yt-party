import { Action, combineReducers, Reducer } from 'redux';
import createBrowserHistory from 'history/createBrowserHistory';
import { BehaviorSubject, Observable } from 'rxjs';
import { Epic, createEpicMiddleware } from 'redux-observable';

const history = createBrowserHistory();


const counterStore = (state = 1, action: Action) => {
  switch (action.type) {
    case 'NEXT':
      return state + 1;
    case 'PREVIOUS':
      return state - 1;
    default:
      return state;
  }
};


const routerDefaultState = {
  history,
  location: history.location,
  action: history.action
}

const routerStore = (state = routerDefaultState, action: Action) => {
  switch (action.type) {
    case 'LOCATION_CHANGE':
      return Object.assign({}, state, (<any>action).router);
    default:
      return state;
  }
};

let reducers = {
  router: routerStore
};

export function injectReducer<T>(reducer: {[name: string]: Reducer<T>}) {
  reducers = {
    ...reducers,
    ...reducer
  }
}

const epic$ = new BehaviorSubject((actions$: any) => Observable.empty())

export const rootEpic = (action$: any, store: any) =>
  epic$.mergeMap((epic:any) =>
    epic(action$, store)
  )

let epics = {};

export const injectEpic = ({name, epic}) => {
  if (!epics[name]) {
    epics[name] = epic;
    epic$.next(epic);
  }
}

export const getReducer = () => combineReducers(reducers);
export const getEpicMiddleware = () => createEpicMiddleware(rootEpic);
