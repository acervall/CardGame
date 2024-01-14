import { Card } from '../../constants/Deck'
import { Cards } from './Card'
import { useEffect, useState } from 'react'
import { useGame } from '../../hooks/useGame'
import { cardImages } from '../../assets/Cards/CardImages'
import { frontMarker, pile } from '../../assets/Markers/markers'
import useUser from '../../hooks/useUser'
import {
  AlertSquare,
  Bottom,
  DeckContainer,
  DrawButton,
  GamePlan,
  GameView,
  Hand,
  LeaveButton,
  MarkerContainer,
  ThrowPile,
} from '../../assets/StyledComponents/GameStyles'

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

  const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined)
  const [canThrow, setCanThrow] = useState<boolean>(false)
  const [backOfDeck, setBackOfDeck] = useState<string>('gray_back')

  const [yourTeamPile, setYourTeamPile] = useState<string | undefined>(undefined)
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
    if (selectedCard !== undefined) {
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
            data-testid="draw"
            onClick={canDraw ? drawCard : () => {}}
            style={{ opacity: canDraw ? 1 : 0.8 }}
          >
            <img src={backOfDeck} />
          </DrawButton>
        </DeckContainer>

        <MarkerContainer>
          <p style={{ marginLeft: '20px' }}>Player:</p>
          {markerFrontTeamTurn && (
            <img style={{ marginLeft: '20px' }} src={markerFrontTeamTurn} alt="" />
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
          <button disabled={!canThrow} onClick={handleThrowCard}>
            Throw card
          </button>
        </DeckContainer>
      </Bottom>
    </GameView>
  )
}

export default Sequence
