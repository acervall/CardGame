import { useState } from 'react'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Game from './views/Game'
import Context from './context/Context'
import { UserProvider } from './context/UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Navbar from './components/Navbar'

function Root() {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'))
  return (
    <Context.Provider value={{ accessToken, setAccessToken }}>
      <UserProvider>
        <main>
          <Outlet />
          <Navbar />
        </main>
      </UserProvider>
    </Context.Provider>
  )
}

function App() {
  const queryClient = new QueryClient()

  const router = createHashRouter([
    {
      children: [
        {
          element: <Profile />,
          path: '/profile',
        },
        {
          element: <Game />,
          path: '/Game',
        },
        {
          element: <Home />,
          path: '/',
        },
      ],
      element: <Root />,
    },
  ])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
