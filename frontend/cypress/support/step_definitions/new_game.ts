import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

Given(`User1 has logged in and navigated to the game lobby`, () => {
  cy.clearLocalStorage()

  cy.visit('http://localhost:5173/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()

  cy.get('#game').click()
})

When(`User1 selects color red`, () => {
  // cy.get('#button-red').click()
})

Then(`Amount of player online is visible for other users`, () => {
  // connection to socket.io
  // emit amount of players
})

Given(`User2 has logged in and navigated to the game lobby where User1 is color red`, () => {
  // login functions
  // see other players online
})
When(`User2 select color green`, () => {
  // color green.click
})
Then(`Enough players are online and the game can start`, () => {
  // can see all users online
  // start game button visible
})

Given(`The correct number of players are at the table and everyone is in a team`, () => {
  // it's possible to start the game
  //start game button visible
})
When(`A player starts the game`, () => {
  // one of the players starts the game
  //start game button.click()
})
Then(`The game starts`, () => {
  // the game start
})
