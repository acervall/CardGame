import { useState } from 'react'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Game from './views/Game'
import Context from './constants/Context'
import { UserProvider } from './utils/UserContext'

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

  return <RouterProvider router={router} />
}

export default App
