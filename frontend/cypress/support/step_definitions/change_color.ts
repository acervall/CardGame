import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

Given(`a user is logged in, navigates to the profile page`, () => {
  localStorage.clear()
  cy.visit('http://localhost:5173/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()
  cy.get('[data-testid="showNavbar"]').click()
  cy.get('[data-testid="profile"]').click()
})

When(`a user changes background color to "red"`, () => {
  cy.get('[data-testid="change-color-red"]').click()
})

Then(`the background color of their homepage should change to "red"`, () => {
  // cy.get('[data-testid="showNavbar"]').click()
  // cy.get('[data-testid="home"]').click()
  // cy.get('[data-testid="background"]').should(($div) => {
  //   expect($div.css('background-color')).to.equal('rgb(255, 0, 0)')
  // })
})
