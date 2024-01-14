import { GameProvider } from '../utils/GameContext'
import Sequence from '../components/Sequence'
import GameLobby from '../components/GameLobby'
import { useGame } from '../utils/useGame'
import useUser from '../hooks/useUser'
import { LogoutUser } from '../api/user'
import Context from '../constants/Context'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'

const GameSpace = () => {
  const { gameHasStarted } = useGame()
  const { data: user, isLoading, error } = useUser()
  const queryClient = useQueryClient()
  const { setAccessToken } = useContext(Context)
  const navigate = useNavigate()

  if (user) {
    return (
      <>
        {gameHasStarted ? (
          <>
            <Sequence />
          </>
        ) : (
          <GameLobby />
        )}
      </>
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    LogoutUser(queryClient, setAccessToken)
    navigate(`/`)
    return <div>Error: {error.message}</div>
  }
}

const Game = () => {
  return (
    <GameProvider>
      <GameSpace />
    </GameProvider>
  )
}

export default Game
