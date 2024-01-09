enum Suit {
  Spades = 'S',
  Clubs = 'C',
  Hearts = 'H',
  Diamonds = 'D',
}

export type CardStatus = 'Available' | 'Selected' | 'CanBeRemoved' | 'Unset' | 'Joker' | undefined
export type Team = 'red' | 'green' | 'blue' | 'joker' | undefined

export interface Card {
  nr: number
  face: string
  value: number
  suit: Suit
  url: string
  status: CardStatus
  team: Team
}

export interface Deck {
  cards: Card[]
}

const faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

const deck: Card[] = []
let cardNumber = 0

for (const suit of Object.values(Suit)) {
  for (let i = 0; i < faces.length; i++) {
    deck.push({
      nr: cardNumber,
      face: faces[i],
      value: values[i],
      suit: suit,
      url: `${faces[i]}${suit}`,
      status: 'Unset',
      team: undefined,
    })
    cardNumber++
  }
}

const deckWithJokers: Card[] = [...deck]

for (const suit of Object.values(Suit)) {
  deckWithJokers.push({
    nr: cardNumber,
    face: 'Joker',
    value: 0,
    suit: suit,
    url: 'gray_back',
    status: 'Joker',
    team: 'joker',
  })
  cardNumber++
}

const doubleDeck = [...deck, ...deck]

function shuffleDeck(array: Card[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

shuffleDeck(doubleDeck)

const cardOrderOnGameBoard = [
  [54, 0, 1, 2, 3, 4, 5, 6, 7, 53],
  [17, 16, 15, 14, 13, 38, 37, 36, 34, 8],
  [18, 12, 39, 40, 41, 42, 43, 44, 33, 10],
  [19, 11, 17, 16, 15, 14, 13, 45, 32, 11],
  [20, 10, 18, 30, 29, 28, 38, 46, 31, 12],
  [21, 8, 19, 31, 26, 27, 37, 47, 30, 39],
  [23, 7, 20, 32, 33, 34, 36, 49, 29, 40],
  [24, 6, 21, 23, 24, 25, 51, 50, 28, 41],
  [25, 5, 4, 3, 2, 1, 0, 26, 27, 42],
  [52, 51, 50, 49, 47, 46, 45, 44, 43, 55],
]

const cardOnGameBoard: Card[][] = cardOrderOnGameBoard.map((row) =>
  row.map((nr) => {
    return deckWithJokers.find((deckCard) => deckCard.nr === nr) || deckWithJokers[53]
  }),
)

export { doubleDeck, shuffleDeck, deck, deckWithJokers, cardOnGameBoard }
