import styled from '@emotion/styled'
import { color } from '../assets/colors'
import { Card } from '../constants/Deck'
import { Cards } from './Card'
import { useState } from 'react'
// import { initializeSocket, cardsOnHand, GamesInterface, getGameStateUpdate } from '../api/socket'
import { useGame } from '../utils/useGame'

const GameView = styled.div`
  height: 100vh;
  width: calc(100vw - 40px);
  background-color: ${color.green};
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`

const GamePlan = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 1px;
  padding: 10px;
  width: calc((6vh + 10px) * 10);
  height: fit-content;
`

const Hand = styled.div`
  display: flex;
  gap: 2px;
  width: 100%;
  margin-bottom: 100px;
`

const DeckContainer = styled.div`
  width: 100%;
  margin-bottom: 100px;
  display: flex;
  justify-content: space-between;
`

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 10vw;
`

const AlertSquare = styled.div`
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

function Sequence() {
  const {
    canDraw,
    cardsOnHand,
    drawCard,
    gameBoard,
    gameOver,
    playersTurn,
    setCanDraw,
    setGameBoard,
    team,
    throwPile,
    updateGameboard,
    username,
    throwCard,
  } = useGame()

  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [canThrow, setCanThrow] = useState<boolean>(false)

  console.log('gameBoard', gameBoard)
  function selectCard(card: Card) {
    setSelectedCard(card)
    const isOneEyedJack = card.face === 'J' && (card.suit === 'S' || card.suit === 'H')
    const isTwoEyedJack = card.face === 'J' && (card.suit === 'C' || card.suit === 'D')
    if (gameBoard && isOneEyedJack) {
      const newGameBoard: Card[][] = gameBoard.map((row) =>
        row.map((gameCard: Card) => {
          if (gameCard.status === 'Available') {
            return { ...gameCard, status: 'Unset' }
          } else if (gameCard.status === 'Selected' && gameCard.team !== team) {
            return { ...gameCard, status: 'CanBeRemoved' }
          } else {
            return gameCard
          }
        }),
      )
      setGameBoard(newGameBoard)
    } else if (gameBoard && isTwoEyedJack) {
      const newGameBoard: Card[][] = gameBoard.map((row) =>
        row.map((gameCard: Card) => {
          if (gameCard.status === 'Unset') {
            return { ...gameCard, status: 'Available' }
          } else if (gameCard.status === 'CanBeRemoved') {
            return { ...gameCard, status: 'Selected' }
          } else {
            return gameCard
          }
        }),
      )
      setGameBoard(newGameBoard)
    } else if (gameBoard) {
      const newGameBoard: Card[][] = gameBoard.map((row) =>
        row.map((gameCard: Card) => {
          if (
            (gameCard === card || (gameCard.value === card.value && gameCard.suit === card.suit)) &&
            gameCard.status !== 'Selected'
          ) {
            return { ...gameCard, status: 'Available' }
          } else if (gameCard.status === 'Available') {
            return { ...gameCard, status: 'Unset' }
          } else if (gameCard.status === 'CanBeRemoved') {
            return { ...gameCard, status: 'Selected' }
          } else {
            return gameCard
          }
        }),
      )
      setGameBoard(newGameBoard)

      const noAvailableCards = newGameBoard.every((row) =>
        row.every((gameCard) => gameCard.status !== 'Available'),
      )

      if (noAvailableCards && card.face !== 'J') {
        setCanThrow(true)
      } else {
        setCanThrow(false)
      }
    }
  }
  const handleThrowCard = () => {
    if (selectedCard !== null) {
      throwCard(selectedCard)
    }
    setCanDraw(true)
    setCanThrow(false)
  }
  function placeMarker(card: Card) {
    setCanThrow(false)
    if (
      (selectedCard && card.status === 'Available') ||
      (selectedCard && card.status === 'CanBeRemoved')
      // (selectedCard && card.value === selectedCard.value && card.suit === selectedCard.suit) ||
      // (selectedCard && card.status === 'CanBeRemoved')
    ) {
      setCanDraw(true)
      if (gameBoard) {
        const newGameBoard: Card[][] = gameBoard.map((row) =>
          row.map((gameCard: Card) => {
            if (gameCard === card && gameCard.status === 'CanBeRemoved') {
              return { ...gameCard, status: 'Unset', team: undefined }
            } else if (gameCard === card) {
              return { ...gameCard, status: 'Selected', team: team }
            } else if (gameCard.status === 'Available') {
              return { ...gameCard, status: 'Unset' }
            } else if (gameCard.status === 'CanBeRemoved') {
              return { ...gameCard, status: 'Selected' }
            } else {
              return gameCard
            }
          }),
        )
        setGameBoard(newGameBoard)
        updateGameboard(newGameBoard, selectedCard)
      }
    }
  }

  return (
    <GameView data-testid="game-view">
      {!!gameOver && <AlertSquare>TEAM {gameOver} WON!</AlertSquare>}
      <LeftSide>
        <DeckContainer>
          <button disabled={!canDraw} onClick={drawCard}>
            Draw
          </button>
          <button disabled={!canThrow} onClick={handleThrowCard}>
            Throw card
          </button>
          {!!throwPile && (
            <div>
              {throwPile.length > 0 && (
                <div
                  data-testid="throw-pile"
                  // data-card-nr={throwPile[throwPile.length - 1].nr}
                >
                  <Cards {...throwPile[throwPile.length - 1]} />
                </div>
              )}
            </div>
          )}
        </DeckContainer>
        {username === playersTurn ? <p>It's your turn</p> : <p>It's {playersTurn}'s turn</p>}
        <Hand>
          {cardsOnHand &&
            cardsOnHand.map((card, i) => {
              return (
                <div
                  key={i}
                  onClick={username === playersTurn ? () => selectCard(card) : undefined}
                >
                  <div data-testid="cards" data-card-nr={card.nr} key={i}>
                    <Cards key={i} {...card} />
                  </div>
                </div>
              )
            })}
        </Hand>
      </LeftSide>
      {gameBoard && (
        <GamePlan data-testid="game-board">
          {gameBoard.map((row, i) => {
            return row.map((card: Card, j: number) => {
              return (
                <div
                  key={`${i}-${j}`}
                  data-testid="game-board-card"
                  data-card-status={card.status}
                  data-card-nr={card.nr}
                  onClick={() => placeMarker(card)}
                >
                  <Cards gameBoard={true} {...card} />
                </div>
              )
            })
          })}
        </GamePlan>
      )}
    </GameView>
  )
}

export default Sequence

// kolla att korrekt kort finns i deck
