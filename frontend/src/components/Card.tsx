import styled from '@emotion/styled'
import { color } from '../assets/colors'
import { cardImages } from '../assets/Cards/CardImages'
import { Card as CardType, Suit, CardStatus, Team } from '../constants/Deck'

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
	opacity: ${
    props.gameBoard && props.status !== 'Available' && props.status !== 'CanBeRemoved' ? 0.8 : 1
  };
  background-image: url(${cardImages[props.url as keyof typeof cardImages]});
	background-size: cover;
  background-color: ${props.status === 'Available' ? color.lightGray : color.white};
  border: ${
    props.status === 'Available' || props.status === 'CanBeRemoved'
      ? '2px solid red'
      : '2px solid' + color.green
  };

  `,
)

const Circle = styled.div<CardProps>(
  (props) => `
	width: 3vh;
	height: 3vh;
  background-color: ${props.team};
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
        team={props.team}
        gameBoard={props.gameBoard}
      >
        {/* {props.status === 'Available' && <div>Available</div>} */}
        <Circle {...props} />
      </Card>
    </>
  )
}
