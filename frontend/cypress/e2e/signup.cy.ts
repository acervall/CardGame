describe('template spec', () => {
  it('passes', () => {
    const newuser = 'teshej'

    cy.visit('http://localhost:5173/')
    cy.get('button').contains('Create account').click()
    cy.get('input[name="username"]').type(newuser)
    cy.get('input[name="email"]').type(`${newuser}@mail.mail`)
    cy.get('input[name="password"]').type(newuser)
    cy.get('input[name="first_name"]').type(newuser)
    cy.get('input[name="last_name"]').type(newuser)
    cy.get('button[type="submit"]').click()

    cy.get('span').contains(newuser)
    cy.get('button').contains('Profile').click()
    cy.get('button').contains('Delete').click()
  })
})
