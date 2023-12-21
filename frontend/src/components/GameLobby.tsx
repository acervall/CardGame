import { useState, useEffect } from 'react'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import {
  initializeSocket,
  createRoom,
  joinRoom,
  onRoomCreated,
  getRooms,
  onRoomsReceived,
  leaveRoom,
  startGame,
  onGameStateUpdate,
} from '../api/socket'
import useUser from '../hooks/useUser'

const GameLobby = () => {
  const [rooms, setRooms] = useState<string[]>([])
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null)
  const [gameState, setGameState] = useState(null)

  const { data: user, isLoading, error } = useUser()

  useEffect(() => {
    initializeSocket()

    onRoomsReceived((rooms) => {
      setRooms(rooms)
    })

    onGameStateUpdate((response) => {
      if (response.gameState) {
        console.log(response.gameState)
      } else {
        console.log(response.message)
      }
    })

    getRooms()
  }, [])

  if (user) {
    const username = user.username

    const handleCreateTable = () => {
      createRoom(username)
      joinRoom(username)
      setJoinedRoom(username)
      getRooms()
    }

    const handleJoinTable = (room: string) => {
      joinRoom(room)
      setJoinedRoom(room)
    }

    const handleStartGame = () => {
      startGame(joinedRoom || username)
    }

    return (
      <div>
        <h1>Game Lobby</h1>
        <p>Username: {username}</p>
        <RoundedButton id="create-table" onClick={handleCreateTable}>
          Create table
        </RoundedButton>
        <RoundedButton id="start-game" onClick={handleStartGame}>
          Start game
        </RoundedButton>
        <RoundedButton id="leave-table" onClick={() => leaveRoom(joinedRoom || username)}>
          Leave table
        </RoundedButton>
        <h2>Existing Rooms</h2>
        <ul>
          {rooms.map((room, index) => (
            <li key={index}>
              {room}
              <button onClick={() => handleJoinTable(room)}>Join</button>
            </li>
          ))}
        </ul>
        {gameState && (
          <div>
            <h2>Game State</h2>

            {/* Render the game state here */}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }
}

export default GameLobby
