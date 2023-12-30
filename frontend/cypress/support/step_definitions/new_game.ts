import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

Given(`User1 has logged in and navigated to the game lobby`, () => {
  cy.clearLocalStorage()

  cy.visit('http://localhost:5173/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()

  cy.get('#game').click()
  cy.get('#amount-players').should('be.hidden')
})

When(`User1 selects color red`, () => {
  cy.get('#button-red').click()
})

Then(`Amount of player online is visible for other users`, () => {
  cy.get('#amount-players').contains('1')
  cy.get('#start-game').should('be.disabled')
})

Given(`User2 has logged in and navigated to the game lobby where User1 is color red`, () => {
  cy.visit('http://localhost:5173/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()

  cy.get('#game').click()
  cy.get('#amount-players').contains('1')
})

When(`User2 select color green`, () => {
  cy.get('#button-green').click()
})
Then(`Enough players are online and the game can start`, () => {
  cy.get('#amount-players').contains('2')
  cy.get('#start-game').should('not.be.disabled')
})

Given(`The correct number of players are at the table and everyone is in a team`, () => {
  cy.get('#start-game').should('not.be.disabled')
})

When(`A player starts the game`, () => {
  cy.get('#start-game').click()
})

Then(`The game starts`, () => {
  cy.get('#game-view').should('be.visible')
})
