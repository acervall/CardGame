import { ReactNode } from 'react'
import { withProviders } from './testUtils'
import Sequence from '../../src/components/SequenceGame/Sequence'
import { GameProvider } from '../../src/context/GameContext'
import { io } from 'socket.io-client'
import { BASE_URL } from '../../src/constants/baseUrl'

const withGameProviders = (component: ReactNode) => {
  return withProviders(<GameProvider>{component}</GameProvider>)
}

describe('test game functions', () => {
  beforeEach(() => {
    cy.intercept('GET', '/auth/info', { fixture: 'user.json' }).as('getUser')
  })
  it('renders', () => {
    const socket = io(BASE_URL)
    cy.mount(withGameProviders(<Sequence />))
    cy.wait('@getUser')
    cy.wrap(
      new Promise((resolve) => {
        socket.emit('initGame', { color: 'red', username: 'poi' })
        socket.emit('initGame', { color: 'green', username: 'testUser' })
        socket.emit('startGame')
        socket.on('gameState', (gameState) => {
          console.log('gameState', gameState)
          resolve(gameState)
        })
      }),
    ).then(() => {
      cy.get('[data-testid="cards"]').should('have.length', 7)
      cy.get('[data-testid="cards"]').first().click()
      cy.get('[data-card-status="Available"]').first().click()
      cy.get('[data-testid="draw"]').click()
    })
  })
})
