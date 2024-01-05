import styled from '@emotion/styled'
import { color } from '../assets/colors'
import { cardImages } from '../assets/Cards/CardImages'
import { Card as CardType, Suit } from '../constants/Deck'

interface CardProps extends CardType {
  nr: number
  face: string
  value: number
  suit: Suit
  url: string
  status: string | undefined
}

const Card = styled.button<CardProps>(
  (props) => `
  all: unset;
	width: 5.6vh;
	height: 8vh;
	color: ${props.suit === 'D' || props.suit === 'H' ? color.red : color.black};
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
  align-items: center;
	padding: 2px;
	border-radius: 5px;
	opacity: ${props.status === 'Selected' ? 0.5 : 1};
  background-image: url(${cardImages[props.url as keyof typeof cardImages]});
	background-size: cover;
  background-color: ${props.status === 'Available' ? color.lightGray : color.white};
  `,
)

const Circle = styled.div<CardProps>(
  (props) => `
	width: 3vh;
	height: 3vh;
  background-color: ${props.status};
  border-radius: 3vh;
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
      >
        {props.status === 'Available' && <div>Available</div>}
        <Circle status={props.status} />
      </Card>
    </>
  )
}
