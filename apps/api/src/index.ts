import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { logger } from './utils/logger'
import { videoRouter } from './routes/videos'
import { avatarRouter } from './routes/avatars'
import { healthRouter } from './routes/health'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
})
app.use(limiter)

// Body parsing
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }))

// Routes
app.use('/api/videos', videoRouter)
app.use('/api/avatars', avatarRouter)
app.use('/api/health', healthRouter)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Visual Translator API',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      videos: '/api/videos',
      avatars: '/api/avatars',
    },
  })
})

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

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

export { io }
