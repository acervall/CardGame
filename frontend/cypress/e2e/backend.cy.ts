import { BASE_URL } from '../../src/constants/baseUrl'

describe('backend integration', () => {
  let accessToken: string

  it('login user', () => {
    cy.request({
      method: 'POST',
      url: `${BASE_URL}/auth/login`,
      body: {
        identifier: 'poi',
        password: 'poi',
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      accessToken = response.body.accessToken
    })
  })

  it('get user info', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/auth/info`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      console.log(response.body)
    })
  })
})
