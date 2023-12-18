import { useQuery } from '@tanstack/react-query'
import { GetUser } from '../api/user'
import { useContext } from 'react'
import Context from '../constants/Context'

const useUser = () => {
  const { accessToken } = useContext(Context)

  return useQuery({
    queryKey: ['user', accessToken],
    queryFn: GetUser,
    enabled: !!accessToken,
  })
}

export default useUser
