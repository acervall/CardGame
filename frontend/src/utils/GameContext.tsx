import { useState, useEffect, useContext, createContext, useRef } from 'react'
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
  currentDeck: Card[]
  initGame: (color: string, username: string) => void
  startGame: () => void
  disconnect: () => void
  drawCard: () => void
}

export const GameContext = createContext<GameContextProps | undefined>(undefined)

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [cardsOnHand, setCardsOnHand] = useState<Card[] | null>(null)
  const [amountPlayers, setAmountPlayers] = useState<number | null>(null)
  const [readyToPlay, setReadyToPlay] = useState<boolean>(false)
  const [playerName, setPlayerName] = useState<string | null>(null)
  const playerNameRef = useRef<string | null>(null)

  const [currentDeck, setCurrentDeck] = useState<Card[] | null>(null)
  const [gameBoard, setGameBoard] = useState<Card[][] | null>(null)
  const [gameHasStarted, setGameHasStarted] = useState<boolean>(false)
  const [team, setTeam] = useState<string | null>(null)
  const [throwPile, setThrowPile] = useState<Card[] | null>(null)

  const socket = io(BASE_URL)

  useEffect(() => {
    socket.on('connect', () => {
      // console.log('Connected to server')
    })

    socket.on('newDeck', (newDeck) => {
      setCurrentDeck(newDeck)
    })
    socket.on('gameBoard', (newGameBoard) => {
      setGameBoard(newGameBoard)
    })
    socket.on('gameHasStarted', (state) => {
      setGameHasStarted(state)
    })
    socket.on('throwPile', (throwPile) => {
      setThrowPile(throwPile)
    })

    socket.on('playerinformation', (playerinformation) => {
      console.log('socket playerinformation.cardsOnHand', playerinformation.cardsOnHand)
      setCardsOnHand(playerinformation.cardsOnHand)
      setTeam(playerinformation.color)
    })

    socket.on('newCardsOnHand', (newCard) => {
      console.log('newCards', newCard)
      if (cardsOnHand !== null) {
        setCardsOnHand((oldCardsOnHand) => [...oldCardsOnHand, newCard])
      }
    })

    socket.on('backEndPlayers', (backEndPlayers) => {
      console.log(backEndPlayers)
    })

    socket.on('amountPlayers', (amount) => {
      setAmountPlayers(amount)
    })

    socket.on('readyToPlay', (ready) => {
      setReadyToPlay(ready)
    })

    socket.on('players', (player) => {
      console.log('backend players', player)
    })

    return () => {
      socket.off('newDeck')
      socket.off('gameBoard')
      socket.off('gameHasStarted')
      socket.off('playerinformation')
      socket.off('newCardsOnHand')
      socket.off('backEndPlayers')
      socket.off('amountPlayers')
      socket.off('readyToPlay')
      socket.off('players')
    }
  }, [])

  const initGame = (color: string, username: string) => {
    socket.emit('initGame', { color, username })
  }

  const startGame = () => {
    // console.log('starting game')
    socket.emit('startGame')
  }

  const drawCard = () => {
    socket.emit('draw', { deck: currentDeck, userId: playerNameRef.current })
  }

  const updateGameboard = (newGameBoard) => {
    console.log('updateGameboard', team)
    socket.emit('updateGameboard', { newGameBoard, team, throwPile })
  }

  const disconnect = () => {
    console.log('dissdkjfdsj')
    socket.disconnect()
  }

  return (
    <GameContext.Provider
      value={{
        socket,
        cardsOnHand,
        initGame,
        startGame,
        disconnect,
        drawCard,
        amountPlayers,
        readyToPlay,
        currentDeck,
        gameBoard,
        gameHasStarted,
        team,
        throwPile,
        setThrowPile,
        updateGameboard,
        setGameBoard,
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
