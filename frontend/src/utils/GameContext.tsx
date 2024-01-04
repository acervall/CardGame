import { useState, useEffect, useContext, createContext } from 'react'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '../constants/baseUrl'
import { Card } from '../constants/Deck'

interface GameState {
  deck: Card[]
  gameBoard: Card[][] | undefined
  hasStarted: boolean
}

interface GameContextProps {
  gameState: GameState | null
  socket: Socket
  cardsOnHand: Card[] | null
  amountPlayers: number | null
  readyToPlay: boolean
  initGame: (color: string, username: string) => void
  startGame: () => void
  disconnect: () => void
}

export const GameContext = createContext<GameContextProps | undefined>(undefined)

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [cardsOnHand, setCardsOnHand] = useState<Card[] | null>(null)
  const [amountPlayers, setAmountPlayers] = useState<number | null>(null)
  const [readyToPlay, setReadyToPlay] = useState<boolean>(false)
  const [playerName, setPlayerName] = useState<string | undefined>(undefined)
  const socket = io(BASE_URL)

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('gameStateUpdate', (gameState, backEndPlayers) => {
      console.log('playerName + hand', playerName)
      if (playerName) {
        setCardsOnHand(backEndPlayers[playerName])
      }
      setGameState(gameState)
    })
    console.log('outside gameState', gameState)

    socket.on('cardsOnHand', (data) => {
      setCardsOnHand(data)
    })

    socket.on('id', (id) => {
      console.log('FROM SOCKET id', id)
    })
    socket.on('playerId', (id) => {
      console.log('playerId', id)
    })

    socket.on('amountPlayers', (amount) => {
      setAmountPlayers(amount)
    })

    socket.on('readyToPlay', (ready) => {
      setReadyToPlay(ready)
    })

    socket.on('players', (player) => {
      console.log('player', player)
    })

    socket.on('playerName', (playerName) => {
      console.log('playerName', playerName)
      setPlayerName(playerName)
    })

    return () => {
      socket.off('gameStateUpdate')
      socket.off('cardsOnHand')
      socket.off('amountPlayers')
      socket.off('readyToPlay')
    }
  }, [])

  const initGame = (color: string, username: string) => {
    socket.emit('initGame', { color, username })
  }

  const startGame = () => {
    console.log('starting game')
    socket.emit('startGame')
  }

  const disconnect = () => {
    socket.disconnect()
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        socket,
        cardsOnHand,
        initGame,
        startGame,
        disconnect,
        amountPlayers,
        readyToPlay,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
