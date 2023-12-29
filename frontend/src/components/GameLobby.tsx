import { useState, useEffect } from 'react'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import { initializeSocket, joinGame, startGame, readyToPlay, getAmountPlayers } from '../api/socket'
import useUser from '../hooks/useUser'
import { color } from '../assets/colors'

const GameLobby = () => {
  // const [rooms, setRooms] = useState<string[]>([])
  // const [joinedRoom, setJoinedRoom] = useState<string | null>(null)
  // const [gameState, setGameState] = useState(null)
  const [gameColor, setGameColor] = useState<string | null>(null)
  const [gameIsReady, setGameIsReady] = useState<boolean>(false)
  const [amountPlayers, setAmountPlayers] = useState<number>(0)

  const { data: user, isLoading, error } = useUser()

  useEffect(() => {
    initializeSocket()
    readyToPlay().then(({ isReady, amountPlayers }) => {
      if (isReady) {
        setGameIsReady(true)
        // console.log('The number of players ready to play is', amountPlayers)
        if (amountPlayers !== undefined) {
          setAmountPlayers(amountPlayers)
        }
      }
    })
    getAmountPlayers().then((amountPlayers) => {
      if (amountPlayers) {
        console.log('The number of players ready to play is', amountPlayers)
        setAmountPlayers(amountPlayers)
      }
    })
  }, [])

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
            <RoundedButton onClick={() => selectGameColor(color.red)}>Red</RoundedButton>
            <RoundedButton onClick={() => selectGameColor(color.green)}>Green</RoundedButton>
            <RoundedButton onClick={() => selectGameColor(color.blue)}>Blue</RoundedButton>
          </>
        )}
        {gameIsReady && (
          <>
            <RoundedButton id="start-game" onClick={handleStartGame}>
              Start game
            </RoundedButton>
          </>
        )}
        <p>Players in game: {amountPlayers}</p>
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
