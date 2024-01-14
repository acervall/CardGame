import { useState, useEffect, createContext, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '../constants/baseUrl'
import { Card, Color } from '../constants/Deck'
import { useUsername } from './useUsername'

// interface GameState {
//   deck: Card[]
//   gameBoard: Card[][]
//   hasStarted: boolean
// }

interface Player {
  color: Color
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
  playersTurn: Player | undefined
  readyToPlay: boolean
  team: Color | undefined
  throwPile: Card[]
  username: string
  yourTurn: boolean

  setCanDraw: (canDraw: boolean) => void
  setGameBoard: (gameBoard: Card[][]) => void
  setTeam: (team: Color) => void

  disconnect: () => void
  drawCard: () => void
  getHand: () => void
  initGame: (color: string) => void
  startGame: () => void
  updateGameboard: (newGameBoard: Card[][], selectedCard: Card) => void
  throwCard: (throwCard: Card) => void
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
  const [playersTurn, setPlayersTurn] = useState<Player | undefined>(undefined)
  const [readyToPlay, setReadyToPlay] = useState<boolean>(false)
  const [team, setTeam] = useState<Color | undefined>(undefined)
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
    const currentSocket = socket.current

    currentSocket.on('connect', () => {})

    currentSocket.on('playerinformation', (playerinformation) => {
      setCardsOnHand(playerinformation.cardsOnHand)
      setTeam(playerinformation.color)
    })

    currentSocket.on('backendPlayers', (backendPlayers) => {
      setBackendPlayers(backendPlayers)
    })

    currentSocket.on('readyToPlay', (ready) => {
      setReadyToPlay(ready)
    })

    currentSocket.on('playerTurn', (playerTurn) => {
      if (playerTurn.username === username) {
        setYourTurn(true)
        setCanDraw(false)
        playSound(
          'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/alien_shoot.wav',
        )
      } else {
        setYourTurn(false)
      }

      setPlayersTurn(playerTurn)
    })

    currentSocket.on('newDeck', (newDeck) => {
      setCurrentDeck(newDeck)
    })

    currentSocket.on('gameBoard', (newGameBoard) => {
      setGameBoard(newGameBoard)
    })

    currentSocket.on('gameHasStarted', (state) => {
      setGameHasStarted(state)
    })

    currentSocket.on('throwPile', (throwPile) => {
      setThrowPile(throwPile)
    })

    currentSocket.on('newCardsOnHand', (newCard) => {
      if (cardsOnHand.length !== 0) {
        setCardsOnHand((oldCardsOnHand) => [...oldCardsOnHand, newCard])
      }
    })

    return () => {
      currentSocket.off('connect')
      currentSocket.off('playerinformation')
      currentSocket.off('backendPlayers')
      currentSocket.off('readyToPlay')
      currentSocket.off('playerTurn')
      currentSocket.off('newDeck')
      currentSocket.off('gameBoard')
      currentSocket.off('gameHasStarted')
      currentSocket.off('throwPile')
    }
  }, [cardsOnHand, username])

  const firstConnection = () => {
    socket.current.on('gameState', (gameState) => {
      if (gameState.gameHasStarted) {
        setGameHasStarted(true)
        setGameBoard(gameState.gameBoard)
        setThrowPile(gameState.throwPile)
        setCurrentDeck(gameState.deck)
        setPlayersTurn(gameState.playerTurn)
      }
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
    socket.current.emit('initGame', { color, username: username })
  }

  const playSound = (sound: string) => {
    console.log('play sound')
    const audio = new Audio(sound)
    audio.play()
    console.log('RÖVHÅÅÅL')
  }

  const startGame = () => {
    socket.current.emit('startGame')
  }

  const throwCard = (throwCard: Card) => {
    socket.current.on('throwPile', (throwPile) => {
      setThrowPile(throwPile)
    })
    socket.current.emit('throwCard', { throwCard, username })
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
      // const jackS = {
      //   nr: 9,
      //   face: 'J',
      //   value: 11,
      //   suit: 'S',
      //   url: 'JS',
      // }

      // const jackD = {
      //   nr: 48,
      //   face: 'J',
      //   value: 11,
      //   suit: 'D',
      //   url: 'JD',
      // }
      // const newHAnd = [...hand, jackD, jackS]
      // setCardsOnHand(newHAnd)
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
        throwCard,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
