import { createServer } from 'http'
import { type Express } from 'express'
import { Server } from 'socket.io'

import { logger } from './utils/logger'
import { createApp } from './app'

const app: Express = createApp()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 5000

// WebSocket handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  socket.on('join-translation', (videoId: string) => {
    socket.join(`translation:${videoId}`)
    logger.info(`Client ${socket.id} joined translation room: ${videoId}`)
  })

  socket.on('leave-translation', (videoId: string) => {
    socket.leave(`translation:${videoId}`)
    logger.info(`Client ${socket.id} left translation room: ${videoId}`)
  })

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Make io accessible to routes
app.set('io', io)

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

export { app, io }
