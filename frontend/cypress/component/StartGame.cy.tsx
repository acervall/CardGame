import Game from '../../src/views/Game'
import { withProviders } from './testUtils'

describe('<Game />', () => {
  // beforeEach(() => {
  //   cy.intercept('GET', '/auth/info', { fixture: 'user.json' }).as('getUser')
  // })
  // const getPlayerCount = () => {
  //   return cy
  //     .get('[data-testid="amount-players"]')
  //     .invoke('text')
  //     .then((playerCountText) => parseInt(playerCountText))
  // }
  // const waitForPlayerCountChange = (initialCount: number) => {
  //   getPlayerCount().then((playerCount) => {
  //     if (playerCount === initialCount) {
  //       console.log('initialCount', initialCount)
  //       console.log('playerCount', playerCount)
  //       cy.wait(1000)
  //       waitForPlayerCountChange(initialCount)
  //     } else if (playerCount >= 2) {
  //       cy.get('[data-testid="start-game"]').click()
  //       cy.get('[data-testid="game-view"]').should('be.visible')
  //       cy.get('[data-testid="leaveGame"]').click()
  //     }
  //   })
  // }
  // it('renders', () => {
  // cy.mount(withProviders(<Game />))
  // cy.wait('@getUser')
  // cy.get('[data-testid="button-red"').click()
  // getPlayerCount().then((playerCount) => {
  //   waitForPlayerCountChange(playerCount)
  // })
  // })
})
