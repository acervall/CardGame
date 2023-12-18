enum Suit {
  Spades = '♠',
  Clubs = '♣',
  Hearts = '♥',
  Diamonds = '♦',
}

interface Card {
  face: string
  value: number
  suit: Suit
}

const faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

const deck: Card[] = []

for (const suit of Object.values(Suit)) {
  for (let i = 0; i < faces.length; i++) {
    deck.push({
      face: faces[i],
      value: values[i],
      suit: suit,
    })
  }
}

const doubleDeck = [...deck, ...deck]

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

shuffleArray(doubleDeck)

export { doubleDeck }
