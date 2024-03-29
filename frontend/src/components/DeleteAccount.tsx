import { DeleteUser } from '../api/user'
import { UserId } from '../utils/types'
import { useQueryClient } from '@tanstack/react-query'
import useUser from '../hooks/useUser'
import { useContext } from 'react'
import Context from '../context/Context'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import { useNavigate } from 'react-router-dom'

const DeleteAccount = () => {
  const queryClient = useQueryClient()
  const { setAccessToken } = useContext(Context)
  const { data: user } = useUser()
  const navigate = useNavigate()

  if (user) {
    const handleClick = async () => {
      await DeleteUser({ id: user.id } as UserId, queryClient, setAccessToken)
      navigate('/')
    }

    return (
      <RoundedButton backgroundColor="#b30f0f" backgroundColorHover="#c30808" onClick={handleClick}>
        Delete
      </RoundedButton>
    )
  }
}

export default DeleteAccount
