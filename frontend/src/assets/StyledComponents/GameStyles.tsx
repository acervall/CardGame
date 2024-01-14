import styled from '@emotion/styled'
import { color } from '../colors'

export const GameView = styled.div`
  height: 100vh;
  width: calc(100vw);
  background-color: ${color.green};
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`

export const GamePlan = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 12px;
  padding: 10px;
  min-width: 80%;
  height: 70%;
`

export const Hand = styled.div`
  display: flex;
  gap: 2px;
  justify-content: center;
  align-items: center;
  min-width: 40vw;
  margin: 0 4vh;
  div {
    min-width: fit-content;
    display: flex;
    justify-content: center;
    button {
      width: 5.6vh;
    }
  }
`

export const ThrowPile = styled.div`
  min-width: fit-content;
  display: flex;
  justify-content: center;
  height: calc(8vh + 10px);

  div {
    height: fit-content;
    width: fit-content;

    display: flex;
    justify-content: center;
    align-items: baseline;
  }
`

export const DrawButton = styled.div`
  img {
    border-right: 6px solid #f6f6f6;
    border-bottom: 4px solid #d7d7d7;
    border-top: 1px solid #f6f6f6;
    border-left: 1px solid #f6f6f6;
    background-color: #f6f6f6;
    border-radius: 1px;
    width: fit-content;
    max-width: 5vw;
    object-fit: cover;
  }
`

export const DeckContainer = styled.div`
  width: 50px;
  display: flex;
  justify-content: center;
  border: 2px solid ${color.white};
  transform: rotate(15deg);
  padding: 5px;
  min-width: calc((7vw + 15px) * 0.7);
  min-height: calc(7vw + 15px);
  margin: -3px 3px 0px -3px;
`

export const MarkerContainer = styled.div`
  width: fit-content;
  height: 100px;
  border-radius: 50%;
  p {
    margin-top: -10px;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: ${color.white};
  }
  img {
    width: 50px;
  }
`

export const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const AlertSquare = styled.div`
  position: fixed;
  width: 30vw;
  height: 30vh;
  background-color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: larger;
`

export const LeaveButton = styled.button`
  all: unset;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  cursor: pointer;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: ${color.white};
  padding: 5px;
`
export const PlayerView = styled.div`
  display: flex;
  gap: 10px;
`
