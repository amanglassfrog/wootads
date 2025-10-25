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
 * Platform specifications for ad creatives
 */
const PLATFORM_SPECS = {
  instagram_feed: {
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: '1:1',
    maxTextLength: 2200,
    recommended: 'Product-focused visuals work best',
  },
  instagram_story: {
    dimensions: { width: 1080, height: 1920 },
    aspectRatio: '9:16',
    maxTextLength: 0, // Text overlay
    recommended: 'Interactive elements, swipe-up CTAs',
  },
  facebook_carousel: {
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: '1:1',
    cards: 5,
    maxTextLength: 125,
    recommended: 'Story-driven sequence',
  },
  google_display: {
    sizes: [
      { width: 300, height: 250, name: 'Medium Rectangle' },
      { width: 728, height: 90, name: 'Leaderboard' },
      { width: 160, height: 600, name: 'Wide Skyscraper' },
      { width: 320, height: 50, name: 'Mobile Banner' },
      { width: 300, height: 600, name: 'Half Page' },
    ],
    maxTextRatio: 0.2,
    recommended: 'Clear CTA, minimal text',
  },
  linkedin: {
    dimensions: { width: 1200, height: 627 },
    aspectRatio: '1.91:1',
    maxTextLength: 150,
    recommended: 'Professional tone, value proposition',
  },
}

/**
 * Generate complete ad creatives for multiple platforms
 * @param {Object} productData - Product information
 * @param {Array} platforms - Platforms to generate for
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Generated creatives
 */
export const generateAdCreatives = async (productData, platforms, options = {}) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const {
      tone = 'professional',
      variations = 3,
      focusBenefit = null,
    } = options

    const creatives = {}

    // Generate creatives for each platform
    for (const platform of platforms) {
      creatives[platform] = await generatePlatformCreatives(
        productData,
        platform,
        tone,
        variations
      )
    }

    return {
      success: true,
      creatives,
      metadata: {
        generatedAt: new Date(),
        platforms,
        variations,
      },
    }
  } catch (error) {
    console.error('Creative Generation Error:', error.message)
    throw new Error(`Failed to generate creatives: ${error.message}`)
  }
}

/**
 * Generate creatives for a specific platform
 */
async function generatePlatformCreatives(productData, platform, tone, variations) {
  const spec = PLATFORM_SPECS[platform]
  if (!spec) {
    throw new Error(`Unsupported platform: ${platform}`)
  }

    const prompt = buildPrompt(productData, platform, tone, spec)
  
  const client = getOpenAI()
  if (!client) {
    throw new Error('OpenAI API key not configured')
  }
  
  const completion = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert creative director specializing in ${platform} advertising. 
        Generate high-converting ad creatives that follow platform best practices. 
        Always respond with valid JSON.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  })

  const response = JSON.parse(completion.choices[0].message.content)
  
  // Add platform specifications to response
  return {
    ...response,
    platform,
    specifications: spec,
    tokensUsed: completion.usage.total_tokens,
  }
}

/**
 * Build prompt for creative generation
 */
