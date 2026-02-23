import { Router } from 'express'
import { asyncHandler, createError } from '../middleware/errorHandler'

const router = Router()

// Available avatars
const avatars = [
  {
    id: 'avatar-1',
    name: 'Alex',
    style: 'realistic',
    description: 'Realistic human avatar with natural movements',
    features: ['hand-tracking', 'facial-expressions', 'body-language'],
    supportedLanguages: ['asl', 'bsl', 'lsf'],
    thumbnail: '/avatars/alex-thumb.png',
  },
  {
    id: 'avatar-2',
    name: 'Sam',
    style: 'cartoon',
    description: 'Friendly cartoon avatar for educational content',
    features: ['hand-tracking', 'simplified-gestures'],
    supportedLanguages: ['asl'],
    thumbnail: '/avatars/sam-thumb.png',
  },
  {
    id: 'avatar-3',
    name: 'Maya',
    style: 'minimal',
    description: 'Minimalist avatar for low-bandwidth scenarios',
    features: ['hand-tracking'],
    supportedLanguages: ['asl', 'bsl'],
    thumbnail: '/avatars/maya-thumb.png',
  },
]

// Get all avatars
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json({
      avatars,
      count: avatars.length,
    })
  })
)

// Get specific avatar
router.get(
  '/:avatarId',
  asyncHandler(async (req, res) => {
    const { avatarId } = req.params
    const avatar = avatars.find(a => a.id === avatarId)

    if (!avatar) {
      throw createError('Avatar not found', 404)
    }

    res.json({ avatar })
  })
)

// Get avatar configuration
router.get(
  '/:avatarId/config',
  asyncHandler(async (req, res) => {
    const { avatarId } = req.params
    const avatar = avatars.find(a => a.id === avatarId)

    if (!avatar) {
      throw createError('Avatar not found', 404)
    }

    // Return avatar-specific configuration
    const config = {
      bones: {
        spine: ['spine', 'spine1', 'spine2', 'neck'],
        leftArm: ['leftShoulder', 'leftUpperArm', 'leftForeArm', 'leftHand'],
        rightArm: ['rightShoulder', 'rightUpperArm', 'rightForeArm', 'rightHand'],
        fingers: {
          left: ['thumb', 'index', 'middle', 'ring', 'pinky'],
          right: ['thumb', 'index', 'middle', 'ring', 'pinky'],
        },
      },
      animationSettings: {
        smoothing: 0.3,
        speedMultiplier: 1.0,
        handPoseConfidence: 0.7,
      },
      appearance: {
        skinTone: 'mid',
        clothing: 'casual',
        accessories: ['watch', 'glasses'],
      },
      ...avatar,
    }

    res.json({ config })
  })
)

// Update avatar settings
router.patch(
  '/:avatarId/settings',
  asyncHandler(async (req, res) => {
    const { avatarId } = req.params
    const settings = req.body

    // In a real implementation, save to database
    res.json({
      avatarId,
      settings,
      updated: true,
    })
  })
)

export { router as avatarRouter }
