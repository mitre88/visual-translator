import { Request, Response, Router } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import { mkdirSync, existsSync } from 'fs'

import { asyncHandler, createError } from '../middleware/errorHandler'
import { logger } from '../utils/logger'
import { TranslationJob, TranslationStatus } from '../services/translation'

const router = Router()

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOAD_DIR || './uploads'
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const jobDir = join(uploadsDir, uuidv4())
    mkdirSync(jobDir, { recursive: true })
    cb(null, jobDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `video-${uniqueSuffix}${getExtension(file.mimetype)}`)
  },
})

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/avi',
    'video/x-matroska',
  ]
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
})

function getExtension(mimetype: string): string {
  const map: Record<string, string> = {
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov',
    'video/avi': '.avi',
    'video/x-matroska': '.mkv',
  }
  return map[mimetype] || '.mp4'
}

// Active translation jobs
const translationJobs = new Map<string, TranslationJob>()

// Upload video
router.post(
  '/upload',
  upload.single('video'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw createError('No video file provided', 400)
    }

    const videoId = req.file.filename.replace(/\.[^/.]+$/, '')
    
    logger.info(`Video uploaded: ${videoId}, path: ${req.file.path}`)

    res.status(201).json({
      videoId,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path,
      uploadedAt: new Date().toISOString(),
    })
  })
)

// Start translation
router.post(
  '/:videoId/translate',
  asyncHandler(async (req: Request<{ videoId: string }>, res: Response) => {
    const { videoId } = req.params
    const { sourceLanguage = 'en', targetSignLanguage = 'asl' } = req.body

    // Check if job already exists
    if (translationJobs.has(videoId)) {
      const existingJob = translationJobs.get(videoId)!
      return res.json({
        videoId,
        status: existingJob.status,
        message: 'Translation already in progress',
      })
    }

    // Create new translation job
    const job: TranslationJob = {
      id: videoId,
      status: TranslationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      sourceLanguage,
      targetSignLanguage,
      progress: 0,
    }

    translationJobs.set(videoId, job)

    // Start translation process (async)
    processTranslation(videoId, job, req.app.get('io'))

    logger.info(`Translation started: ${videoId}`)

    res.status(202).json({
      videoId,
      status: job.status,
      message: 'Translation started',
    })
  })
)

// Get translation status
router.get(
  '/:videoId/status',
  asyncHandler(async (req: Request<{ videoId: string }>, res: Response) => {
    const { videoId } = req.params
    const job = translationJobs.get(videoId)

    if (!job) {
      throw createError('Translation job not found', 404)
    }

    res.json({
      videoId,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      ...(job.error && { error: job.error }),
    })
  })
)

// Get translation result
router.get(
  '/:videoId/result',
  asyncHandler(async (req: Request<{ videoId: string }>, res: Response) => {
    const { videoId } = req.params
    const job = translationJobs.get(videoId)

    if (!job) {
      throw createError('Translation job not found', 404)
    }

    if (job.status !== TranslationStatus.COMPLETED) {
      throw createError(`Translation not complete. Current status: ${job.status}`, 400)
    }

    res.json({
      videoId,
      status: job.status,
      result: job.result,
      gloss: job.gloss,
      confidence: job.confidence || 0.85,
    })
  })
)

// Process translation (simulated)
async function processTranslation(videoId: string, job: TranslationJob, io: any) {
  try {
    // Call AI service for transcription
    job.status = TranslationStatus.PROCESSING
    job.progress = 20
    updateJob(videoId, job, io)

    // Simulate transcription processing
    await delay(2000)
    job.progress = 40
    updateJob(videoId, job, io)

    // Translate to ASL gloss
    job.status = TranslationStatus.TRANSLATING
    job.progress = 60
    job.gloss = generateGloss()
    updateJob(videoId, job, io)

    // Generate animation data
    await delay(2000)
    job.progress = 90
    updateJob(videoId, job, io)

    // Complete
    job.status = TranslationStatus.COMPLETED
    job.progress = 100
    job.result = {
      gloss: job.gloss,
      keyframes: generateKeyframes(),
      duration: 120, // seconds
      wordCount: 150,
    }
    job.confidence = 0.87
    updateJob(videoId, job, io)

    logger.info(`Translation completed: ${videoId}`)
  } catch (error) {
    job.status = TranslationStatus.FAILED
    job.error = error instanceof Error ? error.message : 'Unknown error'
    updateJob(videoId, job, io)
    logger.error(`Translation failed: ${videoId}`, error)
  }
}

function updateJob(videoId: string, job: TranslationJob, io: any) {
  job.updatedAt = new Date()
  translationJobs.set(videoId, job)
  
  // Emit to connected clients
  io?.to(`translation:${videoId}`)?.emit('translation-update', {
    videoId,
    status: job.status,
    progress: job.progress,
  })
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function generateGloss(): string[] {
  // Simulated ASL gloss output
  return [
    'HELLO',
    'MY',
    'NAME',
    'IX-1',
    'ME',
    'GO-TO',
    'STORE',
    'BUY',
    'WHAT',
    'BOOK',
    'MILK',
    'BREAD',
    'THANK-YOU',
    'GOODBYE',
  ]
}

function generateKeyframes(): any[] {
  // Simulated animation keyframes
  return Array.from({ length: 100 }, (_, i) => ({
    time: i * 0.1,
    pose: {
      leftArm: {
        shoulder: { x: 0, y: 0, z: Math.sin(i * 0.1) * 0.5 },
        elbow: { x: 0, y: 0, z: Math.cos(i * 0.1) * 0.3 },
        wrist: { x: 0, y: 0, z: Math.sin(i * 0.15) * 0.2 },
      },
      rightArm: {
        shoulder: { x: 0, y: 0, z: Math.cos(i * 0.1) * 0.5 },
        elbow: { x: 0, y: 0, z: Math.sin(i * 0.1) * 0.3 },
        wrist: { x: 0, y: 0, z: Math.cos(i * 0.15) * 0.2 },
      },
    },
  }))
}

export { router as videoRouter }
