import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

Given(`User1 has logged in and navigated to the game lobby`, () => {
  cy.clearLocalStorage()

  cy.visit('http://localhost:5173/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()

  cy.get('#game').click()
})

When(`User1 creates a new game table`, () => {
  // cy.get('#create-table').click()
})

Then(
  `A new table is created, User1 is the only player in it, and it's open for other players to join`,
  () => {
    // connection to socket.io
  },
)

Given(
  `User2 has logged in and navigated to the game lobby where there is an open table created by User1`,
  () => {
    // login functions
    // see open table
  },
)
When(`User2 joins the open table`, () => {
  // clicks join table
})
Then(`Both User1 and User2 are at the game table`, () => {
  // can see all users online
})

Given(`Both users are at the created table and can see the available teams to join`, () => {
  // sees all users online can select team
  // start game - not possible
})
When(`The users select their teams`, () => {
  // select team to join
})
Then(`It's possible to start the game once everyone has selected a team`, () => {
  // start game is possible
})

Given(`The correct number of players are at the table and everyone is in a team`, () => {
  // all players are part of a team
  // it's possible to start the game
})
When(`A player starts the game`, () => {
  // one of the players starts the game
})
Then(`The game starts`, () => {
  // the game start
})
