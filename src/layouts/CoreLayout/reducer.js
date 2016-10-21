import { createDefaultReducer, createAction } from 'store/reducers'
import { combineEpics } from 'redux-observable'
import Immutable from 'immutable'

export const USERNAME_DIALOG_STATE = {
  CLOSED: 0,
  REQUEST: 1,
  WAITING: 2,
  ERROR: 3
}

export const SNACKBAR_REQUEST = 'SNACKBAR_REQUEST'
export const SNACKBAR_POP = 'SNACKBAR_POP'
export const USERNAME_REQUEST = 'USERNAME_REQUEST'
export const USERNAME_SUBMIT = 'USERNAME_SUBMIT'
export const USERNAME_RESPONSE = 'USERNAME_RESPONSE'

export const popSnackbar = createAction(SNACKBAR_POP)
export const requestSnackbar = createAction(SNACKBAR_REQUEST)
export const requestUsername = createAction(USERNAME_REQUEST)
export const submitUsername = createAction(USERNAME_SUBMIT)
export const usernameResponse = createAction(USERNAME_RESPONSE)

const snackbarEpic = (actions$, store) =>
  actions$.ofType(SNACKBAR_REQUEST)
    .pluck('payload')
    .throttleTimeDistinct(2000, Immutable.is)
    //
    // Add the date to ensure that the prop changes
    //
    .map(e => popSnackbar(e.set('date', Date.now())))

const usernameEpic = (actions$, store) =>
  actions$.ofType(USERNAME_SUBMIT).ignoreElements()/*
  .pluck('payload')
  .do(console.log)
  .delay(2000)
  .mapTo(usernameResponse(false))*/

export const epic = combineEpics(snackbarEpic, usernameEpic)

const ACTION_HANDLERS = {
  [SNACKBAR_POP]: (state, payload) => state.set('snackbar', payload),
  [USERNAME_REQUEST]: state => state.set('usernameState', USERNAME_DIALOG_STATE.REQUEST),
  [USERNAME_SUBMIT]: state => state.set('usernameState', USERNAME_DIALOG_STATE.WAITING),
  [USERNAME_RESPONSE]: (state, payload) => state.set('usernameState', payload.get('valid') ? USERNAME_DIALOG_STATE.CLOSED : USERNAME_DIALOG_STATE.ERROR)
}

const initialState = Immutable.Map({ snackbar: null, usernameState: USERNAME_DIALOG_STATE.CLOSED })

export default createDefaultReducer(ACTION_HANDLERS, initialState)