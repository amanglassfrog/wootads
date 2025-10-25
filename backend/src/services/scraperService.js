import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Scrape product information from a URL
 * @param {string} url - Product URL to scrape
 * @returns {Promise<Object>} Scraped product data
 */
export const scrapeProductUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    })

    const $ = cheerio.load(response.data)
    
    // Extract metadata using various methods
    const productData = {
      // Open Graph metadata
      title: $('meta[property="og:title"]').attr('content') || 
             $('title').text() || 
             $('h1').first().text().trim(),
      
      description: $('meta[property="og:description"]').attr('content') || 
                   $('meta[name="description"]').attr('content') || 
                   $('p').first().text().trim(),
      
      price: extractPrice($),
      
      images: extractImages($, url),
      
      brand: $('meta[property="og:site_name"]').attr('content') || 
             extractBrandFromUrl(url),
      
      category: $('meta[property="product:category"]').attr('content') || 
                extractCategoryFromContent($),
      
      colors: [], // Will be extracted from images
      
      url: url,
    }

    return {
      success: true,
      data: productData,
    }
  } catch (error) {
    console.error('Scraper Error:', error.message)
    throw new Error(`Failed to scrape URL: ${error.message}`)
  }
}

/**
 * Extract price from page
 */
function extractPrice($) {
  const priceSelectors = [
    '[itemprop="price"]',
    '.price',
    '.product-price',
    '[class*="price"]',
    'meta[property="product:price:amount"]',
  ]

  for (const selector of priceSelectors) {
    const priceEl = $(selector).first()
    if (priceEl.length) {
      const priceText = priceEl.attr('content') || priceEl.text()
      const match = priceText.match(/[\d,.]+/)
      if (match) {
        return parseFloat(match[0].replace(',', ''))
      }
    }
  }
  
  return null
}

/**
 * Extract product images
 */
function extractImages($, baseUrl) {
  const images = []
  const imageSelectors = [
    'meta[property="og:image"]',
    '[itemprop="image"]',
    '.product-image img',
    '.main-image img',
    'img[class*="product"]',
  ]

  imageSelectors.forEach(selector => {
    $(selector).each((i, el) => {
      const src = $(el).attr('content') || $(el).attr('src')
      if (src && !images.includes(src)) {
        images.push(makeAbsoluteUrl(src, baseUrl))
      }
    })
  })

  return images.slice(0, 5) // Return top 5 images
}

/**
 * Extract brand name from URL
 */
function extractBrandFromUrl(url) {
  try {
    const domain = new URL(url).hostname
    const parts = domain.split('.')
    return parts[parts.length - 2] // e.g., "amazon" from "www.amazon.com"
  } catch {
    return null
  }
}

/**
 * Extract category from page content
 */
function extractCategoryFromContent($) {
  const breadcrumbs = $('.breadcrumb, [class*="breadcrumb"]').text()
  const categories = ['food', 'beverage', 'tech', 'fashion', 'health', 'beauty', 'home']
  
  for (const cat of categories) {
    if (breadcrumbs.toLowerCase().includes(cat)) {
      return cat
    }
  }
  
  return 'general'
}

/**
 * Make URL absolute
 */
function makeAbsoluteUrl(url, baseUrl) {
  if (url.startsWith('http')) return url
  if (url.startsWith('//')) return 'https:' + url
  try {
    return new URL(url, baseUrl).href
  } catch {
    return url
  }
}

/**
 * Extract color palette from images
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {Promise<string[]>} Array of hex colors
 */
export const extractColorPalette = async (imageUrls) => {
  // This would use a color extraction library or API
  // For now, returning common brand colors
  return [
    '#2C5F2D', // Primary
    '#97BC62', // Secondary
    '#FFFFFF', // White
    '#000000', // Black
  ]
}

/**
 * Analyze product text to extract key features
 * @param {string} description - Product description
 * @returns {Object} Extracted features
 */
export const analyzeProductText = (description) => {
  const features = []
  const benefits = []
  
  // Simple keyword extraction
  const keywords = {
    features: ['organic', 'natural', 'premium', 'handmade', 'certified', 'sustainable'],
    benefits: ['energy', 'focus', 'health', 'wellness', 'improve', 'boost', 'enhance'],
  }
  
  const lowerDesc = description.toLowerCase()
  
  keywords.features.forEach(keyword => {
    if (lowerDesc.includes(keyword)) {
      features.push(keyword)
    }
  })
  
  keywords.benefits.forEach(keyword => {
    if (lowerDesc.includes(keyword)) {
      benefits.push(keyword)
    }
  })
  
  return {
    features,
    benefits,
    tone: detectTone(description),
  }
}

/**
 * Detect tone from text
 */
function detectTone(text) {
  const formalWords = ['premium', 'professional', 'exclusive', 'luxury']
  const casualWords = ['awesome', 'cool', 'fun', 'easy']
  
  const lowerText = text.toLowerCase()
  let formalCount = 0
  let casualCount = 0
  
  formalWords.forEach(word => {
    if (lowerText.includes(word)) formalCount++
  })
  
  casualWords.forEach(word => {
    if (lowerText.includes(word)) casualCount++
  })
  
  if (formalCount > casualCount) return 'professional'
  if (casualCount > formalCount) return 'casual'
  return 'friendly'
}


