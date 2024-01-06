import { useState, useContext, createContext } from 'react'
import useUser from '../hooks/useUser'

export const UserContext = createContext<string | undefined>(undefined)

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null)

  const { data: user, isLoading, error } = useUser()

  if (user && username === null) {
    setUsername(user.username)
  }

  return (
    <UserContext.Provider
      value={{
        username,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUsername = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUsername must be used within a UserProvider')
  }
  return context
}
