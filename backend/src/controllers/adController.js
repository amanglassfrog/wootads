import { validationResult } from 'express-validator'
import Ad from '../models/Ad.js'
import { scrapeProductUrl, analyzeProductText, extractColorPalette } from '../services/scraperService.js'
import { generateAdCreatives, predictPerformanceScore } from '../services/creativeGeneratorService.js'
import User from '../models/User.js'

/**
 * @desc    Generate ad creatives from URL or description
 * @route   POST /api/ads/generate
 * @access  Private
 */
export const generateAd = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      inputType, // 'url' or 'text'
      url,
      productName,
      productDescription,
      targetAudience,
      platforms, // ['instagram_feed', 'facebook_carousel', etc.]
      tone,
      customization,
    } = req.body

    // Check user credits
    const user = await User.findById(req.user.id)
    if (user.credits <= 0) {
      return res.status(403).json({
        message: 'Insufficient credits. Please upgrade your plan.',
      })
    }

    let productData = {
      productName,
      description: productDescription,
      targetAudience,
      tone: tone || 'professional',
    }

    // If URL provided, scrape it
    if (inputType === 'url' && url) {
      try {
        const scrapedData = await scrapeProductUrl(url)
        productData = {
          ...productData,
          productName: productName || scrapedData.data.title,
          description: productDescription || scrapedData.data.description,
          price: scrapedData.data.price,
          brand: scrapedData.data.brand,
          images: scrapedData.data.images,
          sourceUrl: url,
        }

        // Extract color palette from images
        if (scrapedData.data.images && scrapedData.data.images.length > 0) {
          productData.colors = await extractColorPalette(scrapedData.data.images)
        }
      } catch (scrapeError) {
        console.error('Scraping failed:', scrapeError.message)
        // Continue with manual input if scraping fails
      }
    }

    // Analyze product text for features and benefits
    const analysis = analyzeProductText(productData.description)
    productData.features = analysis.features
    productData.benefits = analysis.benefits
    if (!productData.tone) {
      productData.tone = analysis.tone
    }

    // Generate creatives for specified platforms
    const generationResult = await generateAdCreatives(
      productData,
      platforms || ['instagram_feed'],
      {
        tone: productData.tone,
        variations: 3,
        ...customization,
      }
    )

    // Save generated ads to database
    const savedAds = []
    for (const [platform, creativeData] of Object.entries(generationResult.creatives)) {
      const variations = creativeData.variations || [creativeData]
      
      for (const variation of variations) {
        console.log('Processing variation:', JSON.stringify(variation, null, 2))
        
        // Ensure required fields have fallbacks
        const headline = variation.headline || variation.title || 'Generated Ad'
        const bodyCopy = variation.bodyCopy || variation.description || 'Generated ad copy'
        const callToAction = variation.callToAction || variation.ctaText || variation.cta || 'Learn More'
        
        const performanceScore = await predictPerformanceScore(variation)
        
        const ad = await Ad.create({
          user: req.user.id,
          title: `${productName} - ${platform} - ${variation.name || variation.id || 'Variation'}`,
          productName: productData.productName,
          productDescription: productData.description,
          targetAudience,
          tone: productData.tone,
          platform,
          content: {
            headline,
            subheadline: variation.subheadline || '',
            bodyCopy,
            callToAction,
            hashtags: variation.hashtags || [],
          },
          design: {
            colorScheme: variation.colors ? Object.values(variation.colors) : productData.colors || ['#667eea', '#764ba2'],
            visualStyle: variation.layout?.style || variation.visualDescription || 'modern',
            layoutType: variation.layout?.composition || platform,
            imagePrompt: variation.visualDescription || variation.imagePrompt || 'Product image with modern design',
          },
          metadata: {
            targetEmotions: [variation.targetEmotion] || ['engagement'],
            tokensUsed: creativeData.tokensUsed || 0,
            performanceScore,
            variationId: variation.id || Math.random().toString(36).substr(2, 9),
          },
          status: 'generated',
        })

        savedAds.push(ad)
      }
    }

    // Deduct credit
    user.credits -= 1
    await user.save()

    res.status(201).json({
      success: true,
      message: `Generated ${savedAds.length} creatives across ${platforms.length} platform(s)`,
      ads: savedAds,
      creditsRemaining: user.credits,
      generationMetadata: generationResult.metadata,
    })
  } catch (error) {
    console.error('Generate Ad Error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate ad creatives',
    })
  }
}

/**
 * @desc    Get user's ads
 * @route   GET /api/ads
 * @access  Private
 */
export const getUserAds = async (req, res) => {
  try {
    const { status, platform, limit = 20, page = 1 } = req.query
    
    const query = { user: req.user.id }
    if (status) query.status = status
    if (platform) query.platform = platform

    const ads = await Ad.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Ad.countDocuments(query)

    res.json({
      success: true,
      ads,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * @desc    Get single ad
 * @route   GET /api/ads/:id
 * @access  Private
 */
export const getAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    // Check ownership
    if (ad.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    res.json({ success: true, ad })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * @desc    Update ad
 * @route   PUT /api/ads/:id
 * @access  Private
 */
export const updateAd = async (req, res) => {
  try {
    let ad = await Ad.findById(req.params.id)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    // Check ownership
    if (ad.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Update fields
    const allowedUpdates = ['title', 'content', 'design', 'status', 'isFavorite']
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        ad[field] = req.body[field]
      }
    })

    ad.status = 'edited'
    await ad.save()

    res.json({ success: true, ad })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * @desc    Delete ad
 * @route   DELETE /api/ads/:id
 * @access  Private
 */
export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    // Check ownership
    if (ad.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await ad.deleteOne()

    res.json({ success: true, message: 'Ad deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * @desc    Analyze product URL (preview before generating)
 * @route   POST /api/ads/analyze-url
 * @access  Private
 */
export const analyzeUrl = async (req, res) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ message: 'URL is required' })
    }

    const scrapedData = await scrapeProductUrl(url)
    const analysis = analyzeProductText(scrapedData.data.description)

    res.json({
      success: true,
      data: {
        ...scrapedData.data,
        analysis,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to analyze URL',
      error: error.message,
    })
  }
}

/**
 * @desc    Get generation statistics
 * @route   GET /api/ads/stats
 * @access  Private
 */
export const getAdStats = async (req, res) => {
  try {
    const totalAds = await Ad.countDocuments({ user: req.user.id })
    const byPlatform = await Ad.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$platform', count: { $sum: 1 } } },
    ])
    const byStatus = await Ad.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    const favorites = await Ad.countDocuments({ user: req.user.id, isFavorite: true })

    const avgScore = await Ad.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, avgScore: { $avg: '$metadata.performanceScore' } } },
    ])

    res.json({
      success: true,
      stats: {
        totalAds,
        byPlatform,
        byStatus,
        favorites,
        averagePerformanceScore: avgScore[0]?.avgScore || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

