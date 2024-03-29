import { useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import Context from '../context/Context'
import { LogoutUser } from '../api/user'
import { useNavigate } from 'react-router-dom'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'

const LogoutButton = () => {
  const { setAccessToken } = useContext(Context)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await LogoutUser(queryClient, setAccessToken)
    navigate(`/`)
  }

  return <RoundedButton onClick={handleLogout}>Logout</RoundedButton>
}

export default LogoutButton
