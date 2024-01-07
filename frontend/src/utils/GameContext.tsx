import { useState, useEffect, createContext, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '../constants/baseUrl'
import { Card } from '../constants/Deck'
import { useUsername } from './useUsername'

// interface GameState {
//   deck: Card[]
//   gameBoard: Card[][]
//   hasStarted: boolean
// }

interface Player {
  color: string
  username: string
  cardsOnHand: Card[]
}

interface GameContextProps {
  backendPlayers: Player[]
  canDraw: boolean
  cardsOnHand: Card[]
  gameBoard: Card[][]
  gameHasStarted: boolean
  gameOver: string | boolean
  playersTurn: string
  readyToPlay: boolean
  team: string
  throwPile: Card[]
  username: string
  yourTurn: boolean

  setCanDraw: (canDraw: boolean) => void
  setGameBoard: (gameBoard: Card[][]) => void
  setTeam: (team: string) => void

  disconnect: () => void
  drawCard: () => void
  getHand: () => void
  initGame: (color: string) => void
  startGame: () => void
  updateGameboard: (newGameBoard: Card[][], selectedCard: Card) => void
}

export const GameContext = createContext<GameContextProps | undefined>(undefined)

interface GameProviderProps {
  children: React.ReactNode
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { username } = useUsername()

  // const [gameState, setGameState] = useState<GameState | null>(null)
  const [backendPlayers, setBackendPlayers] = useState<Player[]>([])
  const [cardsOnHand, setCardsOnHand] = useState<Card[]>([])
  const [gameBoard, setGameBoard] = useState<Card[][]>([[]])
  const [gameHasStarted, setGameHasStarted] = useState<boolean>(false)
  const [playersTurn, setPlayersTurn] = useState<string>('')
  const [readyToPlay, setReadyToPlay] = useState<boolean>(false)
  const [team, setTeam] = useState<string>('')
  const [throwPile, setThrowPile] = useState<Card[]>([])

  const [canDraw, setCanDraw] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<string | boolean>(false)
  const [yourTurn, setYourTurn] = useState<boolean>(false)

  const [currentDeck, setCurrentDeck] = useState<Card[]>([])

  const socket = useRef<Socket>(io(BASE_URL))

  useEffect(() => {
    if (username) {
      firstConnection()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  useEffect(() => {
    socket.current.on('connect', () => {})

    socket.current.on('playerinformation', (playerinformation) => {
      setCardsOnHand(playerinformation.cardsOnHand)
      setTeam(playerinformation.color)
    })

    socket.current.on('backendPlayers', (backendPlayers) => {
      setBackendPlayers(backendPlayers)
    })

    socket.current.on('readyToPlay', (ready) => {
      setReadyToPlay(ready)
    })

    socket.current.on('playerTurn', (playerTurn) => {
      if (playerTurn === username) {
        setYourTurn(true)
        setCanDraw(false)
      } else {
        setYourTurn(false)
      }

      setPlayersTurn(playerTurn)
    })

    socket.current.on('newDeck', (newDeck) => {
      setCurrentDeck(newDeck)
    })

    socket.current.on('gameBoard', (newGameBoard) => {
      setGameBoard(newGameBoard)
    })

    socket.current.on('gameHasStarted', (state) => {
      setGameHasStarted(state)
    })

    socket.current.on('throwPile', (throwPile) => {
      setThrowPile(throwPile)
    })

    socket.current.on('newCardsOnHand', (newCard) => {
      if (cardsOnHand.length !== 0) {
        setCardsOnHand((oldCardsOnHand) => [...oldCardsOnHand, newCard])
      }
    })

    return () => {
      socket.current.off('connect')
      socket.current.off('playerinformation')
      socket.current.off('backendPlayers')
      socket.current.off('readyToPlay')
      socket.current.off('playerTurn')
      socket.current.off('newDeck')
      socket.current.off('gameBoard')
      socket.current.off('gameHasStarted')
      socket.current.off('throwPile')
      socket.current.off('newCardsOnHand')
    }
  }, [cardsOnHand, username])

  const firstConnection = () => {
    socket.current.on('gameState', (gameState) => {
      console.log('gameState', gameState)
      if (gameState.backendPlayers.length !== 0) {
        setBackendPlayers(gameState.backendPlayers)
        const matchingPlayer = gameState.backendPlayers.find(
          (player: Player) => player.username === username,
        )
        if (matchingPlayer) {
          setCardsOnHand(matchingPlayer.cardsOnHand)
          setTeam(matchingPlayer.color)
        }
      }
    })
    socket.current.emit('firstConnection')
  }

  const initGame = (color: string) => {
    console.log('initGame', color)
    socket.current.emit('initGame', { color, username: username })
  }

  const startGame = () => {
    socket.current.emit('startGame')
  }

  const updateGameboard = (newGameBoard: Card[][], selectedCard: Card) => {
    socket.current.emit('updateGameboard', {
      newGameBoard,
      team,
      throwCard: selectedCard,
      username,
    })
    socket.current.on('getHand', (hand) => {
      setCardsOnHand(hand)
    })

    socket.current.on('winner', (winnerTeam) => {
      setGameOver(winnerTeam)
    })
  }

  const getHand = () => {
    socket.current.on('getHand', (hand) => {
      setCardsOnHand(hand)
    })
    socket.current.emit('getHand', username)
  }

  const drawCard = () => {
    socket.current.emit('draw', { deck: currentDeck, username })
    getHand()
    setCanDraw(false)
  }

  const disconnect = () => {
    socket.current.disconnect()
    window.location.reload()
  }

  return (
    <GameContext.Provider
      value={{
        backendPlayers,
        canDraw,
        cardsOnHand,
        gameBoard,
        gameHasStarted,
        gameOver,
        playersTurn,
        readyToPlay,
        team,
        throwPile,
        username,
        yourTurn,

        setCanDraw,
        setGameBoard,
        setTeam,

        disconnect,
        drawCard,
        getHand,
        initGame,
        startGame,
        updateGameboard,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
