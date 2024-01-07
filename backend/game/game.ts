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
}

function checkForSequence(board: Card[][], team: string): boolean {
  const size = board.length

  for (let i = 0; i < size; i++) {
    let rowSeq = 0
    let colSeq = 0
    for (let j = 0; j < size; j++) {
      rowSeq = board[i][j]?.status === team ? rowSeq + 1 : 0
      colSeq = board[j][i]?.status === team ? colSeq + 1 : 0
      if (rowSeq === 5 || colSeq === 5) return true
    }
  }

  for (let d = 0; d < size; d++) {
    let diag1Seq = 0
    let diag2Seq = 0
    for (let i = 0, j = d; j < size; i++, j++) {
      diag1Seq = board[i][j]?.status === team ? diag1Seq + 1 : 0
      diag2Seq = board[j][i]?.status === team ? diag2Seq + 1 : 0
      if (diag1Seq === 5 || diag2Seq === 5) return true
    }
  }

  return false
}

export function setupGame(io: IOServer) {
  const gameState: GameState = {
    deck: shuffleDeck(doubleDeck),
    gameBoard: cardOnGameBoard,
    throwPile: [],
    backendPlayers: [],
  }

  const findPlayerByUsername = (username: string) =>
    gameState.backendPlayers.find((p) => p.username === username)

  const emitToAll = (eventName: string, data: any) => io.emit(eventName, data)

  io.on('connection', (socket: Socket) => {
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

      io.emit('amountPlayers', amountPlayers)

      if (allowedSizes.includes(amountPlayers)) {
        io.emit('readyToPlay', true)
      }
    })

    socket.on('startGame', () => {
      io.emit('playerTurn', gameState.backendPlayers[0].username)
      io.emit('newDeck', gameState.deck)
      io.emit('gameBoard', gameState.gameBoard)
      io.emit('gameHasStarted', true)
      io.emit('throwPile', gameState.throwPile)
    })

    socket.on('updateGameboard', ({ newGameBoard, team, throwCard, username }) => {
      gameState.gameBoard = newGameBoard
      gameState.throwPile.push(throwCard)

      const player = findPlayerByUsername(username)

      if (player && player.cardsOnHand) {
        const cardToRemove = player.cardsOnHand.find((card) => card.nr === throwCard.nr)

        if (cardToRemove) {
          const newHand = player.cardsOnHand.filter((card) => card.nr !== throwCard.nr)

          player.cardsOnHand = newHand
          socket.emit('getHand', newHand)
        }
      } else {
        console.log('not the same card, something went wrong')
      }

      if (checkForSequence(newGameBoard, team)) {
        console.log('Player has a sequence!')
        emitToAll('winner', team)
      } else {
        console.log('Player does not have a sequence')
      }

      if (player) {
        let position = gameState.backendPlayers.lastIndexOf(player)
        let next = position === gameState.backendPlayers.length - 1 ? 0 : position + 1
        emitToAll('playerTurn', gameState.backendPlayers[next].username)
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
        gameState.backendPlayers = []
        gameState.deck = shuffleDeck(doubleDeck)
        gameState.gameBoard = cardOnGameBoard
        gameState.throwPile = []
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
