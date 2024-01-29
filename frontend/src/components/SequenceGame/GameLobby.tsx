import { useState, useEffect } from 'react'
import { RoundedButton } from '../../assets/StyledComponents/FormComponents'
import { useGame } from '../../hooks/useGame'
import { Color } from '../../constants/Deck'
import { PlayerView } from '../../assets/StyledComponents/GameStyles'

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

  const selectGameColor = (gameColor: Color) => {
    setTeam(gameColor)
    if (gameColor) {
      initGame(gameColor)
    }
  }

  const teams: Color[] = ['red', 'green', 'blue']

  return (
    <div>
      <h1>Game Lobby</h1>
      <p>Username: {username}</p>
      {team === undefined && (
        <>
          <p>Game color: {team}</p>
          {teams.map((color) => (
            <RoundedButton
              data-testid={`button-${color}`}
              key={color}
              onClick={() => selectGameColor(color)}
            >
              {color}
            </RoundedButton>
          ))}
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
        {teams.map((color) => (
          <div key={color}>
            <p>Team {color}:</p>
            {backendPlayers.map((player, index) => {
              if (player.color === color) {
                return <p key={index}>{player.username}</p>
              }
              return null
            })}
          </div>
        ))}
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
