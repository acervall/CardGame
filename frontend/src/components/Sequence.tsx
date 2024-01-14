import styled from '@emotion/styled'
import { color } from '../assets/colors'
import { Card } from '../constants/Deck'
import { Cards } from './Card'
import { useEffect, useState } from 'react'
import { useGame } from '../utils/useGame'
import { cardImages } from '../assets/Cards/CardImages'
import { frontMarker, pile } from '../assets/Markers/markers'
import useUser from '../hooks/useUser'

const GameView = styled.div`
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

const GamePlan = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 12px;
  padding: 10px;
  min-width: 80%;
  height: 70%;
`

const Hand = styled.div`
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

const ThrowPile = styled.div`
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

const DrawButton = styled.div`
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

const DeckContainer = styled.div`
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

const MarkerContainer = styled.div`
  width: 100px;
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

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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

const LeaveButton = styled.button`
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
    disconnect,
    throwCard,
  } = useGame()

  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [canThrow, setCanThrow] = useState<boolean>(false)
  const [backOfDeck, setBackOfDeck] = useState<string | undefined>(undefined)

  const [yourTeamPile, setYourTeamPile] = useState<string | null>(null)
  const [markerFrontTeamTurn, setMarkerFrontTeamTurn] = useState<string | undefined>(undefined)

  const { data: user } = useUser()

  useEffect(() => {
    if (playersTurn !== undefined) {
      setMarkerFrontTeamTurn(frontMarker(playersTurn.color))
    }
  }, [playersTurn])

  useEffect(() => {
    if (team !== undefined) {
      setYourTeamPile(pile(team))
    }
  }, [team])

  console.log('gameBoard', gameBoard)
  function selectCard(card: Card) {
    setSelectedCard(card)
    const isOneEyedJack = card.face === 'J' && (card.suit === 'S' || card.suit === 'C')
    const isTwoEyedJack = card.face === 'J' && (card.suit === 'H' || card.suit === 'D')
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
  const leaveGame = () => {
    disconnect()
  }

  useEffect(() => {
    if (user && backOfDeck === undefined) {
      const cardBackKey = `${user.background_color}_back`
      if (Object.prototype.hasOwnProperty.call(cardImages, cardBackKey)) {
        setBackOfDeck(cardImages[cardBackKey as keyof typeof cardImages])
      } else {
        setBackOfDeck(cardImages.gray_back)
      }
    }
  }, [user, backOfDeck])

  return (
    <GameView data-testid="game-view">
      {!!gameOver && <AlertSquare>TEAM {gameOver} WON!</AlertSquare>}
      <LeaveButton
        data-testid="leaveGame"
        onClick={leaveGame}
        style={{ top: 0, left: 0, position: 'fixed', zIndex: 5 }}
      >
        Leave
      </LeaveButton>

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
      <Bottom>
        <DeckContainer>
          <DrawButton
            onClick={canDraw ? drawCard : () => {}}
            style={{ opacity: canDraw ? 1 : 0.8 }}
          >
            <img src={backOfDeck} />
          </DrawButton>
        </DeckContainer>
        <button disabled={!canThrow} onClick={handleThrowCard}>
          Throw card
        </button>
        <MarkerContainer>
          <p style={{ marginLeft: '40px' }}>Player:</p>
          {markerFrontTeamTurn && (
            <img style={{ marginLeft: '40px' }} src={markerFrontTeamTurn} alt="" />
          )}
        </MarkerContainer>
        <Hand>
          {playersTurn &&
            cardsOnHand &&
            cardsOnHand.map((card, i) => {
              return (
                <div
                  key={i}
                  onClick={username === playersTurn.username ? () => selectCard(card) : undefined}
                >
                  <div data-testid="cards" data-card-nr={card.nr} key={i}>
                    <Cards key={i} {...card} />
                  </div>
                </div>
              )
            })}
        </Hand>
        <MarkerContainer>
          <p style={{ marginLeft: '-20px' }}>Your team:</p>
          {yourTeamPile && (
            <img style={{ width: '100px', marginLeft: '-20px' }} src={yourTeamPile} alt="" />
          )}
        </MarkerContainer>

        <DeckContainer>
          <ThrowPile>
            {throwPile &&
              throwPile.map((card, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    transform: `rotate(${card.nr % 21}deg)`,
                  }}
                  data-testid="throw-pile"
                >
                  <Cards {...card} />
                </div>
              ))}
          </ThrowPile>
        </DeckContainer>
      </Bottom>
    </GameView>
  )
}

export default Sequence
