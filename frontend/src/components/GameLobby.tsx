import { useState, useEffect } from 'react'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import useUser from '../hooks/useUser'
import { useGame } from '../utils/useGame'
import styled from '@emotion/styled'

const PlayerView = styled.div`
  display: flex;
  gap: 10px;
`

const GameLobby = () => {
  const {
    cardsOnHand,
    initGame,
    startGame,
    disconnect,
    backendPlayers,
    readyToPlay,
    getHand,
    team,
    setTeam,
  } = useGame()
  const [gameIsReady, setGameIsReady] = useState<boolean>(false)

  const { data: user, isLoading, error } = useUser()

  useEffect(() => {
    setGameIsReady(readyToPlay)
    console.log('readyToPlay', readyToPlay)
    if (readyToPlay && !cardsOnHand) {
      getHand()
      console.log('readyToPlay', readyToPlay)
      console.log('cardsOnHand', cardsOnHand)
    }
  }, [readyToPlay, cardsOnHand])

  useEffect(() => {
    console.log('team', team)
  }, [team])

  if (user) {
    const username = user.username

    const handleStartGame = () => {
      startGame()
    }

    const selectGameColor = (gameColor: string) => {
      console.log('gameColor', gameColor)
      setTeam(gameColor)
      initGame(gameColor)
    }

    return (
      <div>
        <h1>Game Lobby</h1>
        <p>Username: {username}</p>
        {team === '' && (
          <>
            <p>Game color: {team}</p>
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
        <PlayerView>
          <div>
            <p>Team Red:</p>
            {backendPlayers.map((player, index) => {
              if (player.color === 'red') {
                return <p key={index}>{player.username}</p>
              }
            })}
          </div>
          <div>
            <p>Team Green:</p>
            {backendPlayers.map((player, index) => {
              if (player.color === 'green') {
                return <p key={index}>{player.username}</p>
              }
            })}
          </div>
          <div>
            <p>Team Blue:</p>
            {backendPlayers.map((player, index) => {
              if (player.color === 'blue') {
                return <p key={index}>{player.username}</p>
              }
            })}
          </div>
        </PlayerView>
        <p>
          Players in game: <p data-testid="amount-players">{backendPlayers.length}</p>
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
