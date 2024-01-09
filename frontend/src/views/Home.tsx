import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import SigninSignup from '../components/SigninSignup'
import HomeScreen from '../components/HomeScreen'
import useUser from '../hooks/useUser'

function Home() {
  const { data: user, isLoading, isError } = useUser()
  const accessToken = localStorage.getItem('accessToken')
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
  }, [accessToken, queryClient])

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError || !user) {
    return <SigninSignup />
  }

  return <HomeScreen />
}

export default Home
