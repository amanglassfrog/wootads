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
 * Generate ad copy and design suggestions using GPT-4
 * @param {Object} params - Generation parameters
 * @param {string} params.productName - Name of the product
 * @param {string} params.productDescription - Description of the product
 * @param {string} params.targetAudience - Target audience
 * @param {string} params.tone - Tone of the ad (professional, casual, playful, etc.)
 * @param {string} params.platform - Platform (facebook, instagram, google, linkedin)
 * @returns {Promise<Object>} Generated design data
 */
export const generateAdDesign = async ({
  productName,
  productDescription,
  targetAudience,
  tone = 'professional',
  platform = 'facebook',
}) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `
You are an expert ad copywriter and design consultant. Create a compelling advertisement for the following product:

Product Name: ${productName}
Product Description: ${productDescription}
Target Audience: ${targetAudience}
Tone: ${tone}
Platform: ${platform}

Generate a complete ad design with the following structure (respond in JSON format):

{
  "headline": "A catchy, attention-grabbing headline (max 40 characters)",
  "subheadline": "A supporting subheadline (max 60 characters)",
  "bodyCopy": "The main ad copy (2-3 sentences, max 125 characters)",
  "callToAction": "A strong CTA button text (max 20 characters)",
  "designSuggestions": {
    "colorScheme": ["primary color", "secondary color", "accent color"],
    "visualStyle": "Description of visual style (modern, minimalist, bold, etc.)",
    "layoutType": "Layout recommendation (hero banner, split screen, carousel, etc.)",
    "imagePrompt": "A detailed prompt for DALL-E image generation"
  },
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "targetEmotions": ["emotion1", "emotion2"]
}

Make it engaging, conversion-focused, and optimized for ${platform}.
`

    const client = getOpenAI()
    if (!client) {
      throw new Error('OpenAI API key not configured')
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ad copywriter and creative director. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0].message.content
    const designData = JSON.parse(response)

    return {
      success: true,
      data: designData,
      tokensUsed: completion.usage.total_tokens,
    }
  } catch (error) {
    console.error('AI Service Error:', error.message)
    throw new Error(`Failed to generate ad design: ${error.message}`)
  }
}

/**
 * Generate variations of an existing ad
 * @param {Object} originalAd - Original ad data
 * @param {number} count - Number of variations to generate
 * @returns {Promise<Array>} Array of variations
 */
export const generateAdVariations = async (originalAd, count = 3) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `
Create ${count} creative variations of this ad:
Headline: ${originalAd.headline}
Body: ${originalAd.bodyCopy}
CTA: ${originalAd.callToAction}

Generate ${count} different versions with varied approaches (emotional, logical, humorous, etc.).
Respond in JSON format as an array of variations.
`

    const client = getOpenAI()
    if (!client) {
      throw new Error('OpenAI API key not configured')
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ad copywriter. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    })

    const response = JSON.parse(completion.choices[0].message.content)
    return {
      success: true,
      variations: response.variations || [],
      tokensUsed: completion.usage.total_tokens,
    }
  } catch (error) {
    console.error('AI Service Error:', error.message)
    throw new Error(`Failed to generate variations: ${error.message}`)
  }
}

/**
 * Improve existing ad copy
 * @param {Object} adData - Ad data to improve
 * @returns {Promise<Object>} Improved ad data
 */
export const improveAdCopy = async (adData) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `
Improve this ad copy to make it more compelling and conversion-focused:

Headline: ${adData.headline}
Body: ${adData.bodyCopy}
CTA: ${adData.callToAction}

Provide an improved version with better hooks, clearer benefits, and stronger CTAs.
Respond in JSON format with improved versions.
`

    const client = getOpenAI()
    if (!client) {
      throw new Error('OpenAI API key not configured')
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ad copywriter focused on conversions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const response = JSON.parse(completion.choices[0].message.content)
    return {
      success: true,
      improved: response,
      tokensUsed: completion.usage.total_tokens,
    }
  } catch (error) {
    console.error('AI Service Error:', error.message)
    throw new Error(`Failed to improve ad copy: ${error.message}`)
  }
}

