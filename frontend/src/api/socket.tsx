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

export const getRooms = () => {
  socket.emit('getRooms')
}

export const onRoomsReceived = (callback: (rooms: string[]) => void) => {
  socket.on('roomsReceived', callback)
}

export const leaveRoom = (roomName: string) => {
  socket.emit('leaveRoom', roomName)
  console.log('left room:', roomName)
}

export const startGame = (gameId: string) => {
  socket.emit('startGame', gameId)
  console.log('started game in room:', gameId)
}

export const onGameStateUpdate = (
  callback: (response: { message: string; gameState?: { [key: string]: any } }) => void,
) => {
  socket.on('gameStateUpdate', callback)
}
