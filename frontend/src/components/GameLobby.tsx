import { useState, useEffect } from 'react'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
// import { initializeSocket, joinGame, startGame } from '../api/socket'
import useUser from '../hooks/useUser'
import { useGame } from '../utils/useGame'

const GameLobby = () => {
  const {
    cardsOnHand,
    initGame,
    startGame,
    disconnect,
    amountPlayers,
    readyToPlay,
    getHand,
    team,
  } = useGame()
  const [gameColor, setGameColor] = useState<string | null>(null)
  const [gameIsReady, setGameIsReady] = useState<boolean>(false)

  const { data: user, isLoading, error } = useUser()

  useEffect(() => {
    setGameIsReady(readyToPlay)
    if (readyToPlay && !cardsOnHand) {
      getHand()
      console.log('readyToPlay', readyToPlay)
      console.log('cardsOnHand', cardsOnHand)
    }
  }, [readyToPlay, cardsOnHand])

  useEffect(() => {
    console.log(team)
  }, [team])

  if (user) {
    const username = user.username

    const handleStartGame = () => {
      startGame()
    }

    const selectGameColor = (gameColor: string) => {
      setGameColor(gameColor)
      if (gameColor) {
        initGame(gameColor)
      }
    }

    return (
      <div>
        <h1>Game Lobby</h1>
        <p>Username: {username}</p>
        {!gameColor && (
          <>
            <p>Game color: {gameColor}</p>
            <RoundedButton data-testid="button-red" onClick={() => selectGameColor('red')}>
              Red
            </RoundedButton>
            <RoundedButton data-testid="button-green" onClick={() => selectGameColor('green')}>
              Green
            </RoundedButton>
            <RoundedButton data-testid="button-blue" onClick={() => selectGameColor('blue')}>
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
        {team && (
          <div>
            <p>My team: {team}</p>
            <p>My hand:{cardsOnHand?.length}</p>
          </div>
        )}
        <p>
          Players in game: <p data-testid="amount-players">{amountPlayers}</p>
        </p>
        <RoundedButton onClick={getHand}>getHand</RoundedButton>
        <RoundedButton onClick={disconnect}>disconnect</RoundedButton>
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
