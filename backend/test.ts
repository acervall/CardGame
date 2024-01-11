import express from 'express'
import type { NextFunction, Request, Response } from 'express'

declare global {
  namespace Express {
    interface Request {
      user: string
    }
  }
}

const app = express()

async function authenticate(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
): Promise<void> {
  // Är användaren inloggad?
  if (false) {
    response.status(401).send()
    return
  }

  // Vem är användaren?
  request.user = 'user'

  next()
}

app.get('/messages', authenticate, async (request: express.Request, response: express.Response) => {
  // Hämta meddelanden med request.user...
})

app.post('/messages', authenticate, async (request, response) => {
  // Skicka meddelande med request.user och request.body...
})

app.listen(8080, () => {
  console.log('Redo på http://localhost:8080/')
})
