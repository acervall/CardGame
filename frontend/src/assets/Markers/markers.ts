import redPile from './pile-red.png'
import redMarkerFront from './Sequence-marker-red-f.png'
import redMarkerBack from './Sequence-marker-red-b.png'
import greenPile from './pile-green.png'
import greenMarkerFront from './Sequence-marker-green-f.png'
import greenMarkerBack from './Sequence-marker-green-b.png'
import bluePile from './pile-blue.png'
import blueMarkerFront from './Sequence-marker-blue-f.png'
import blueMarkerBack from './Sequence-marker-blue-b.png'
import { Color } from '../../constants/Deck'

const colorMap = {
  pile: {
    red: redPile,
    green: greenPile,
    blue: bluePile,
  },
  front: {
    red: redMarkerFront,
    green: greenMarkerFront,
    blue: blueMarkerFront,
  },
  back: {
    red: redMarkerBack,
    green: greenMarkerBack,
    blue: blueMarkerBack,
  },
}

export const pile = (color: Color) => {
  return colorMap.pile[color]
}

export const frontMarker = (color: Color) => {
  return colorMap.front[color]
}

export const backMarker = (color: Color) => {
  return colorMap.back[color]
}
