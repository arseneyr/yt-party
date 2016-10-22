import config from 'config'
import socket_io from 'socket.io-client'
import { injectEpic } from 'store/epics'
import { Observable } from 'rxjs'

import { requestUsername, USERNAME_SUBMIT, usernameResponse } from 'layouts/CoreLayout'
import { updateQueue } from 'routes/HomeLayout/modules/queue'

const socket = socket_io(config.compiler_public_path)

let connected = false;

const observableEmit = Observable.bindCallback(socket.emit.bind(socket))

const epic = (actions$, store) =>
  actions$.ofType(USERNAME_SUBMIT)
    .pluck('payload')
    .mergeMap(username =>
      !connected
      ? Observable.of(usernameResponse({valid: false}))
      : observableEmit('set-username', username)
          .map(usernameResponse)
    )

export default function connect (store) {
  injectEpic(store, epic)

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

  socket.on('update-queue', data => store.dispatch()

  socket.on('disconnect', () => connected = false)
}
