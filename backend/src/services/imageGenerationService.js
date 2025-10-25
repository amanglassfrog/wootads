import OpenAI from 'openai'

// Lazy initialization - only create when needed
let openai = null

const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

/**
 * Generate high-quality professional ad image using DALL-E 3
 * @param {Object} params - Image generation parameters
 * @param {string} params.prompt - Base image prompt
 * @param {string} params.platform - Platform (instagram_feed, facebook_carousel, etc.)
 * @param {string} params.style - Visual style (minimalist, lifestyle, etc.)
 * @param {Object} params.layout - Layout specifications
 * @param {Object} params.brand - Brand specifications
 * @param {Object} params.product - Product information
 * @returns {Promise<Object>} Generated image data
 */
export const generateAdImage = async ({
  prompt,
  platform,
  style = 'modern',
  layout = {},
  brand = {},
  product = {},
  dimensions = { width: 1080, height: 1080 }
}) => {
  try {
    const client = getOpenAI()
    if (!client) {
      throw new Error('OpenAI API key not configured')
    }

    // Build professional-grade prompt
    const professionalPrompt = buildProfessionalPrompt({
      prompt,
      platform,
      style,
      layout,
      brand,
      product,
      dimensions
    })

    console.log('Professional prompt generated:', professionalPrompt)

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: professionalPrompt,
      n: 1,
      size: getImageSize(platform, dimensions),
      quality: 'hd',
      style: 'vivid' // Use vivid for more creative, high-quality results
    })

    return {
      success: true,
      imageUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
      platform,
      dimensions,
      style,
      layout,
      brand
    }
  } catch (error) {
    console.error('Image Generation Error:', error.message)
    throw new Error(`Failed to generate image: ${error.message}`)
  }
}

/**
 * Generate multiple high-quality image variations
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - Base prompt
 * @param {string} params.platform - Platform
 * @param {Array} params.styles - Array of styles to generate
 * @param {Object} params.layout - Layout specifications
 * @param {Object} params.brand - Brand specifications
 * @param {Object} params.product - Product information
 * @returns {Promise<Array>} Array of generated images
 */
export const generateImageVariations = async ({
  prompt,
  platform,
  styles = ['modern', 'lifestyle', 'bold'],
  layout = {},
  brand = {},
  product = {}
}) => {
  try {
    const variations = []
    
    // Enhanced style combinations for better variety
    const enhancedStyles = [
      { id: 'modern', name: 'Modern Professional', desc: 'Contemporary, clean, sophisticated' },
      { id: 'lifestyle', name: 'Lifestyle Authentic', desc: 'Real people, natural settings, aspirational' },
      { id: 'bold', name: 'Bold Impact', desc: 'High contrast, vibrant, attention-grabbing' },
      { id: 'elegant', name: 'Elegant Premium', desc: 'Luxury feel, refined, high-end' },
      { id: 'playful', name: 'Playful Creative', desc: 'Fun, energetic, creative composition' }
    ]

    const selectedStyles = enhancedStyles.filter(s => styles.includes(s.id))
    
    for (const styleInfo of selectedStyles) {
      const image = await generateAdImage({
        prompt,
        platform,
        style: styleInfo.id,
        layout,
        brand,
        product
      })
      
      variations.push({
        ...image,
        style: styleInfo.id,
        styleName: styleInfo.name,
        styleDescription: styleInfo.desc,
        id: Math.random().toString(36).substr(2, 9)
      })
    }

    return {
      success: true,
      variations,
      totalGenerated: variations.length,
      platform,
      styles: selectedStyles.map(s => s.name)
    }
  } catch (error) {
    console.error('Image Variations Error:', error.message)
    throw new Error(`Failed to generate image variations: ${error.message}`)
  }
}

/**
 * Get appropriate image size for platform
 * @param {string} platform - Platform name
 * @param {Object} dimensions - Custom dimensions
 * @returns {string} DALL-E size parameter
 */
function getImageSize(platform, dimensions) {
  const sizeMap = {
    instagram_feed: '1024x1024',
    instagram_story: '1024x1792',
    facebook_carousel: '1024x1024',
    linkedin: '1024x1024',
    google_display: dimensions.width >= 1024 ? '1024x1024' : '1024x1024'
  }
  
  return sizeMap[platform] || '1024x1024'
}

/**
 * Enhance existing image with layout adjustments
 * @param {Object} params - Enhancement parameters
 * @param {string} params.imageUrl - Original image URL
 * @param {Object} params.layout - Layout specifications
 * @param {string} params.platform - Target platform
 * @returns {Promise<Object>} Enhanced image data
 */
export const enhanceImageLayout = async ({
  imageUrl,
  layout,
  platform,
  adjustments = {}
}) => {
  try {
    // This would typically involve image processing libraries
    // For now, we'll return the original image with layout metadata
    return {
      success: true,
      originalImageUrl: imageUrl,
      enhancedImageUrl: imageUrl, // In a real implementation, this would be processed
      layout,
      platform,
      adjustments,
      message: 'Image layout enhancement would be implemented with image processing libraries'
    }
  } catch (error) {
    console.error('Image Enhancement Error:', error.message)
    throw new Error(`Failed to enhance image: ${error.message}`)
  }
}

