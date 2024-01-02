import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

Given(`a user is logged in, navigates to lobby and selects color`, () => {
  cy.clearLocalStorage()
  cy.visit('http://localhost:5173/')
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
