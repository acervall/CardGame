// import { io } from 'socket.io-client'
// import { BASE_URL } from '../constants/baseUrl'
// import { Card } from '../constants/Deck'

// const socket = io(BASE_URL)

// interface ReadyToPlayResponse {
//   isReady: boolean
// }

// export interface GameStateUpdateResponse {
//   message: string
//   gameState: GamesInterface
// }

// export interface GamesInterface {
//   deck: Card[]
//   gameBoard: Card[][] | undefined
//   hasStarted: boolean
// }

// export const initializeSocket = () => {
//   socket.on('connect', () => {})
// }

// games[gameId] = {
//   deck: createNewDoubleDeck(),
//   gameBoard: updateGameBoard(),
//   hasStarted: true,
// }

// export const joinGame = (color: string, username: string) => {
//   socket.emit('initGame', { color, username })
// }

// export const readyToPlay = (): Promise<boolean> => {
//   return new Promise((resolve) => {
//     socket.on('readyToPlay', (isReady) => {
//       resolve(isReady)
//     })
//   })
// }

// export const gameIsStarting = (): Promise<boolean> => {
//   return new Promise((resolve) => {
//     socket.on('gameHasStarted', (state) => {
//       resolve(state)
//     })
//   })
// }

// export const startGame = () => {
//   console.log('starting game')
//   socket.emit('startGame')
// }

// export const disconnect = (): Promise<ReadyToPlayResponse> => {
//   socket.disconnect()
//   // socket.emit('gameEnds', true)
//   // console.log('disconnected')
//   return new Promise((resolve) => {
//     socket.on('gameEnds', (state) => {
//       resolve({ isReady: state })
//     })
//   })
// }

// export const cardsOnHand = (): Promise<Card[]> => {
//   return new Promise((resolve) => {
//     socket.on('cardsOnHand', (cards) => {
//       console.log('THESE ARE THE CARDS', cards)
//       resolve(cards)
//     })
//   })
// }

// export const getGameStateUpdate = (): Promise<GameStateUpdateResponse> => {
//   return new Promise((resolve) => {
//     socket.on('gameStateUpdate', (data) => {
//       resolve({ message: 'Game started', gameState: data.gameState })
//     })
//   })
// }
