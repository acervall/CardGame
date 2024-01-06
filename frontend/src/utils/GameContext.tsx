import { useState, useEffect, useContext, createContext, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '../constants/baseUrl'
import { Card } from '../constants/Deck'
import useUser from '../hooks/useUser'
import { useUsername } from './UserContext'

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
  initGame: (color: string) => void
  startGame: () => void
  disconnect: () => void
  drawCard: () => void
}

export const GameContext = createContext<GameContextProps | undefined>(undefined)

export const GameProvider = ({ children }) => {
  const { username } = useUsername()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [cardsOnHand, setCardsOnHand] = useState<Card[] | null>(null)
  const [amountPlayers, setAmountPlayers] = useState<number | null>(null)
  const [readyToPlay, setReadyToPlay] = useState<boolean>(false)
  const [playerName, setPlayerName] = useState<string | null>(null)
  const playerNameRef = useRef<string | null>(null)
  // const throwPileRef = useRef<Card[] | null>(null)

  const [currentDeck, setCurrentDeck] = useState<Card[] | null>(null)
  const [gameBoard, setGameBoard] = useState<Card[][] | null>(null)
  const [gameHasStarted, setGameHasStarted] = useState<boolean>(false)
  const [team, setTeam] = useState<string | null>(null)
  const [throwPile, setThrowPile] = useState<Card[] | null>(null)
  // const [username, setUsername] = useState<string | null>(null)
  const [canDraw, setCanDraw] = useState<boolean>(false)
  const [playersTurn, setPlayersTurn] = useState<string | null>(null)
  const [yourTurn, setYourTurn] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<string | boolean>(false)

  const { data: user, isLoading, error } = useUser()

  const socket = io(BASE_URL)

  useEffect(() => {
    socket.on('connect', () => {
      // console.log('Connected to server')
    })
    // setUsername(user.username)
    console.log('username', username)

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

    socket.on('playerTurn', (playerTurn) => {
      if (playerTurn === username) {
        setYourTurn(true)
        setCanDraw(false)
        console.log('testar')
      } else {
        console.log('testar not your turn')
        setYourTurn(false)
      }

      console.log('playerTurn', playerTurn)
      setPlayersTurn(playerTurn)
    })

    socket.on('playerinformation', (playerinformation) => {
      console.log('socket playerinformation.cardsOnHand', playerinformation.cardsOnHand)
      setCardsOnHand(playerinformation.cardsOnHand)
      setTeam(playerinformation.color)
    })
    socket.on('newCardsOnHand', (newCard) => {
      console.log('newCards', newCard)
      if (cardsOnHand !== null) {
        console.log('cardsOnHand', cardsOnHand)
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
      socket.off('connect')
      socket.off('newDeck')
      socket.off('gameBoard')
      socket.off('gameHasStarted')
      socket.off('throwPile')
      socket.off('playerTurn')
      socket.off('playerinformation')
      socket.off('newCardsOnHand')
      socket.off('backEndPlayers')
      socket.off('amountPlayers')
      socket.off('readyToPlay')
      socket.off('players')
    }
  }, [])

  const initGame = (color: string) => {
    // if (user) {
    //   const username = user.username
    //   socket.emit('initGame', { color, username })
    // }
    socket.emit('initGame', { color, username })
  }

  // if (user) {
  //   const username = user.username
  // }

  const startGame = () => {
    // console.log('starting game')
    socket.emit('startGame')
  }

  const updateGameboard = (newGameBoard, selectedCard) => {
    // if (user) {
    //   const username = user.username
    //   console.log('updateGameboard', team)
    //   console.log('throwPile', throwPile)
    //   socket.emit('updateGameboard', { newGameBoard, team, throwCard: selectedCard, username })
    //   socket.on('getHand', (hand) => {
    //     console.log('newhand hopfully', hand)
    //     setCardsOnHand(hand)
    //   })
    // }
    console.log('updateGameboard', team)
    console.log('throwPile', throwPile)
    socket.emit('updateGameboard', { newGameBoard, team, throwCard: selectedCard, username })
    socket.on('getHand', (hand) => {
      console.log('newhand hopfully', hand)
      setCardsOnHand(hand)
    })

    socket.on('winner', (team) => {
      console.log('a team won', team)
      setGameOver(team)
      // setCardsOnHand(team)
    })
  }

  const getHand = () => {
    // if (user) {
    //   const username = user.username
    //   console.log('trying hand')
    //   socket.on('getHand', (playerinformation) => {
    //     console.log('playerinformation', playerinformation.cardsOnHand)
    //     if (!team) {
    //       console.log('playerinformation', playerinformation)
    //       setTeam(playerinformation.color)
    //     }
    //     setCardsOnHand(playerinformation.cardsOnHand)
    //   })
    //   socket.emit('getHand', username)
    // }

    console.log('trying hand')
    socket.on('getHand', (playerinformation) => {
      console.log('playerinformation', playerinformation.cardsOnHand)
      if (!team) {
        console.log('playerinformation', playerinformation)
        setTeam(playerinformation.color)
      }
      setCardsOnHand(playerinformation.cardsOnHand)
    })
    socket.emit('getHand', username)
  }

  const drawCard = () => {
    // if (user) {
    //   const username = user.username
    //   socket.emit('draw', { deck: currentDeck, username })
    //   getHand()
    //   setCanDraw(false)
    // }

    socket.emit('draw', { deck: currentDeck, username })
    getHand()
    setCanDraw(false)
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
        getHand,
        canDraw,
        setCanDraw,
        playersTurn,
        yourTurn,
        gameOver,
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
