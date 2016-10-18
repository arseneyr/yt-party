import { Observable, BehaviorSubject } from 'rxjs'

const epic$ = new BehaviorSubject((actions$) => Observable.empty())

export const rootEpic = (action$, store) =>
  epic$.mergeMap(epic =>
    epic(action$, store)
  )

export const injectEpic = newEpic => epic$.next(newEpic)
