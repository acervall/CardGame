import { useNavigate } from 'react-router-dom'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import styled from '@emotion/styled'
// import { color } from '../assets/colors'

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-around;
  position: relative;
  top: 0;
  transition: top 0.5s ease-in-out;
`

// const Arrow = styled.div`
//   position: absolute;
//   width: 100%;
//   text-align: center;
//   opacity: 1;
//   transition: opacity 0.5s ease-in-out;
//   font-size: 40px;
//   color: ${color.lightGray};
// `

const NavbarContainer = styled.div`
  position: fixed;
  bottom: 1vh;
  width: 100%;

  /* &:hover {
    & > :first-child {
      opacity: 0;
    }
    & > :last-child {
      top: 0;
    }
  } */
`

function Navbar() {
  const navigate = useNavigate()

  const handleClick = async (path: string) => {
    navigate(`${path}`)
  }
  return (
    <NavbarContainer>
      {/* <Arrow>^</Arrow> */}
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
    </NavbarContainer>
  )
}

export default Navbar
