import styled, { StyledProps } from '@emotion/styled'
import { color } from '../assets/colors'

const Card = styled.button(
  (props: StyledProps<string>) => `
  all: unset;
	width: 5.6vh;
	height: 8vh;
	background-color: ${props.status === 'Available' ? color.lightGray : color.white};
	color: ${props.suit === '♦' || props.suit === '♥' ? color.red : color.black};
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 2px;
	border-radius: 5px;
	opacity: ${props.status === 'Selected' ? 0.5 : 1};
  `,
)

const Top = styled.div`
  display: flex;
  justify-content: flex-start;
`
const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 11px;
  justify-content: center;
`

const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
`

export function Cards(props: CardProps) {
  return (
    <Card suit={props.suit} status={props.status}>
      {props.face === 'Joker' ? (
        <Content>{props.face}</Content>
      ) : (
        <>
          <Top>
            {props.face}
            {props.suit}
          </Top>
          <Content>
            {props.value < 11 &&
              [...Array(props.value)].map((_, i) => <span key={i}>{props.suit}</span>)}
          </Content>
          <Bottom>
            {props.suit}
            {props.face}
          </Bottom>
        </>
      )}
    </Card>
  )
}
