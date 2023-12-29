import styled from '@emotion/styled'
import { color } from '../assets/colors'
import { doubleDeck, Card } from '../constants/Deck'
import { Cards } from './Card'
import { useState, useEffect } from 'react'
import { initializeSocket, getGameStateUpdate, cardsOnHand, GamesInterface } from '../api/socket'

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
  gap: 10px;
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

function Sequence() {
  const initialHand = doubleDeck.slice(0, 7) as Card[]
  const [hand, setHand] = useState<Card[]>(initialHand)
  const [deck, setDeck] = useState<Card[]>(doubleDeck.slice(7) as Card[])
  const [throwPile, setThrowPile] = useState<Card[]>([])
  const [currentGameBoard, setCurrentGameBoard] = useState<Card[][] | undefined>(undefined)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [canDraw, setCanDraw] = useState<boolean>(false)
  const [gameInformation, setGameInformation] = useState<GamesInterface | undefined>(undefined)

  console.log(gameInformation)

  useEffect(() => {
    initializeSocket()
    console.log('useEffect')
    getGameStateUpdate().then(({ message, gameState }) => {
      console.log(message)
      setGameInformation(gameState)

      console.log('gameBoard', gameState.gameBoard)
      setCurrentGameBoard(gameState.gameBoard)
    })
    cardsOnHand().then((cards) => {
      console.log('cards', cards)
      setHand(cards)
    })
  }, [])

  function drawCard() {
    if (deck.length > 0) {
      const newCard = deck[0]
      setHand((oldHand) => [...oldHand, newCard])
      setDeck((oldDeck) => oldDeck.slice(1))
      setCanDraw(false)
    }
  }

  function selectCard(card: Card) {
    setSelectedCard(card)
    console.log(card)
    if (currentGameBoard) {
      const newGameBoard = currentGameBoard.map((row) =>
        row.map((gameCard: Card) => {
          if (
            (gameCard === card || (gameCard.value === card.value && gameCard.suit === card.suit)) &&
            gameCard.status !== 'Selected'
          ) {
            return { ...gameCard, status: 'Available' }
          } else if (gameCard.status === 'Available') {
            return { ...gameCard, status: undefined }
          } else {
            return gameCard
          }
        }),
      )
      setCurrentGameBoard(newGameBoard)
    }
  }

  function placeMarker(card: Card) {
    if (selectedCard && card.value === selectedCard.value && card.suit === selectedCard.suit) {
      setThrowPile((oldThrowPile) => [...oldThrowPile, selectedCard])
      setHand((oldHand) => oldHand.filter((handCard) => handCard !== selectedCard))
      setCanDraw(true)
      if (currentGameBoard) {
        const newGameBoard = currentGameBoard.map((row) =>
          row.map((gameCard: Card) => {
            if (gameCard === card) {
              return { ...gameCard, status: 'Selected' }
            } else if (
              gameCard.value === selectedCard.value &&
              gameCard.suit === selectedCard.suit
            ) {
              return { ...gameCard, status: undefined }
            } else {
              return gameCard
            }
          }),
        )
        setCurrentGameBoard(newGameBoard)
        if (checkForSequence(newGameBoard)) {
          console.log('Player has a sequence of 5!')
        } else {
          console.log('Player does not have a sequence of 5!')
        }
      }
    }
  }

  function checkForSequence(board: Card[][]): boolean {
    const size = board.length

    for (let i = 0; i < size; i++) {
      let rowSeq = 0
      let colSeq = 0
      for (let j = 0; j < size; j++) {
        rowSeq = board[i][j]?.status === 'Selected' ? rowSeq + 1 : 0
        colSeq = board[j][i]?.status === 'Selected' ? colSeq + 1 : 0
        if (rowSeq === 5 || colSeq === 5) return true
      }
    }

    for (let d = 0; d < size; d++) {
      let diag1Seq = 0
      let diag2Seq = 0
      for (let i = 0, j = d; j < size; i++, j++) {
        diag1Seq = board[i][j]?.status === 'Selected' ? diag1Seq + 1 : 0
        diag2Seq = board[j][i]?.status === 'Selected' ? diag2Seq + 1 : 0
        if (diag1Seq === 5 || diag2Seq === 5) return true
      }
    }

    return false
  }

  return (
    <GameView>
      <LeftSide>
        <DeckContainer>
          <button disabled={!canDraw} onClick={drawCard}>
            Draw
          </button>
          <div>
            {throwPile.length > 0 && (
              <div>
                <Cards {...throwPile[throwPile.length - 1]} />
              </div>
            )}
          </div>
        </DeckContainer>
        <Hand>
          {hand.map((card, i) => {
            return (
              <div onClick={() => selectCard(card)}>
                <div key={i}>
                  <Cards key={i} {...card} />
                </div>
              </div>
            )
          })}
        </Hand>
      </LeftSide>
      {currentGameBoard && (
        <GamePlan>
          {currentGameBoard.map((row, i) => {
            return row.map((card: Card, j: number) => {
              return (
                <div key={`${i}-${j}`} onClick={() => placeMarker(card)}>
                  <Cards {...card} />
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

// Diagonal fungerar ej
// När man väljer en som redan finns markerad så försvinner den andra
