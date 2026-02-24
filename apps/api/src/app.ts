import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { logger } from './utils/logger'
import { videoRouter } from './routes/videos'
import { avatarRouter } from './routes/avatars'
import { healthRouter } from './routes/health'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

function createApp(): Express {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
    })
  )

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  })
  app.use(limiter)

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))
  app.use(morgan('combined', { stream: { write: (msg: string) => logger.info(msg.trim()) } }))

  app.set('io', undefined)

  app.use('/api/videos', videoRouter)
  app.use('/api/avatars', avatarRouter)
  app.use('/api/health', healthRouter)

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

  app.use(errorHandler)
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  return app
}

export { createApp }
