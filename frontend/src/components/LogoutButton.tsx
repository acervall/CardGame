import { useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import Context from '../constants/Context'
import { LogoutUser } from '../api/user'
import { useNavigate } from 'react-router-dom'
import { SubmitButton } from '../assets/StyledComponents/FormComponents'

const LogoutButton = () => {
  const { setAccessToken } = useContext(Context)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await LogoutUser(queryClient, setAccessToken)
    navigate(`/`)
  }

  return <SubmitButton onClick={handleLogout}>Logout</SubmitButton>
}

export default LogoutButton
