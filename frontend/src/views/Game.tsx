import Sequence from '../components/Sequence'
import GameLobby from '../components/GameLobby'
import { useGame } from '../utils/GameContext'
import { useEffect } from 'react'

function Game() {
  const {
    gameState,
    socket,
    cardsOnHand,
    initGame,
    startGame,
    disconnect,
    amountPlayers,
    readyToPlay,
  } = useGame()

  const leaveGame = () => {
    socket.emit('disconnect')
  }

  useEffect(() => {
    console.log(gameState)
  }, [gameState])

  return (
    <>
      {gameState ? (
        <>
          <button onClick={leaveGame}>Leave Game</button>
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
