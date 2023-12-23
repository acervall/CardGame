import { useState, useEffect } from 'react'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import { initializeSocket, joinGame, startGame, readyToPlay } from '../api/socket'
import useUser from '../hooks/useUser'
import { color } from '../assets/colors'

const GameLobby = () => {
  const [rooms, setRooms] = useState<string[]>([])
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null)
  const [gameState, setGameState] = useState(null)
  const [gameColor, setGameColor] = useState<string | null>(null)

  const { data: user, isLoading, error } = useUser()

  useEffect(() => {
    initializeSocket()
    readyToPlay()
  }, [])

  if (user) {
    const username = user.username

    const handleStartGame = () => {
      const test = readyToPlay()
      console.log('readyToPlay', test)
      // startGame()
    }

    const selectGameColor = (gameColor: string) => {
      setGameColor(gameColor)
      if (gameColor) {
        joinGame(gameColor, username)
      }
    }

    return (
      <div>
        <h1>Game Lobby</h1>
        <p>Username: {username}</p>

        {!gameColor ? (
          <>
            <p>Game color: {gameColor}</p>
            <RoundedButton onClick={() => selectGameColor(color.red)}>Red</RoundedButton>
            <RoundedButton onClick={() => selectGameColor(color.green)}>Green</RoundedButton>
            <RoundedButton onClick={() => selectGameColor(color.blue)}>Blue</RoundedButton>
          </>
        ) : (
          <>
            <RoundedButton id="start-game" onClick={handleStartGame}>
              Start game
            </RoundedButton>
          </>
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
