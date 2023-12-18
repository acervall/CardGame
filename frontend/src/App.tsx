import { useState } from 'react'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Context from './constants/Context'

function Root() {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'))
  return (
    <Context.Provider value={{ accessToken, setAccessToken }}>
      <main>
        <Outlet />
      </main>
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
