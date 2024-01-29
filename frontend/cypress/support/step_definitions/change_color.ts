import { BASE_URL } from '../../../src/constants/baseUrl'
import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

Given(`a user is logged in, navigates to the profile page`, () => {
  cy.clearLocalStorage()

  cy.fixture('user.json').then((mockLoginResponse) => {
    cy.intercept('POST', `${BASE_URL}/auth/login`, { body: mockLoginResponse.login }).as('login')
    cy.intercept('GET', `${BASE_URL}/auth/info`, { body: mockLoginResponse.login.user }).as(
      'getUserInfo',
    )
  })

  cy.visit('http://localhost:5173/')
  cy.get('input[name="identifier"]').type('poi')
  cy.get('input[name="password"]').type('poi')
  cy.get('button[type="submit"]').click()
  cy.wait('@login')
  cy.wait('@getUserInfo')
  cy.get('[data-testid="showNavbar"]').click()
  cy.get('[data-testid="profile"]').click()
})

When(`a user changes background color to "red"`, () => {
  cy.fixture('user.json').then((mockLoginResponse) => {
    cy.intercept('PUT', `${BASE_URL}/auth/editSettings`, { body: mockLoginResponse.update }).as(
      'update',
    )
    cy.intercept('GET', `${BASE_URL}/auth/info`, { body: mockLoginResponse.updatedUser }).as(
      'updateUserInfo',
    )
  })
  cy.get('[data-testid="change-color-red"]').click()
  cy.wait('@update')
  cy.wait('@updateUserInfo')
})

Then(`the background color of their homepage should change to "red"`, () => {
  cy.get('[data-testid="showNavbar"]').click()
  cy.get('[data-testid="home"]').click()
  cy.get('[data-testid="background"]').should(($div) => {
    expect($div.css('background-color')).to.equal('rgb(255, 0, 0)')
  })
})