function buildPrompt(productData, platform, tone, spec) {
  return `
Generate ${platform} ad creatives for this product:

**Product Information:**
- Name: ${productData.productName}
- Description: ${productData.description}
- Price: ${productData.price ? '$' + productData.price : 'Not specified'}
- Target Audience: ${productData.targetAudience}
- Key Features: ${productData.features?.join(', ') || 'Not specified'}
- Brand: ${productData.brand || 'Unknown'}

**Platform Requirements:**
- Dimensions: ${spec.dimensions?.width}x${spec.dimensions?.height || 'Various'}
- ${spec.recommended}

**Tone:** ${tone}

Generate 3 unique creative variations optimized for ${platform}. Each should include:

${platform === 'instagram_story' ? `
For Instagram Stories (5-slide sequence):
{
  "variations": [
    {
      "id": 1,
      "name": "Story Sequence 1",
      "slides": [
        {
          "slideNumber": 1,
          "type": "hook",
          "headline": "Attention-grabbing headline",
          "subtext": "Supporting text",
          "visualDescription": "Detailed description for image generation",
          "interactiveElements": ["poll", "question"],
          "backgroundColor": "#hex",
          "textColor": "#hex"
        },
        // ... 5 slides total
      ],
      "overallTheme": "Problem-solution narrative",
      "targetEmotion": "curiosity"
    }
  ]
}
` : platform === 'facebook_carousel' ? `
For Facebook Carousel (5 cards):
{
  "variations": [
    {
      "id": 1,
      "name": "Carousel Sequence 1",
      "cards": [
        {
          "cardNumber": 1,
          "headline": "Card headline (max 40 chars)",
          "bodyCopy": "Card description (max 125 chars)",
          "visualDescription": "What should be shown",
          "layout": "product_centered|split_screen|text_heavy",
          "backgroundColor": "#hex",
          "ctaText": "Learn More"
        }
      ],
      "sequenceStrategy": "Hero → Features → Benefits → Social Proof → Offer",
      "targetEmotion": "desire"
    }
  ]
}
` : platform === 'google_display' ? `
For Google Display Ads (multiple sizes):
{
  "variations": [
    {
      "id": 1,
      "name": "Direct Response",
      "sizes": [
        {
          "width": 300,
          "height": 250,
          "headline": "Short headline",
          "subheadline": "Benefit statement",
          "ctaText": "Shop Now",
          "layout": {
            "productImagePosition": "left|right|center",
            "textAlignment": "left|center",
            "ctaPlacement": "bottom|right"
          },
          "colors": {
            "background": "#hex",
            "text": "#hex",
            "cta": "#hex"
          }
        }
      ],
      "adType": "direct_response|brand_awareness|retargeting",
      "targetEmotion": "urgency"
    }
  ]
}
` : `
For ${platform}:
{
  "variations": [
    {
      "id": 1,
      "name": "Variation Name",
      "headline": "Compelling headline (max 40 chars)",
      "subheadline": "Supporting headline (max 60 chars)",
      "bodyCopy": "Main ad copy (2-3 sentences, engaging)",
      "callToAction": "Action text (max 20 chars)",
      "visualDescription": "Detailed description of the visual composition",
      "layout": {
        "style": "minimalist|lifestyle|text_heavy|product_focus",
        "composition": "How elements are arranged",
        "focal_point": "Where eye should be drawn"
      },
      "colors": {
        "primary": "#hex",
        "secondary": "#hex",
        "accent": "#hex",
        "background": "#hex"
      },
      "hashtags": ["#relevant", "#hashtags"],
      "targetEmotion": "excitement|trust|desire",
      "predictedScore": 85
    }
  ],
  "brandGuidelines": {
    "colorPalette": ["#hex1", "#hex2"],
    "fontSuggestions": ["Primary font", "Secondary font"],
    "voiceTone": "${tone}"
  }
}
`}

Make the copy compelling, benefit-focused, and optimized for conversions. Include specific visual descriptions for image generation.
`
}

/**
 * Generate variations of existing creative
 * @param {Object} originalCreative - Original creative to vary
 * @param {number} count - Number of variations
 * @returns {Promise<Array>} Variations
 */
export const generateCreativeVariations = async (originalCreative, count = 3) => {
  try {
    const prompt = `
Create ${count} variations of this ad creative:
Headline: ${originalCreative.headline}
Body: ${originalCreative.bodyCopy}
CTA: ${originalCreative.callToAction}

Generate variations with different approaches:
1. Emotional appeal
2. Logical/benefit-focused
3. Urgency-driven

Respond in JSON format with an array of variations.
`

    const client = getOpenAI()
    if (!client) {
      throw new Error('OpenAI API key not configured')
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an expert copywriter. Respond with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    const response = JSON.parse(completion.choices[0].message.content)
    return {
      success: true,
      variations: response.variations || [],
    }
  } catch (error) {
    throw new Error(`Failed to generate variations: ${error.message}`)
  }
}

/**
 * Predict performance score for a creative
 * @param {Object} creative - Creative to analyze
 * @returns {Promise<number>} Performance score (0-100)
 */
export const predictPerformanceScore = async (creative) => {
  // Simplified scoring algorithm
  let score = 50 // Base score
  
  // Headline quality
  if (creative.headline) {
    if (creative.headline.length <= 40) score += 10
    if (/[!?]/.test(creative.headline)) score += 5
    if (creative.headline.split(' ').length <= 8) score += 5
  }
  
  // Body copy quality
  if (creative.bodyCopy) {
    if (creative.bodyCopy.length >= 50 && creative.bodyCopy.length <= 150) score += 10
    if (creative.bodyCopy.includes('you')) score += 5 // Direct address
  }
  
  // CTA presence
  if (creative.callToAction) {
    score += 10
    const strongCTAs = ['buy', 'shop', 'get', 'start', 'try']
    if (strongCTAs.some(cta => creative.callToAction.toLowerCase().includes(cta))) {
      score += 5
    }
  }
  
  // Visual quality
  if (creative.visualDescription && creative.visualDescription.length > 50) {
    score += 10
  }
  
  return Math.min(100, score)
}

export { PLATFORM_SPECS }

