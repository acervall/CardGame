import { useState, useEffect } from 'react'
import Sequence from '../components/Sequence'
import GameLobby from '../components/GameLobby'
import { initializeSocket, gameIsStarting, stoppingGame, disconnect } from '../api/socket'

function Game() {
  const [gameHasStarted, setGameHasStarted] = useState(false)

  useEffect(() => {
    initializeSocket()
    gameIsStarting().then(({ isReady }) => {
      if (isReady) {
        // console.log('State of game', isReady)
        setGameHasStarted(isReady)
      }
    })
    stoppingGame().then(({ isReady }) => {
      if (isReady) {
        // console.log('Ending game', isReady)
        setGameHasStarted(false)
      }
    })
  }, [])

  const leaveGame = () => {
    disconnect()
    // console.log('Leaving game')
    setGameHasStarted(false)
  }

  return (
    <>
      {gameHasStarted ? (
        <>
          <button style={{ zIndex: 5, position: 'relative' }} onClick={leaveGame}>
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

export default Game

// Diagonal fungerar ej
// När man väljer en som redan finns markerad så försvinner den andra
