import { Server as IOServer, Socket } from 'socket.io'
import { doubleDeck, shuffleDeck, cardOnGameBoard, Card } from './deck'

interface player {
  [key: string]: {
    color: string
    username: string
    cardsOnHand: Card[] | undefined
  }
}

export function setupGame(io: IOServer) {
  let games: { [key: string]: any } = {}

  let backEndPlayers: player = {}
  let playersInitialHand

  const createNewDoubleDeck = (amountPlayers: number) => {
    console.log('amountPlayers', amountPlayers)
    const dealAmountCards = amountPlayers * 7
    let deck = shuffleDeck(doubleDeck)
    playersInitialHand = deck.slice(0, dealAmountCards)
    deck = deck.slice(dealAmountCards, doubleDeck.length)

    const playerIds = Object.keys(backEndPlayers)
    for (let i = 0; i < playerIds.length; i++) {
      console.log('playerIds', playerIds)
      const playerId = playerIds[i]
      backEndPlayers[playerId].cardsOnHand = playersInitialHand.slice(i * 7, (i + 1) * 7)
      // console.log(' backEndPlayers[playerId].cardsOnHand ', backEndPlayers[playerId].cardsOnHand)
      console.log('playersInitialHand', playersInitialHand)
    }

    return deck
  }

  const updateGameBoard = () => {
    return cardOnGameBoard
  }

  io.on('connection', (socket: Socket) => {
    let amountPlayers: number

    socket.on('initGame', ({ color, username }) => {
      backEndPlayers[socket.id] = {
        color: color,
        username: username,
        cardsOnHand: undefined,
      }
      // io.emit('playerIsReady', backEndPlayers[socket.id])

      const allowedSizes = [2, 3, 4, 6, 8, 9, 10, 12]
      amountPlayers = Object.keys(backEndPlayers).length

      io.emit('amountPlayers', amountPlayers)

      if (allowedSizes.find((size) => size === amountPlayers) !== undefined) {
        io.emit('readyToPlay', true)
      }
    })

    socket.on('startGame', () => {
      const gameId = socket.id
      console.log('socket startGame on')

      io.emit('gameHasStarted', true)

      games[gameId] = {
        deck: createNewDoubleDeck(Object.keys(backEndPlayers).length),
        gameBoard: updateGameBoard(),
        hasStarted: true,
      }
      for (const playerId in backEndPlayers) {
        console.log('backEndPlayers', backEndPlayers)
        console.log(playerId)
        io.to(playerId).emit('cardsOnHand', backEndPlayers[playerId].cardsOnHand)
      }
      console.log('startGame, emit gameStateUpdate')
      io.emit('gameStateUpdate', {
        message: 'Game started',
        gameState: games[gameId],
      })
    })

    socket.on('disconnect', (reason) => {
      console.log(reason)
      delete backEndPlayers[socket.id]
      io.emit('updatePlayers', backEndPlayers)
      io.emit('gameEnds', true)
    })
  })
}

// En person trycker start game, endast den får updates för spelet båda behöver joina
// Hitta sätt att skicka korrekt information i rätt tid
// Alla behöver få informationen när personen startar spelet
// Skicka ut all information
