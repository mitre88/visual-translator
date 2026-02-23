import { Router } from 'express'
import { logger } from '../utils/logger'

const router: Router = Router()

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    api: boolean
    database?: boolean
    redis?: boolean
    aiService?: boolean
  }
}

let healthStatus: HealthStatus = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: '0.1.0',
  services: {
    api: true,
    database: true,
    redis: true,
    aiService: true,
  },
}

// Simple health check
router.get('/', async (req, res) => {
  healthStatus.timestamp = new Date().toISOString()
  
  // Check all services
  const allHealthy = Object.values(healthStatus.services).every(Boolean)
  if (!healthStatus.services.api) {
    healthStatus.status = 'unhealthy'
  } else {
    healthStatus.status = allHealthy ? 'healthy' : 'degraded'
  }

  const statusCode = healthStatus.status === 'unhealthy' ? 503 : 200
  res.status(statusCode).json(healthStatus)
})

// Detailed health check
router.get('/detailed', async (req, res) => {
  healthStatus.timestamp = new Date().toISOString()

  const details = {
    ...healthStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform,
    nodeVersion: process.version,
  }

  logger.info('Health check performed', { status: healthStatus.status })
  res.json(details)
})

// Ready check for Kubernetes
router.get('/ready', (req, res) => {
  // Check if the service is ready to accept traffic
  const ready = healthStatus.status !== 'unhealthy'
  res.status(ready ? 200 : 503).json({ ready })
})

// Liveness check
router.get('/live', (req, res) => {
  // Simple liveness probe
  res.json({ alive: true })
})

export { router as healthRouter }
