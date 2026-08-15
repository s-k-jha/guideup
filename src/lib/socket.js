import { io } from 'socket.io-client'

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'https://guideup-api.onrender.com/api').replace(/\/api\/?$/, '')

let socket = null
let socketToken = null

/** Reuses a live connection for the same token; reconnects if the token changed. */
export function getSocket(token) {
  if (socket && socketToken === token) return socket
  if (socket) socket.disconnect()

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
  })
  socketToken = token
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
    socketToken = null
  }
}
