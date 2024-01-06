import { GameProvider } from '../utils/GameContext'
import Sequence from '../components/Sequence'
import GameLobby from '../components/GameLobby'
import { useGame } from '../utils/GameContext'
import { useEffect } from 'react'

const GameSpace = () => {
  const {
    socket,
    cardsOnHand,
    initGame,
    startGame,
    disconnect,
    drawCard,
    amountPlayers,
    readyToPlay,
    currentDeck,
    gameBoard,
    gameHasStarted,
  } = useGame()

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