/**
 * Build professional-grade image prompt for high-quality ad creatives
 * @param {Object} params - Prompt building parameters
 * @returns {string} Professional image prompt
 */
function buildProfessionalPrompt({
  prompt,
  platform,
  style,
  layout,
  brand,
  product,
  dimensions
}) {
  // Professional photography and design terms
  const qualityTerms = [
    'professional photography',
    'high-end commercial photography',
    'studio quality lighting',
    'crisp, sharp details',
    'perfect composition',
    'award-winning design',
    'magazine-quality',
    'editorial photography style'
  ]

  // Platform-specific requirements
  const platformSpecs = {
    instagram_feed: {
      format: 'square 1080x1080 Instagram feed post',
      requirements: 'mobile-optimized, high contrast, eye-catching, social media ready',
      style: 'trendy, modern, Instagram-worthy aesthetic'
    },
    instagram_story: {
      format: 'vertical 1080x1920 Instagram story',
      requirements: 'full-screen impact, vertical composition, story-optimized',
      style: 'dynamic, engaging, story-appropriate'
    },
    facebook_carousel: {
      format: 'square 1080x1080 Facebook carousel card',
      requirements: 'professional, business-appropriate, clean design',
      style: 'corporate, trustworthy, conversion-focused'
    },
    linkedin: {
      format: 'professional 1200x627 LinkedIn ad',
      requirements: 'business-focused, professional, B2B appropriate',
      style: 'corporate, sophisticated, professional'
    },
    google_display: {
      format: `${dimensions.width}x${dimensions.height} Google Display banner`,
      requirements: 'web-optimized, clear text, high visibility',
      style: 'clean, readable, conversion-optimized'
    }
  }

  // Style-specific enhancements
  const styleEnhancements = {
    modern: 'contemporary design, clean lines, minimalist aesthetic, modern typography, sleek composition',
    lifestyle: 'authentic lifestyle photography, natural lighting, real people, aspirational mood, candid moments',
    bold: 'high contrast, vibrant colors, strong visual impact, attention-grabbing, dynamic composition',
    elegant: 'sophisticated design, refined aesthetics, premium feel, luxury branding, polished finish',
    playful: 'fun, energetic, colorful, engaging, creative composition, youthful energy'
  }

  // Layout-specific compositions
  const layoutCompositions = {
    product_centered: 'product as hero element, centered composition, clean background, professional product photography',
    lifestyle: 'lifestyle context, people using product, natural environment, aspirational setting',
    text_heavy: 'typography-focused design, text hierarchy, readable fonts, high contrast text',
    split_screen: 'balanced composition, side-by-side elements, clear visual separation, structured layout',
    minimalist: 'clean design, lots of white space, simple composition, focus on essentials'
  }

  const platformSpec = platformSpecs[platform] || platformSpecs.instagram_feed
  const styleEnhancement = styleEnhancements[style] || styleEnhancements.modern
  const layoutComposition = layoutCompositions[layout.type] || layoutCompositions.product_centered

  // Build the professional prompt
  const professionalPrompt = `
Create a ${platformSpec.format} for a professional advertising campaign.

${prompt}

REQUIREMENTS:
- ${platformSpec.requirements}
- ${styleEnhancement}
- ${layoutComposition}
- ${qualityTerms.join(', ')}

TECHNICAL SPECIFICATIONS:
- Platform: ${platform}
- Style: ${style}
- Layout: ${layout.type || 'product_centered'}
- Dimensions: ${dimensions.width}x${dimensions.height}

DESIGN PRINCIPLES:
- Professional commercial photography quality
- Perfect lighting and composition
- High visual impact and engagement
- Brand-appropriate aesthetic
- Conversion-optimized design
- Mobile-friendly (if applicable)

AVOID:
- Generic stock photo look
- Low quality or blurry images
- Unprofessional composition
- Poor lighting
- Cluttered design
- Outdated aesthetics

Create a stunning, professional ad creative that would be worthy of a top-tier advertising agency.
`.trim()

  return professionalPrompt
}

/**
 * Generate layout-specific image prompts
 * @param {Object} params - Layout parameters
 * @param {string} params.productName - Product name
 * @param {string} params.description - Product description
 * @param {string} params.platform - Platform
 * @param {string} params.layoutType - Layout type
 * @returns {string} Generated prompt
 */
export const generateLayoutPrompt = ({
  productName,
  description,
  platform,
  layoutType = 'product_centered',
  style = 'modern'
}) => {
  const layoutPrompts = {
    product_centered: `Product-focused layout with ${productName} as the main subject, clean background, professional lighting`,
    lifestyle: `Lifestyle scene featuring ${productName} in use, natural setting, aspirational mood`,
    text_heavy: `Text-focused design with ${productName} as supporting element, bold typography, high contrast`,
    split_screen: `Split-screen layout with ${productName} on one side and benefits/features on the other`,
    minimalist: `Minimalist design with ${productName}, lots of white space, clean lines, simple composition`
  }

  const basePrompt = layoutPrompts[layoutType] || layoutPrompts.product_centered
  
  return `${basePrompt}. ${description}. Style: ${style}. Platform: ${platform}. High quality, professional photography style.`
}
