import config from 'config'
import socket_io from 'socket.io-client'
import { injectEpic } from 'store/epics'

import { requestUsername, USERNAME_SUBMIT, usernameResponse } from 'layouts/CoreLayout'

const socket = socket_io(config.compiler_public_path)

export const epic = (actions$, store) =>
  actions$.ofType(USERNAME_SUBMIT)
    .pluck('payload')

export default function connect() {
  socket.on('connect', () => {
    socket.emit('get-userid', response => {
      if (response.status === 'ERROR') {
        requestUsername()
      } else {

      }
    })
  })
}
