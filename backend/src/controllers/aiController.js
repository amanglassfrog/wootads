import { validationResult } from 'express-validator'
import { generateAdDesign, generateAdVariations, improveAdCopy } from '../services/aiService.js'
import Ad from '../models/Ad.js'
import User from '../models/User.js'

// @desc    Generate ad design using AI
// @route   POST /api/ai/generate
// @access  Private
export const generateAd = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { productName, productDescription, targetAudience, tone, platform } = req.body

    // Check if user has credits
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.credits <= 0) {
      return res.status(403).json({ 
        message: 'Insufficient credits. Please upgrade your plan.',
        creditsRemaining: 0
      })
    }

    // Generate ad using AI
    const result = await generateAdDesign({
      productName,
      productDescription,
      targetAudience,
      tone: tone || 'professional',
      platform: platform || 'facebook',
    })

    // Create ad in database
    const ad = await Ad.create({
      user: req.user.id,
      title: `${productName} - ${platform} Ad`,
      productName,
      productDescription,
      targetAudience,
      tone: tone || 'professional',
      platform: platform || 'facebook',
      content: {
        headline: result.data.headline,
        subheadline: result.data.subheadline,
        bodyCopy: result.data.bodyCopy,
        callToAction: result.data.callToAction,
        hashtags: result.data.hashtags,
      },
      design: result.data.designSuggestions,
      metadata: {
        targetEmotions: result.data.targetEmotions,
        tokensUsed: result.tokensUsed,
      },
      status: 'generated',
    })

    // Deduct credit
    user.credits -= 1
    await user.save()

    res.status(201).json({
      success: true,
      ad: {
        id: ad._id,
        title: ad.title,
        content: ad.content,
        design: ad.design,
        metadata: ad.metadata,
        createdAt: ad.createdAt,
      },
      creditsRemaining: user.credits,
      message: 'Ad generated successfully!',
    })
  } catch (error) {
    console.error('Generate Ad Error:', error.message)
    res.status(500).json({ 
      message: error.message || 'Failed to generate ad',
      success: false
    })
  }
}

// @desc    Get all ads for user
// @route   GET /api/ai/ads
// @access  Private
export const getUserAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const ads = await Ad.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')

    const total = await Ad.countDocuments({ user: req.user.id })

    res.json({
      success: true,
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get Ads Error:', error.message)
    res.status(500).json({ message: 'Failed to fetch ads' })
  }
}

// @desc    Get single ad by ID
// @route   GET /api/ai/ads/:id
// @access  Private
export const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    res.json({
      success: true,
      ad,
    })
  } catch (error) {
    console.error('Get Ad Error:', error.message)
    res.status(500).json({ message: 'Failed to fetch ad' })
  }
}

// @desc    Update ad
// @route   PUT /api/ai/ads/:id
// @access  Private
export const updateAd = async (req, res) => {
  try {
    const ad = await Ad.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    // Update allowed fields
    const { title, content, design, status, isFavorite } = req.body

    if (title) ad.title = title
    if (content) ad.content = { ...ad.content, ...content }
    if (design) ad.design = { ...ad.design, ...design }
    if (status) ad.status = status
    if (typeof isFavorite === 'boolean') ad.isFavorite = isFavorite

    await ad.save()

    res.json({
      success: true,
      ad,
      message: 'Ad updated successfully',
    })
  } catch (error) {
    console.error('Update Ad Error:', error.message)
    res.status(500).json({ message: 'Failed to update ad' })
  }
}

// @desc    Delete ad
// @route   DELETE /api/ai/ads/:id
// @access  Private
export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    await ad.deleteOne()

    res.json({
      success: true,
      message: 'Ad deleted successfully',
    })
  } catch (error) {
    console.error('Delete Ad Error:', error.message)
    res.status(500).json({ message: 'Failed to delete ad' })
  }
}

// @desc    Generate ad variations
// @route   POST /api/ai/ads/:id/variations
// @access  Private
export const generateVariations = async (req, res) => {
  try {
    const ad = await Ad.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    const count = req.body.count || 3
    const result = await generateAdVariations(ad.content, count)

    res.json({
      success: true,
      variations: result.variations,
      tokensUsed: result.tokensUsed,
    })
  } catch (error) {
    console.error('Generate Variations Error:', error.message)
    res.status(500).json({ message: 'Failed to generate variations' })
  }
}


