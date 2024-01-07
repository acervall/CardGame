import { useContext } from 'react'
import { UserContext } from './UserContext'

export const useUsername = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUsername must be used within a UserProvider')
  }
  return context
}
