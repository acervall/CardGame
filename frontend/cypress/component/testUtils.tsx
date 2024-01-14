import { ReactNode } from 'react'
import { UserProvider } from '../../src/context/UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Context from '../../src/context/Context'

const queryClient = new QueryClient()
const accessToken = 'mockAccessToken'

export function withProviders(component: ReactNode) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Context.Provider value={{ accessToken, setAccessToken: () => {} }}>
          <UserProvider>{component}</UserProvider>
        </Context.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}
