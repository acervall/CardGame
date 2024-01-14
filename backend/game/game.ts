import { Server as IOServer, Socket } from 'socket.io'
import { doubleDeck, shuffleDeck, cardOnGameBoard, Card } from './deck'

interface Player {
  color: string
  username: string
  cardsOnHand: Card[]
}

interface GameState {
  deck: Card[]
  gameBoard: Card[][]
  throwPile: Card[]
  backendPlayers: Player[]
  gameHasStarted: boolean
  playerTurn: Player | undefined
}

function checkForSequence(board: Card[][], team: string): boolean {
  const size = board.length

  for (let i = 0; i < size; i++) {
    let rowSeq = 0
    let colSeq = 0
    for (let j = 0; j < size; j++) {
      rowSeq = board[i][j]?.team === team || board[i][j]?.team === 'joker' ? rowSeq + 1 : 0
      colSeq = board[j][i]?.team === team || board[j][i]?.team === 'joker' ? colSeq + 1 : 0
      if (rowSeq === 5 || colSeq === 5) return true
    }
  }

  for (let d = 0; d < size * 2; d++) {
    let diag1Seq = 0
    let diag2Seq = 0
    for (let i = 0, j = d; j >= 0; i++, j--) {
      if (i < size && j < size) {
        diag1Seq = board[i][j]?.team === team || board[i][j]?.team === 'joker' ? diag1Seq + 1 : 0
        if (diag1Seq === 5) return true
      }
      if (i < size && d - i < size) {
        diag2Seq =
          board[i][d - i]?.team === team || board[i][d - i]?.team === 'joker' ? diag2Seq + 1 : 0
        if (diag2Seq === 5) return true
      }
    }
  }

  return false
}

function initializeGameState(): GameState {
  return {
    deck: shuffleDeck([...doubleDeck]),
    gameBoard: cardOnGameBoard,
    throwPile: [],
    backendPlayers: [],
    gameHasStarted: false,
    playerTurn: undefined,
  }
}

export function setupGame(io: IOServer) {
  let gameState = initializeGameState()

  const findPlayerByUsername = (username: string) =>
    gameState.backendPlayers.find((p) => p.username === username)

  const removerCardFromHand = (username: string, throwCard: Card) => {
    const player = findPlayerByUsername(username)

    if (player && player.cardsOnHand) {
      const cardToRemove = player.cardsOnHand.find((card) => card.nr === throwCard.nr)

      if (cardToRemove) {
        const newHand = player.cardsOnHand.filter((card) => card.nr !== throwCard.nr)

        player.cardsOnHand = newHand
        return newHand
      }
    } else {
      console.log('not the same card, something went wrong')
    }
  }

  const emitToAll = (eventName: string, data: any) => io.emit(eventName, data)

  io.on('connection', (socket: Socket) => {
    socket.on('firstConnection', () => {
      io.emit('gameState', gameState)
    })

    socket.on('initGame', ({ color, username }) => {
      console.log('initGame', socket.id, color, username)

      const initializePlayer = () => {
        const cardsOnHand = gameState.deck.splice(0, 7)
        gameState.throwPile = []
        gameState.gameBoard = cardOnGameBoard

        return { color, username, cardsOnHand }
      }

      const player = initializePlayer()
      gameState.backendPlayers.push(player)

      socket.emit('playerinformation', player)

      const allowedSizes = [2, 3, 4, 6, 8, 9, 10, 12]
      const amountPlayers = gameState.backendPlayers.length

      io.emit('backendPlayers', gameState.backendPlayers)

      if (allowedSizes.includes(amountPlayers)) {
        io.emit('readyToPlay', true)
      }
    })

    socket.on('startGame', () => {
      gameState.gameHasStarted = true
      gameState.playerTurn = gameState.backendPlayers[0]

      io.emit('playerTurn', gameState.playerTurn)
      io.emit('newDeck', gameState.deck)
      io.emit('gameBoard', gameState.gameBoard)
      io.emit('gameHasStarted', gameState.gameHasStarted)
      io.emit('throwPile', gameState.throwPile)
    })

    socket.on('throwCard', ({ throwCard, username }) => {
      gameState.throwPile.push(throwCard)
      emitToAll('throwPile', gameState.throwPile)

      const newHand = removerCardFromHand(username, throwCard)

      socket.emit('getHand', newHand)
    })

    socket.on('updateGameboard', ({ newGameBoard, team, throwCard, username }) => {
      gameState.gameBoard = newGameBoard
      gameState.throwPile.push(throwCard)
      const newHand = removerCardFromHand(username, throwCard)

      const player = findPlayerByUsername(username)

      socket.emit('getHand', newHand)

      if (checkForSequence(newGameBoard, team)) {
        console.log('Player has a sequence!')
        emitToAll('winner', team)
      } else {
        console.log('Player does not have a sequence', team)
      }

      if (player) {
        let position = gameState.backendPlayers.lastIndexOf(player)
        let next = position === gameState.backendPlayers.length - 1 ? 0 : position + 1
        gameState.playerTurn = gameState.backendPlayers[next]
        emitToAll('playerTurn', gameState.playerTurn)
      }

      emitToAll('gameBoard', newGameBoard)
      emitToAll('throwPile', gameState.throwPile)
    })

    socket.on('getHand', (username) => {
      const player = gameState.backendPlayers.find((p) => p.username === username)
      player && socket.emit('getHand', player.cardsOnHand)
    })

    socket.on('draw', ({ username }) => {
      if (gameState.deck.length > 0) {
        const player = gameState.backendPlayers.find((p) => p.username === username)
        if (player && player.cardsOnHand && player.cardsOnHand.length < 7) {
          const newCard = gameState.deck[0]
          gameState.deck = gameState.deck.slice(1)
          player.cardsOnHand.push(newCard)
          io.emit('newDeck', gameState.deck)
          socket.emit('newCardsOnHand', newCard)
        }
      }
    })

    socket.on('disconnect', (reason) => {
      console.log('reason = client', reason === 'client namespace disconnect', reason)
      if (reason === 'client namespace disconnect') {
        console.log('restarting game')
        gameState = initializeGameState()
        io.emit('updatePlayers', gameState.backendPlayers)
        io.emit('gameHasStarted', false)
        io.emit('amountPlayers', gameState.backendPlayers.length)
        console.log(
          'backendPlayers',
          gameState.backendPlayers,
          'deck',
          gameState.deck.length,
          'throwPile',
          gameState.throwPile,
        )
      }
    })
  })
}
