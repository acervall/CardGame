import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

Given(`a user is logged in, navigates to lobby and selects color`, () => {
  cy.clearLocalStorage()
  cy.visit('http://localhost:3001/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()
  cy.get('[data-testid="game"]').click()
  cy.get('[data-testid="button-red"]').click()
})

When(`if the amount of players is more than two the game can start`, () => {
  cy.get('[data-testid="amount-players"]')
    .invoke('text')
    .then((playerCount) => {
      console.log('playerCount test', playerCount)
      if (parseInt(playerCount) >= 2) {
        cy.get('[data-testid="start-game"]').should('be.visible')
      }
    })
})

Then(`the "Start Game" button should be visible, user starts game`, () => {
  cy.get('[data-testid="amount-players"]')
    .invoke('text')
    .then((playerCount) => {
      if (parseInt(playerCount) >= 2) {
        cy.get('[data-testid="start-game"]').click()
        cy.get('[data-testid="game-view"]').should('be.visible')
      }
    })
})

When(`a player plays a card`, () => {
  cy.wait(5000)
  cy.document().then((doc) => {
    const gameView = doc.querySelector('[data-testid="game-view"]')
    if (gameView) {
      cy.get('[data-testid="game-board"]').should('exist')
      cy.get('[data-testid="cards"]').should('have.length', 7)
      cy.get('[data-testid="cards"]').eq(0).click()
    } else {
      console.log('game not started')
      return
    }
  })
})

Then(`the correct card should be selected and end up in the discard pile`, () => {
  cy.document().then((doc) => {
    const gameView = doc.querySelector('[data-testid="game-view"]')
    if (gameView) {
      cy.get('[data-testid="game-board"] [data-testid="game-board-card"]').each(($cardDiv) => {
        if ($cardDiv.attr('data-card-status') === 'Available') {
          $cardDiv.click()
          cy.get('[data-testid="throw-pile"]').should(
            'have.attr',
            'data-card-nr',
            $cardDiv.attr('data-card-nr'),
          )
        }
      })
    } else {
      console.log('game not started')
      return
    }
  })
})
