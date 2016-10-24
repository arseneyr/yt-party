import config from 'config'
import socket_io from 'socket.io-client'
import { injectEpic } from 'store/epics'
import { Observable } from 'rxjs'
import { combineEpics } from 'redux-observable'

import { requestUsername, USERNAME_SUBMIT, usernameResponse } from 'layouts/CoreLayout'
import { updateQueue, VIDEO_QUEUED_START } from 'routes/Home/modules/queue'

const socket = socket_io(config.compiler_public_path)

let connected = false;

const observableEmit = Observable.bindCallback(socket.emit.bind(socket))

const usernameEpic = (actions$, store) =>
  actions$.ofType(USERNAME_SUBMIT)
    .pluck('payload')
    .mergeMap(username =>
      !connected
      ? Observable.of(usernameResponse({valid: false}))
      : observableEmit('set-username', username)
          .map(response => usernameResponse(response))
    )

const queueEpic = (actions$, store) =>
  actions$.ofType(VIDEO_QUEUED_START)
  .pluck('payload')
  .mergeMap(video => observableEmit('add-video', video))
  .map(response => updateQueue(response))

export default function connect (store) {
  injectEpic(store, combineEpics(usernameEpic, queueEpic))

  socket.on('connect', () => {
    connected = true;
    socket.emit('get-userid', response => {
      if (!response.valid) {
        store.dispatch(requestUsername())
      } else {
        store.dispatch(usernameResponse(response))
      }
    })
  })

  socket.on('update-queue', data => store.dispatch(updateQueue(data)))

  socket.on('disconnect', () => connected = false)
}
