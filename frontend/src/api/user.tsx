import { IdentifierPassword, User, UserId, NewUser, UserSettings } from '../utils/types'
import axios from 'axios'
import { BASE_URL } from '../constants/baseUrl'
import { QueryClient } from '@tanstack/react-query'

export const GetUser = async (): Promise<UserSettings> => {
  const accessToken = localStorage.getItem('accessToken')

  try {
    const { data } = await axios.get<UserSettings>(`${BASE_URL}/auth/info`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    console.log(data)
    return data
  } catch (error) {
    console.error('Error logging in:', error)
    throw new Error('Error logging in')
  }
}

export const LoginUser = async (
  user: IdentifierPassword,
  queryClient: QueryClient,
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<User> => {
  const { identifier, password } = user

  try {
    const response = await axios.post<User>(`${BASE_URL}/auth/login`, {
      identifier,
      password,
    })
    setAccessToken(response.data.accessToken)
    localStorage.setItem('accessToken', response.data.accessToken)
    queryClient.invalidateQueries({ queryKey: ['user'] })
    return response.data
  } catch (error) {
    console.error('Error logging in:', error)
    throw new Error('Error logging in')
  }
}

export const SignupUser = async (
  user: NewUser,
  queryClient: QueryClient,
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<void> => {
  try {
    await axios.post<User>(`${BASE_URL}/auth/signup`, {
      user,
    })
    LoginUser({ identifier: user.username, password: user.password }, queryClient, setAccessToken)
  } catch (error) {
    console.error('Error signing up:', error)
    throw new Error('Error signing up')
  }
}

export const LogoutUser = async (
  queryClient: QueryClient,
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<void> => {
  queryClient.clear()
  localStorage.clear()
  sessionStorage.clear()
  setAccessToken(null)
}

export const EditUser = async (user: User, queryClient: QueryClient): Promise<void> => {
  try {
    await axios.put<User>(`${BASE_URL}/auth/edit`, user)
    queryClient.invalidateQueries({ queryKey: ['user'] })
  } catch (error) {
    console.error('Error editing user:', error)
    throw new Error('Error editing user')
  }
}

export const DeleteUser = async (
  user: UserId,
  queryClient: QueryClient,
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<void> => {
  try {
    await axios.delete<UserId>(`${BASE_URL}/auth`, {
      data: { id: user.id },
    })
    LogoutUser(queryClient, setAccessToken)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error('Error deleting user')
  }
}
