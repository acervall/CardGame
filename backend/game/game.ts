import { Server as IOServer, Socket } from 'socket.io'
import { doubleDeck, shuffleDeck } from './deck'

const createNewDeck = () => {
  return shuffleDeck(doubleDeck)
}

interface player {
  [key: string]: {
    color: string
    username: string
  }
}

export function setupGame(io: IOServer) {
  let games: { [key: string]: any } = {}

  const backEndPlayers: player = {}

  io.on('connection', (socket: Socket) => {
    io.emit('testSocket', `${socket.id}testSocket`)

    io.emit('updatePlayers', backEndPlayers)

    socket.on('initGame', ({ color, username }) => {
      backEndPlayers[socket.id] = {
        color: color,
        username: username,
      }
      io.emit('playerIsReady', backEndPlayers[socket.id])

      const allowedSizes = [2, 3, 4, 6, 8, 9, 10, 12]
      const amountPlayers = Object.keys(backEndPlayers).length
      if (allowedSizes.find((size) => size === amountPlayers) !== undefined) {
        console.log('readyToPlay')
        io.emit('readyToPlay')
      }
    })

    socket.on('startGame', () => {
      const gameId = socket.id

      console.log('bakcendPlayer')

      games[gameId] = {
        deck: createNewDeck(),
        hasStarted: true,
      }
      console.log('startGame, emit gameStateUpdate')
      io.emit('gameStateUpdate', { message: 'Game started', gameState: games[gameId] })
    })

    socket.on('disconnect', (reason) => {
      console.log(reason)
      delete backEndPlayers[socket.id]
      io.emit('updatePlayers', backEndPlayers)
    })
  })
}
