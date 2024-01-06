import { Server as IOServer, Socket } from 'socket.io'
import { doubleDeck, shuffleDeck, cardOnGameBoard, Card } from './deck'

interface player {
  [key: string]: {
    color: string
    username: string
    cardsOnHand: Card[] | undefined
  }
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
  let games: { [key: string]: any } = {}

  let backEndPlayers: player = {}
  let deck = shuffleDeck(doubleDeck)
  let gameBoard = cardOnGameBoard
  let throwPile: Card[] = []
  let orderOfPlayers: string[] = []

  io.on('connection', (socket: Socket) => {
    let amountPlayers: number

    socket.on('initGame', ({ color, username }) => {
      console.log('initGame', socket.id, color, username)
      const cardsOnHand = deck.splice(0, 7)
      console.log('cardsOnHand, username', cardsOnHand.length, username)
      console.log('deck', deck.length)
      backEndPlayers[username] = {
        color: color,
        username: username,
        cardsOnHand: cardsOnHand,
      }

      orderOfPlayers.push(username)

      console.log('backEndPlayers', backEndPlayers)

      socket.emit('playerinformation', backEndPlayers[username])

      const allowedSizes = [2, 3, 4, 6, 8, 9, 10, 12]
      amountPlayers = Object.keys(backEndPlayers).length

      io.emit('amountPlayers', amountPlayers)

      if (allowedSizes.find((size) => size === amountPlayers) !== undefined) {
        io.emit('readyToPlay', true)
      }
    })

    socket.on('startGame', () => {
      io.emit('playerTurn', orderOfPlayers[0])
      io.emit('newDeck', deck)
      io.emit('gameBoard', gameBoard)
      io.emit('gameHasStarted', true)
      io.emit('throwPile', throwPile)
    })

    socket.on('draw', ({ deck, username }) => {
      if (deck.length > 0) {
        if (backEndPlayers[username].cardsOnHand)
          if (backEndPlayers[username].cardsOnHand!.length < 7) {
            const newCard = deck[0]
            const newDeck = deck.slice(1)
            backEndPlayers[username].cardsOnHand?.push(newCard)
            console.log('deck LENGTH', deck.length)
            io.emit('newDeck', newDeck)
            console.log(newDeck[0])
            socket.emit('newCardsOnHand', newCard)
          }
      }
    })

    socket.on('updateGameboard', ({ newGameBoard, team, throwCard, username }) => {
      gameBoard = newGameBoard
      throwPile.push(throwCard)

      // console.log('backEndPlayers[username].cardsOnHand', backEndPlayers[username].cardsOnHand)
      // console.log('throwCard', throwCard)

      const cardsOnHand = backEndPlayers[username].cardsOnHand

      if (cardsOnHand) {
        const cardToRemove = backEndPlayers[username].cardsOnHand!.find(
          (card) => card.nr === throwCard.nr,
        )

        if (cardToRemove) {
          const newHand = backEndPlayers[username].cardsOnHand!.filter(
            (card) => card !== cardToRemove,
          )

          backEndPlayers[username].cardsOnHand = newHand
          socket.emit('getHand', newHand)
        }
        // console.log('newHand', newHand)
        // console.log('throwCard', throwCard)
      } else {
        console.log('not same card poop')
      }

      if (checkForSequence(newGameBoard, team)) {
        console.log('Player has a sequence!')
        io.emit('winner', team)
      } else {
        console.log('Player does not have a sequence of')
      }

      let position = orderOfPlayers.lastIndexOf(username)
      let next = position === orderOfPlayers.length - 1 ? 0 : position + 1
      console.log('username', username)
      console.log('position', position)
      console.log('next', next)
      console.log('orderOfPlayers[next]', orderOfPlayers[next])
      console.log('orderOfPlayers', orderOfPlayers)
      console.log('orderOfPlayers.length', orderOfPlayers.length)

      io.emit('gameBoard', newGameBoard)
      io.emit('throwPile', throwPile)
      io.emit('playerTurn', orderOfPlayers[next])
    })

    socket.on('getHand', (username) => {
      // console.log('getting hand ', backEndPlayers[username])
      // console.log('backEndPlayers', backEndPlayers)
      // console.log('username', username)
      socket.emit('getHand', backEndPlayers[username])
    })

    socket.on('disconnect', (reason) => {
      console.log(
        'reason === client namespace disconnect',
        reason === 'client namespace disconnect',
        reason,
      )
      if (reason === 'client namespace disconnect') {
        console.log('restarting game')
        backEndPlayers = {}
        deck = shuffleDeck(doubleDeck)
        gameBoard = cardOnGameBoard
        throwPile = []
        orderOfPlayers = []
        io.emit('updatePlayers', backEndPlayers)
        io.emit('gameHasStarted', false)
        io.emit('amountPlayers', Object.keys(backEndPlayers).length)
        console.log('backEndPlayers', backEndPlayers, 'deck', deck.length, 'throwPile', throwPile)
      }
    })
  })
}

// emitta till korrekt person

// En person trycker start game, endast den får updates för spelet båda behöver joina
// Hitta sätt att skicka korrekt information i rätt tid
// Alla behöver få informationen när personen startar spelet
// Skicka ut all information
