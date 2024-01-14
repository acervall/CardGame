import { useNavigate } from 'react-router-dom'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import styled from '@emotion/styled'
import { useState, useRef, useEffect } from 'react'

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-around;
  position: relative;
  top: 0;
  transition: top 0.5s ease-in-out;
`

const NavbarContainer = styled.div`
  position: fixed;
  bottom: 1vh;
  width: 100%;
`

function Navbar() {
  const navigate = useNavigate()
  const [showNavbar, setShowNavbar] = useState(false)
  const navbarRef = useRef(null)

  const handleClick = async (path: string) => {
    navigate(`${path}`)
  }

  useEffect(() => {
    if (showNavbar) {
      const timer = setTimeout(() => {
        setShowNavbar(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showNavbar])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navbarRef.current && !(navbarRef.current as HTMLElement).contains(event.target as Node)) {
        setShowNavbar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <NavbarContainer ref={navbarRef}>
        {showNavbar ? (
          <NavbarContent>
            <RoundedButton onClick={() => handleClick('/')} data-testid="home">
              Home
            </RoundedButton>
            <RoundedButton onClick={() => handleClick('/game')} data-testid="game">
              Game
            </RoundedButton>
            <RoundedButton onClick={() => handleClick('/profile')} data-testid="profile">
              Profile
            </RoundedButton>
          </NavbarContent>
        ) : (
          <div
            data-testid="showNavbar"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowNavbar(true)}
          >
            =
          </div>
        )}
      </NavbarContainer>
    </>
  )
}

export default Navbar
