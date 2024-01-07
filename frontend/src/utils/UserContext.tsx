import { useState, createContext, ReactNode } from 'react'
import useUser from '../hooks/useUser'

interface UserContextType {
  username: string
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string>('')

  const { data: user } = useUser()

  if (user && username === '') {
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
