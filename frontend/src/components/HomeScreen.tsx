import LogoutButton from './LogoutButton'
import useUser from '../hooks/useUser'
import styled from '@emotion/styled'

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 8px;
`

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
      <Background data-testid="background" style={{ backgroundColor: user.background_color }}>
        <h1>Home Screen</h1>
        <p>
          Welcome <span style={{ textTransform: 'capitalize' }}>{user.first_name}</span>
        </p>
        <LogoutButton />
      </Background>
    )
  }
}

export default HomeScreen
