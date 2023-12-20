import { io } from 'socket.io-client'
import { BASE_URL } from '../constants/baseUrl'

const socket = io(BASE_URL)

export const initializeSocket = () => {
  socket.on('connect', () => {
    console.log('connected with id:', socket.id)
  })
}

export const createRoom = (roomName: string) => {
  socket.emit('createRoom', roomName)
}

export const joinRoom = (roomName: string) => {
  socket.emit('joinRoom', roomName)
  console.log('joined room:', roomName)
}

export const onRoomCreated = (callback: (roomName: string) => void) => {
  socket.on('roomCreated', callback)
}

export const onMessageReceived = (callback: (message: string) => void) => {
  socket.on('messageReceived', callback)
}

export const sendMessage = (roomName: string, message: string) => {
  socket.emit('sendMessage', roomName, message)
}

export const getRooms = () => {
  socket.emit('getRooms')
}

export const onRoomsReceived = (callback: (rooms: string[]) => void) => {
  socket.on('roomsReceived', callback)
}
