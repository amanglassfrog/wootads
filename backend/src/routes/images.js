import express from 'express'
import { protect as authenticate } from '../middleware/auth.js'
import { generateAdImage, generateImageVariations, enhanceImageLayout, generateLayoutPrompt } from '../services/imageGenerationService.js'

const router = express.Router()

/**
 * Generate image for specific ad
 * POST /api/images/generate
 */
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { prompt, platform, style, layout, dimensions, brand, product } = req.body

    if (!prompt) {
      return res.status(400).json({
        message: 'Image prompt is required'
      })
    }

    const result = await generateAdImage({
      prompt,
      platform: platform || 'instagram_feed',
      style: style || 'modern',
      layout: layout || {},
      dimensions: dimensions || { width: 1080, height: 1080 },
      brand: brand || {},
      product: product || {}
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate image'
    })
  }
})

/**
 * Generate multiple image variations
 * POST /api/images/variations
 */
router.post('/variations', authenticate, async (req, res) => {
  try {
    const { prompt, platform, styles, layout, brand, product } = req.body

    if (!prompt) {
      return res.status(400).json({
        message: 'Image prompt is required'
      })
    }

    const result = await generateImageVariations({
      prompt,
      platform: platform || 'instagram_feed',
      styles: styles || ['modern', 'lifestyle', 'bold'],
      layout: layout || {},
      brand: brand || {},
      product: product || {}
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Image variations error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate image variations'
    })
  }
})

/**
 * Generate layout-specific prompt
 * POST /api/images/layout-prompt
 */
router.post('/layout-prompt', authenticate, async (req, res) => {
  try {
    const { productName, description, platform, layoutType, style } = req.body

    if (!productName || !description) {
      return res.status(400).json({
        message: 'Product name and description are required'
      })
    }

    const prompt = generateLayoutPrompt({
      productName,
      description,
      platform: platform || 'instagram_feed',
      layoutType: layoutType || 'product_centered',
      style: style || 'modern'
    })

    res.json({
      success: true,
      prompt
    })
  } catch (error) {
    console.error('Layout prompt error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate layout prompt'
    })
  }
})

/**
 * Enhance existing image with layout
 * POST /api/images/enhance
 */
router.post('/enhance', authenticate, async (req, res) => {
  try {
    const { imageUrl, layout, platform, adjustments } = req.body

    if (!imageUrl) {
      return res.status(400).json({
        message: 'Image URL is required'
      })
    }

    const result = await enhanceImageLayout({
      imageUrl,
      layout: layout || {},
      platform: platform || 'instagram_feed',
      adjustments: adjustments || {}
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Image enhancement error:', error)
    res.status(500).json({
      message: error.message || 'Failed to enhance image'
    })
  }
})

/**
 * Proxy image download to avoid CORS issues
 * GET /api/images/proxy?url=<image_url>
 */
router.get('/proxy', authenticate, async (req, res) => {
  try {
    const { url } = req.query
    
    if (!url) {
      return res.status(400).json({
        message: 'URL parameter is required'
      })
    }

    console.log('Proxying image download for URL:', url)

    // Fetch the image from the external URL
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/png'
    
    // Set appropriate headers
    res.set({
      'Content-Type': contentType,
      'Content-Length': imageBuffer.byteLength,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    })
    
    // Send the image data
    res.send(Buffer.from(imageBuffer))
  } catch (error) {
    console.error('Image Proxy Error:', error)
    res.status(500).json({
      message: error.message || 'Failed to proxy image'
    })
  }
})

export default router
