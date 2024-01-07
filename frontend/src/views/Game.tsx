import { GameProvider } from '../utils/GameContext'
import Sequence from '../components/Sequence'
import GameLobby from '../components/GameLobby'
import { useGame } from '../utils/useGame'
import { useEffect } from 'react'

const GameSpace = () => {
  const { disconnect, gameHasStarted } = useGame()

  const leaveGame = () => {
    disconnect()
  }

  useEffect(() => {
    console.log(gameHasStarted)
  }, [gameHasStarted])

  return (
    <>
      {gameHasStarted ? (
        <>
          <button onClick={leaveGame} style={{ position: 'fixed', zIndex: 5 }}>
            Leave Game
          </button>
          <Sequence />
        </>
      ) : (
        <GameLobby />
      )}
    </>
  )
}

const Game = () => {
  return (
    <GameProvider>
      <GameSpace />
    </GameProvider>
  )
}

export default Game

// Diagonal fungerar ej
// När man väljer en som redan finns markerad så försvinner den andra
