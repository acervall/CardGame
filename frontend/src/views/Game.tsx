import Sequence from '../components/Sequence'
import GameLobby from '../components/GameLobby'
import { useGame } from '../utils/GameContext'

function Game() {
  const { gameState, socket } = useGame()

  const leaveGame = () => {
    socket.emit('disconnect')
  }

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
