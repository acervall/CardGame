import { createContext, Dispatch, SetStateAction } from 'react'

type AccessTokenContextType = {
  accessToken: string | null
  setAccessToken: Dispatch<SetStateAction<string | null>>
}

export default createContext<AccessTokenContextType>({
  accessToken: localStorage.getItem('accessToken'),
  setAccessToken: () => {},
})
