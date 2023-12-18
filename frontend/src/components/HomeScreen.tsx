import LogoutButton from './LogoutButton'
import useUser from '../hooks/useUser'

const HomeScreen = () => {
  const { data: user, isLoading, error } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (user) {
    return (
      <>
        <h1>Home Screen</h1>
        <p>
          Welcome <span style={{ textTransform: 'capitalize' }}>{user.first_name}</span>
        </p>
        <LogoutButton />
      </>
    )
  }
}

export default HomeScreen
