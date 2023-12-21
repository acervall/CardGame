import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { Server } from 'http'
import { Server as IOServer } from 'socket.io'
import { setupGame } from './game/game'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

import authRouter from './routes/auth'

app.use(express.json())
app.use(cors())

app.use('/auth', authRouter)

function errorHandler(
  error: { source?: string; error: unknown },
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  console.error(`Error source: ${error.source}`)
  if (error.error instanceof Error) {
    response.status(500).json({
      success: false,
      error: error.error.message,
    })
  } else {
    response.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    })
  }
}

app.use(errorHandler)

const httpServer = new Server(app)
const io = new IOServer(httpServer, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
  },
})

const userCreatedRooms = new Set()

setupGame(io)

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
