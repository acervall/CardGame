import { BASE_URL } from '../../src/constants/baseUrl'

describe('Login test', () => {
  it('intercepts the login and user info API calls', () => {
    cy.clearLocalStorage()

    cy.fixture('userInfo.json').then((mockLoginResponse) => {
      cy.intercept('POST', `${BASE_URL}/auth/login`, { body: mockLoginResponse }).as('login')
      cy.intercept('GET', `${BASE_URL}/auth/info`, { body: mockLoginResponse.user }).as(
        'getUserInfo',
      )
    })

    cy.visit('http://localhost:5173/')
    cy.get('input[name="identifier"]').type('TestUser')
    cy.get('input[name="password"]').type('TestPassword')
    cy.get('button[type="submit"]').click()

    cy.wait('@login')
    cy.wait('@getUserInfo')
  })
})
