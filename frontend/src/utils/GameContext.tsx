import { createContext, useState, useEffect, useContext } from 'react'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '../constants/baseUrl'

interface GameState {
  deck: Card[]
  gameBoard: Card[][] | undefined
  hasStarted: boolean
}

interface GameContextProps {
  gameState: GameState | null
  socket: Socket
}

export const GameContext = createContext<GameContextProps | undefined>(undefined)

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const socket = io(BASE_URL)

  useEffect(() => {
    socket.on('gameStateUpdate', (data) => {
      setGameState(data.gameState)
    })

    return () => {
      socket.off('gameStateUpdate')
    }
  }, [])

  return <GameContext.Provider value={{ gameState, socket }}>{children}</GameContext.Provider>
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
