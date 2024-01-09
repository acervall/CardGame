import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

Given(`a user is logged in, navigates to the profile page`, () => {
  localStorage.clear()
  cy.visit('http://localhost:5173/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()
  cy.get('[data-testid="profile"]').click()
})

When(`a user changes background color to "red"`, () => {
  cy.get('[data-testid=""]')
})

Then(`the background color of their homepage should change to "red"`, () => {
  cy.get('[data-testid="home"]').click()
  cy.get('body').should(($body) => {
    expect($body.css('background-color')).to.equal('rgb(255, 0, 0)')
  })
})
