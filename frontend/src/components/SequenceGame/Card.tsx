import styled from '@emotion/styled'
import { color } from '../../assets/colors'
import { cardImages } from '../../assets/Cards/CardImages'
import { Card as CardType, Suit, CardStatus, Team } from '../../constants/Deck'
import { backMarker } from '../../assets/Markers/markers'

interface CardProps extends CardType {
  nr: number
  face: string
  value: number
  suit: Suit
  url: string
  status: CardStatus
  team: Team
  gameBoard?: boolean
}

const Card = styled.div<CardProps>(
  (props) => `
  width: ${props.gameBoard ? '100%' : 'fit-content'};
  height: ${props.gameBoard ? '100%' : 'fit-content'};
  max-width: ${props.gameBoard && '8vw'};
	max-height:${props.gameBoard && '7vh'};
	color: ${props.suit === 'D' || props.suit === 'H' ? color.red : color.black};
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
  align-items: center;
	border-radius: 5px;
  opacity: 1;
  background-image: url(${props.gameBoard && cardImages[props.url as keyof typeof cardImages]});
	background-size: cover;
  background-color: ${props.status === 'Available' ? color.lightGray : color.white};
  border: ${
    props.status === 'Available' || props.status === 'CanBeRemoved'
      ? '2px solid red'
      : '2px solid transparent'
  };
  `,
)

const CardImage = styled.img`
  width: fit-content;
  max-width: 5vw;
  object-fit: cover;
`

const Circle = styled.div<CardProps>(
  (props) => `
	width: 6vh;
	height: 6vh;
  background-image: url(${backMarker(props.team as keyof typeof backMarker)});
  background-size: contain;
  position: absolute;
  `,
)

export function Cards(props: CardProps) {
  return (
    <>
      <Card
        suit={props.suit}
        status={props.status}
        url={props.url}
        nr={props.nr}
        face={props.face}
        value={props.value}
        team={props.team}
        gameBoard={props.gameBoard}
      >
        {!props.gameBoard && (
          <CardImage src={cardImages[props.url as keyof typeof cardImages]} alt="" />
        )}
        <Circle {...props} />
      </Card>
    </>
  )
}
