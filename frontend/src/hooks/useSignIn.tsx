import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { IdentifierPassword, User } from '../utils/types'
import { LoginUser } from '../api/user'

const useSignIn = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<User, Error, IdentifierPassword, unknown>(
    // @ts-expect-error this is a valid mutation
    (user: IdentifierPassword) => LoginUser(user),
    {
      onSuccess: (data: User) => {
        queryClient.setQueryData(['user'], data)
        navigate('/')
      },
      onError: (error: Error) => {
        console.error(error)
      },
    },
  )
}

export default useSignIn
