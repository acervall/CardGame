import { io } from 'socket.io-client'
import { BASE_URL } from '../constants/baseUrl'

const socket = io(BASE_URL)

export const initializeSocket = () => {
  socket.on('connect', () => {
    console.log('connected with id:', socket.id)
  })

  // Listen for 'updatePlayers' events
  socket.on('playerIsReady', (players) => {
    console.log(players)
  })

  // Listen for 'gameStateUpdate' events
  socket.on('gameStateUpdate', (data) => {
    console.log('gameState, data.message', data.message)
    console.log('gameState, data.gameState', data.gameState)
  })
}

export const joinGame = (color: string, username: string) => {
  console.log('joining game', color, username)
  socket.emit('initGame', { color, username })
}

export const startGame = () => {
  console.log('starting game')
  socket.emit('startGame')
}

export const updateGameState = (gameState: any) => {
  console.log('updating game state')
  socket.emit('updateGameState', gameState)
}

export const readyToPlay = () => {
  socket.on('readyToPlay', () => {
    console.log('readyToPlay')
    return true
  })
}
