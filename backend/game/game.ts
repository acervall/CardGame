import { Server as IOServer, Socket } from 'socket.io'
import { doubleDeck, shuffleDeck } from './deck'

const createNewDeck = () => {
  return shuffleDeck(doubleDeck)
}

export function setupGame(io: IOServer) {
  const userCreatedRooms = new Set()
  let games: { [key: string]: any } = {}

  io.on('connection', (socket: Socket) => {
    socket.on('createRoom', (roomName) => {
      socket.join(roomName)
      userCreatedRooms.add(roomName)
      io.emit('roomCreated', roomName)
    })

    const rooms = Array.from(userCreatedRooms)

    socket.on('joinRoom', (roomName) => {
      if (games[roomName] && games[roomName].hasStarted) {
        console.log('A game has already started in this room')
        return
      }

      console.log('joining room', roomName)
      socket.join(roomName)
    })

    socket.on('startGame', (gameId) => {
      if (!userCreatedRooms.has(gameId)) {
        console.log('User is not in the room they are trying to start a game in')
        io.to(gameId).emit('gameStateUpdate', {
          message: 'User is not in the room they are trying to start a game in',
        })
        return
      }

      const usersInRoom = io.sockets.adapter.rooms.get(gameId)

      const allowedSizes = [2, 3, 4, 6, 8, 9, 10, 12]
      if (!usersInRoom || !allowedSizes.includes(usersInRoom.size)) {
        console.log('The game cannot be started with this number of users')
        io.to(gameId).emit('gameStateUpdate', {
          message: 'The game cannot be started with this number of users',
        })
        return
      }

      games = {
        ...games,
        [gameId]: {
          deck: createNewDeck(),
          hasStarted: true,
        },
      }

      io.to(gameId).emit('gameStateUpdate', { message: 'Game started', gameState: games[gameId] })
    })

    socket.on('getRooms', () => {
      const gameKeys = Object.keys(games)
      const availableRooms = (rooms as string[]).filter(
        (roomName: string) => !gameKeys.includes(roomName),
      )
      socket.emit('roomsReceived', availableRooms)
    })

    socket.on('leaveRoom', (roomName) => {
      socket.leave(roomName)

      const usersInRoom = io.sockets.adapter.rooms.get(roomName)

      if (!usersInRoom || usersInRoom.size === 0) {
        delete rooms[roomName]
        io.emit('roomsReceived', Object.keys(rooms))
      }
    })
  })
}
