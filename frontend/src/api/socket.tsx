import { io } from 'socket.io-client'
import { BASE_URL } from '../constants/baseUrl'
import { Card } from '../constants/Deck'

const socket = io(BASE_URL)

interface ReadyToPlayResponse {
  isReady: boolean
  amountPlayers?: number | undefined
}

interface GameStateUpdateResponse {
  message: string
  gameState: GamesInterface
}

interface GamesInterface {
  deck: Card[]
  gameBoard: Card[][] | null
  hasStarted: boolean
}

export const initializeSocket = () => {
  socket.on('connect', () => {
    // console.log('connected with id:', socket.id)
  })

  socket.on('playerIsReady', (players) => {
    // console.log(players)
  })

  socket.on('gameStateUpdate', (data) => {
    // console.log('gameState, data.message', data.message)
    // console.log('gameState, data.gameState', data.gameState)
  })
}

// games[gameId] = {
//   deck: createNewDoubleDeck(),
//   gameBoard: updateGameBoard(),
//   hasStarted: true,
// }

export const joinGame = (color: string, username: string) => {
  // console.log('joining game', color, username)
  socket.emit('initGame', { color, username })
}

export const startGame = () => {
  // console.log('starting game')
  socket.emit('startGame')
}

export const gameIsStarting = (): Promise<ReadyToPlayResponse> => {
  return new Promise((resolve) => {
    socket.on('gameHasStarted', (state) => {
      resolve({ isReady: state })
    })
  })
}

export const stoppingGame = (): Promise<ReadyToPlayResponse> => {
  // console.log('socket, stipping game')
  return new Promise((resolve) => {
    socket.on('gameEnds', (state) => {
      // console.log('gameEnds', state)
      resolve({ isReady: state })
    })
  })
}

export const updateGameState = (gameState: any) => {
  // console.log('updating game state')
  socket.emit('updateGameState', gameState)
}

export const readyToPlay = (): Promise<ReadyToPlayResponse> => {
  return new Promise((resolve) => {
    socket.on('readyToPlay', (amountPlayers) => {
      resolve({ isReady: true, amountPlayers })
    })
  })
}

export const getGameStateUpdate = (): Promise<GameStateUpdateResponse> => {
  return new Promise((resolve) => {
    socket.on('gameStateUpdate', (data) => {
      resolve({ message: 'Game started', gameState: data.gameState })
    })
  })
}

export const getAmountPlayers = (): Promise<number> => {
  return new Promise((resolve) => {
    socket.on('amountPlayers', (amountPlayers) => {
      resolve(amountPlayers)
    })
  })
}

export const disconnect = (): Promise<ReadyToPlayResponse> => {
  socket.disconnect()
  // socket.emit('gameEnds', true)
  // console.log('disconnected')
  return new Promise((resolve) => {
    socket.on('gameEnds', (state) => {
      resolve({ isReady: state })
    })
  })
}

export const cardsOnHand = (): Promise<Card[]> => {
  return new Promise((resolve) => {
    socket.on('cardsOnHand', (cards) => {
      resolve(cards)
    })
  })
}
