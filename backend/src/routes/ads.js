import express from 'express'
import { body } from 'express-validator'
import {
  generateAd,
  getUserAds,
  getAd,
  updateAd,
  deleteAd,
  analyzeUrl,
  getAdStats,
} from '../controllers/adController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Validation rules
const generateAdValidation = [
  body('inputType').isIn(['url', 'text']).withMessage('Input type must be url or text'),
  body('productName').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('productDescription').optional().trim().notEmpty(),
  body('targetAudience').trim().notEmpty().withMessage('Target audience is required'),
  body('platforms').isArray({ min: 1 }).withMessage('At least one platform is required'),
  body('tone').optional().isIn(['professional', 'casual', 'playful', 'formal', 'friendly', 'bold']),
]

const analyzeUrlValidation = [
  body('url').isURL().withMessage('Valid URL is required'),
]

// Routes
router.post('/generate', protect, generateAdValidation, generateAd)
router.get('/', protect, getUserAds)
router.get('/stats', protect, getAdStats)
router.post('/analyze-url', protect, analyzeUrlValidation, analyzeUrl)
router.get('/:id', protect, getAd)
router.put('/:id', protect, updateAd)
router.delete('/:id', protect, deleteAd)

export default router


