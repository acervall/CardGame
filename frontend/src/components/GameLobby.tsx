import { useState, useEffect } from 'react'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import { initializeSocket, joinGame, startGame } from '../api/socket'
import useUser from '../hooks/useUser'
import { color } from '../assets/colors'
import { useGame } from '../utils/GameContext'

const GameLobby = () => {
  const { socket } = useGame()
  // const [rooms, setRooms] = useState<string[]>([])
  // const [joinedRoom, setJoinedRoom] = useState<string | null>(null)
  // const [gameState, setGameState] = useState(null)
  const [gameColor, setGameColor] = useState<string | null>(null)
  const [gameIsReady, setGameIsReady] = useState<boolean>(false)
  const [amountPlayers, setAmountPlayers] = useState<number>(0)

  const { data: user, isLoading, error } = useUser()

  socket.on('readyToPlay', (isReady: boolean) => {
    if (isReady) {
      setGameIsReady(true)
    }
  })

  socket.on('amountPlayers', (amountPlayers: number) => {
    console.log('amountPlayers', amountPlayers)
    if (amountPlayers) {
      setAmountPlayers(amountPlayers)
    }
  })

  if (user) {
    const username = user.username

    const handleStartGame = () => {
      startGame()
    }

    const selectGameColor = (gameColor: string) => {
      setGameColor(gameColor)
      if (gameColor) {
        joinGame(gameColor, username)
        // if (amountPlayers === 0) {
        //   setAmountPlayers(1)
        // }
      }
    }

    return (
      <div>
        <h1>Game Lobby</h1>
        <p>Username: {username}</p>
        {!gameColor && (
          <>
            <p>Game color: {gameColor}</p>
            <RoundedButton data-testid="button-red" onClick={() => selectGameColor(color.red)}>
              Red
            </RoundedButton>
            <RoundedButton data-testid="button-green" onClick={() => selectGameColor(color.green)}>
              Green
            </RoundedButton>
            <RoundedButton data-testid="button-blue" onClick={() => selectGameColor(color.blue)}>
              Blue
            </RoundedButton>
          </>
        )}
        {gameIsReady && (
          <>
            <RoundedButton data-testid="start-game" onClick={handleStartGame}>
              Start game
            </RoundedButton>
          </>
        )}
        <p>
          Players in game: <p data-testid="amount-players">{amountPlayers}</p>
        </p>
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
