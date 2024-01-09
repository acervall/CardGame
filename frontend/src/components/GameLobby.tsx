import { useState, useEffect } from 'react'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import { useGame } from '../utils/useGame'
import styled from '@emotion/styled'
import { Team } from '../constants/Deck'

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
    username,
  } = useGame()
  const [gameIsReady, setGameIsReady] = useState<boolean>(false)

  useEffect(() => {
    setGameIsReady(readyToPlay)
    if (readyToPlay && !cardsOnHand) {
      getHand()
    }
  }, [readyToPlay, cardsOnHand, getHand])

  const handleStartGame = () => {
    startGame()
  }

  const selectGameColor = (gameColor: Team) => {
    setTeam(gameColor)
    if (gameColor) {
      initGame(gameColor)
    }
  }

  return (
    <div>
      <h1>Game Lobby</h1>
      <p>Username: {username}</p>
      {team === undefined && (
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
      <div>
        Players in game: <p data-testid="amount-players">{backendPlayers.length}</p>
      </div>

      <RoundedButton onClick={getHand}>getHand</RoundedButton>
      <RoundedButton onClick={disconnect}>disconnect</RoundedButton>
    </div>
  )
}

export default GameLobby
