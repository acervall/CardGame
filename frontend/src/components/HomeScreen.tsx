import LogoutButton from './LogoutButton'
import { useNavigate } from 'react-router-dom'
import { SubmitButton } from '../assets/StyledComponents/FormComponents'
import useUser from '../hooks/useUser'

const HomeScreen = () => {
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (user) {
    const handleClick = async () => {
      navigate(`/profile`)
    }

    return (
      <>
        <h1>Home Screen</h1>
        <p>
          Welcome <span style={{ textTransform: 'capitalize' }}>{user.first_name}</span>
        </p>
        <SubmitButton onClick={handleClick}>Profile</SubmitButton>
        <LogoutButton />
      </>
    )
  }
}

export default HomeScreen
