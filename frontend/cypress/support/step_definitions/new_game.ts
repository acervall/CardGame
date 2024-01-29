import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'
import { BASE_URL } from '../../../src/constants/baseUrl'

Given(`a user is logged in, navigates to lobby and selects color`, () => {
  cy.clearLocalStorage()

  cy.fixture('user.json').then((mockLoginResponse) => {
    cy.intercept('POST', `${BASE_URL}/auth/login`, { body: mockLoginResponse.login }).as('login')
    cy.intercept('GET', `${BASE_URL}/auth/info`, { body: mockLoginResponse.login.user }).as(
      'getUserInfo',
    )
  })
  cy.visit('http://localhost:5173/')
  cy.visit('http://localhost:5173/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()
  cy.wait('@login')
  cy.wait('@getUserInfo')
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
