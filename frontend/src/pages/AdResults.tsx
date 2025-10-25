import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Share2, Heart, Edit3, Eye, Wand2, Loader, Image as ImageIcon, Layout, Palette } from 'lucide-react'
import api from '../api/axios'
import './AdResults.css'

interface Ad {
  _id: string
  title: string
  productName: string
  platform: string
  content: {
    headline: string
    subheadline?: string
    bodyCopy: string
    callToAction: string
    hashtags?: string[]
  }
  design: {
    colorScheme?: string[]
    visualStyle?: string
    layoutType?: string
    imagePrompt?: string
  }
  metadata: {
    targetEmotions?: string[]
    tokensUsed?: number
    performanceScore?: number
  }
  createdAt: string
}

interface GenerationMetadata {
  totalTokensUsed: number
  generationTime: number
  platformsGenerated: string[]
}

const LAYOUT_TYPES = [
  { id: 'product_centered', name: 'Product Centered', icon: '🎯', desc: 'Focus on the product' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌟', desc: 'Product in use context' },
  { id: 'text_heavy', name: 'Text Heavy', icon: '📝', desc: 'Emphasize copy and messaging' },
  { id: 'split_screen', name: 'Split Screen', icon: '📱', desc: 'Product and benefits side by side' },
  { id: 'minimalist', name: 'Minimalist', icon: '✨', desc: 'Clean, simple design' }
]

const VISUAL_STYLES = [
  { id: 'modern', name: 'Modern Professional', desc: 'Contemporary, clean, sophisticated design with perfect composition' },
  { id: 'lifestyle', name: 'Lifestyle Authentic', desc: 'Real people, natural settings, aspirational mood, authentic photography' },
  { id: 'bold', name: 'Bold Impact', desc: 'High contrast, vibrant colors, strong visual impact, attention-grabbing' },
  { id: 'elegant', name: 'Elegant Premium', desc: 'Luxury feel, refined aesthetics, premium branding, polished finish' },
  { id: 'playful', name: 'Playful Creative', desc: 'Fun, energetic, colorful, engaging, creative composition' }
]

const AdResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const ads: Ad[] = location.state?.ads || []
  const metadata: GenerationMetadata = location.state?.metadata || {}
  
  console.log('AdResults - ads:', ads)
  console.log('AdResults - metadata:', metadata)
  
  // Image generation state
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [selectedLayout, setSelectedLayout] = useState('product_centered')
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [generatingImage, setGeneratingImage] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<{[key: string]: any}>({})
  const [showImageModal, setShowImageModal] = useState(false)

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      'instagram_feed': '📸',
      'instagram_story': '📱',
      'facebook_carousel': '🎠',
      'google_display': '🎯',
      'linkedin': '💼',
      'twitter': '🐦',
      'tiktok': '🎵'
    }
    return icons[platform] || '📱'
  }

  const getPlatformName = (platform: string) => {
    const names: { [key: string]: string } = {
      'instagram_feed': 'Instagram Feed',
      'instagram_story': 'Instagram Stories',
      'facebook_carousel': 'Facebook Carousel',
      'google_display': 'Google Display',
      'linkedin': 'LinkedIn',
      'twitter': 'Twitter',
      'tiktok': 'TikTok'
    }
    return names[platform] || platform
  }

  // Generate image for selected ad
  const generateImage = async (ad: Ad) => {
    console.log('Generating image for ad:', ad)
    setGeneratingImage(true)
    setSelectedAd(ad)
    setShowImageModal(true) // Open modal immediately
    
    try {
      const requestData = {
        prompt: ad.design.imagePrompt || `${ad.productName} - ${ad.content.headline}`,
        platform: ad.platform,
        style: selectedStyle,
        layout: {
          type: selectedLayout,
          composition: ad.design.layoutType
        },
        brand: {
          colors: ad.design.colorScheme || [],
          style: ad.design.visualStyle || 'modern'
        },
        product: {
          name: ad.productName,
          description: ad.content.bodyCopy,
          headline: ad.content.headline,
          targetAudience: ad.targetAudience
        }
      }
      
      console.log('Sending image generation request:', requestData)
      
      const response = await api.post('/images/generate', requestData)
      
      console.log('Image generation response:', response.data)
      
      const imageData = response.data.data
      setGeneratedImages(prev => ({
        ...prev,
        [ad._id]: imageData
      }))
    } catch (error) {
      console.error('Image generation error:', error)
      console.error('Error details:', error.response?.data)
      alert(`Failed to generate image: ${error.response?.data?.message || error.message}`)
    } finally {
      setGeneratingImage(false)
    }
  }

  // Generate multiple image variations
  const generateImageVariations = async (ad: Ad) => {
    console.log('Generating image variations for ad:', ad)
    setGeneratingImage(true)
    setSelectedAd(ad)
    setShowImageModal(true) // Open modal immediately
    
    try {
      const requestData = {
        prompt: ad.design.imagePrompt || `${ad.productName} - ${ad.content.headline}`,
        platform: ad.platform,
        styles: ['modern', 'lifestyle', 'bold'],
        layout: {
          type: selectedLayout,
          composition: ad.design.layoutType
        },
        brand: {
          colors: ad.design.colorScheme || [],
          style: ad.design.visualStyle || 'modern'
        },
        product: {
          name: ad.productName,
          description: ad.content.bodyCopy,
          headline: ad.content.headline,
          targetAudience: ad.targetAudience
        }
      }
      
      console.log('Sending image variations request:', requestData)
      
      const response = await api.post('/images/variations', requestData)
      
      console.log('Image variations response:', response.data)
      
      const variations = response.data.data.variations
      setGeneratedImages(prev => ({
        ...prev,
        [ad._id]: { variations }
      }))
    } catch (error) {
      console.error('Image variations error:', error)
      console.error('Error details:', error.response?.data)
      alert(`Failed to generate image variations: ${error.response?.data?.message || error.message}`)
    } finally {
      setGeneratingImage(false)
    }
  }

  // Download image
  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      console.log('Downloading image:', imageUrl)
      
      // Method 1: Try direct download first (simpler)
      try {
        const a = document.createElement('a')
        a.href = imageUrl
        a.download = filename || 'wootads-image.png'
        a.target = '_blank'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        console.log('Direct download successful:', filename)
        return
      } catch (directError) {
        console.log('Direct download failed, trying proxy method:', directError)
      }
      
      // Method 2: Use proxy to avoid CORS issues
      const response = await fetch(`/api/images/proxy?url=${encodeURIComponent(imageUrl)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Create download link
      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'wootads-image.png'
      a.style.display = 'none'
      
      // Add to DOM, click, and remove
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
      
      console.log('Proxy download successful:', filename)
    } catch (error) {
      console.error('All download methods failed:', error)
      
      // Method 3: Open in new tab as last resort
      try {
        window.open(imageUrl, '_blank')
        alert('Image opened in new tab. Please right-click and "Save image as..." to download.')
      } catch (finalError) {
        console.error('Final fallback failed:', finalError)
        alert(`Failed to download image. Please try right-clicking the image and selecting "Save image as..."`)
      }
    }
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="ad-results-page">
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h2>No Ads Generated</h2>
          <p>It looks like no ads were generated. Please try again.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/dashboard/create')}
          >
            Create New Ad
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ad-results-page">
      {/* Header */}
      <div className="results-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/dashboard/create')}
        >
          <ArrowLeft size={20} />
          Back to Create
        </button>
        
        <div className="results-title">
          <h1>Generated Ad Creatives</h1>
          <p>{ads.length} creative variations across {metadata.platformsGenerated?.length || 1} platform(s)</p>
        </div>

        <div className="generation-stats">
          <div className="stat">
            <span className="stat-value">{ads.length}</span>
            <span className="stat-label">Creatives</span>
          </div>
          <div className="stat">
            <span className="stat-value">{metadata.totalTokensUsed || 0}</span>
            <span className="stat-label">Tokens Used</span>
          </div>
          <div className="stat">
            <span className="stat-value">{metadata.generationTime || 0}s</span>
            <span className="stat-label">Generation Time</span>
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="ads-grid">
        {ads.map((ad) => (
          <div key={ad._id} className="ad-card">
            <div className="ad-header">
              <div className="platform-info">
                <span className="platform-icon">{getPlatformIcon(ad.platform)}</span>
                <span className="platform-name">{getPlatformName(ad.platform)}</span>
              </div>
              <div className="ad-actions">
                <button className="action-btn" title="View">
                  <Eye size={16} />
                </button>
                <button className="action-btn" title="Edit">
                  <Edit3 size={16} />
                </button>
                <button 
                  className="action-btn" 
                  title="Generate Image" 
                  onClick={() => {
                    console.log('Generate Image button clicked for ad:', ad._id)
                    generateImage(ad)
                  }}
                >
                  <ImageIcon size={16} />
                </button>
                <button 
                  className="action-btn" 
                  title="Generate Variations" 
                  onClick={() => {
                    console.log('Generate Variations button clicked for ad:', ad._id)
                    generateImageVariations(ad)
                  }}
                >
                  <Wand2 size={16} />
                </button>
                <button 
                  className="action-btn" 
                  title="Download"
                  onClick={() => {
                    if (generatedImages[ad._id]) {
                      const img = generatedImages[ad._id]
                      if (img.variations) {
                        // Download first variation
                        downloadImage(img.variations[0].imageUrl, `${ad.productName}-${img.variations[0].style}.png`)
                      } else if (img.imageUrl) {
                        downloadImage(img.imageUrl, `${ad.productName}-${img.style}.png`)
                      } else {
                        alert('No image generated yet. Please generate an image first.')
                      }
                    } else {
                      alert('No image generated yet. Please generate an image first.')
                    }
                  }}
                >
                  <Download size={16} />
                </button>
                <button className="action-btn" title="Save">
                  <Heart size={16} />
                </button>
              </div>
            </div>

            <div className="ad-content">
              <div className="ad-preview">
                <div className="preview-placeholder">
                  <div className="preview-content">
                    <h3 className="preview-headline">{ad.content.headline}</h3>
                    {ad.content.subheadline && (
                      <p className="preview-subheadline">{ad.content.subheadline}</p>
                    )}
                    <p className="preview-body">{ad.content.bodyCopy}</p>
                    <button className="preview-cta">{ad.content.callToAction}</button>
                  </div>
                </div>
              </div>

              <div className="ad-details">
                <div className="detail-section">
                  <h4>Copy Details</h4>
                  <div className="detail-item">
                    <strong>Headline:</strong> {ad.content.headline}
                  </div>
                  {ad.content.subheadline && (
                    <div className="detail-item">
                      <strong>Subheadline:</strong> {ad.content.subheadline}
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Body Copy:</strong> {ad.content.bodyCopy}
                  </div>
                  <div className="detail-item">
                    <strong>CTA:</strong> {ad.content.callToAction}
                  </div>
                  {ad.content.hashtags && ad.content.hashtags.length > 0 && (
                    <div className="detail-item">
                      <strong>Hashtags:</strong> {ad.content.hashtags.join(', ')}
                    </div>
                  )}
                </div>

                {ad.design && (
                  <div className="detail-section">
                    <h4>Design Specs</h4>
                    {ad.design.colorScheme && ad.design.colorScheme.length > 0 && (
                      <div className="detail-item">
                        <strong>Colors:</strong>
                        <div className="color-scheme">
                          {ad.design.colorScheme.map((color, index) => (
                            <div 
                              key={index} 
                              className="color-swatch"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {ad.design.visualStyle && (
                      <div className="detail-item">
                        <strong>Style:</strong> {ad.design.visualStyle}
                      </div>
                    )}
                    {ad.design.layoutType && (
                      <div className="detail-item">
                        <strong>Layout:</strong> {ad.design.layoutType}
                      </div>
                    )}
                  </div>
                )}

                {ad.metadata && (
                  <div className="detail-section">
                    <h4>Performance</h4>
                    {ad.metadata.performanceScore && (
                      <div className="detail-item">
                        <strong>AI Score:</strong> {Math.round(ad.metadata.performanceScore * 100)}%
                      </div>
                    )}
                    {ad.metadata.targetEmotions && ad.metadata.targetEmotions.length > 0 && (
                      <div className="detail-item">
                        <strong>Target Emotions:</strong> {ad.metadata.targetEmotions.join(', ')}
                      </div>
                    )}
                    {ad.metadata.tokensUsed && (
                      <div className="detail-item">
                        <strong>Tokens Used:</strong> {ad.metadata.tokensUsed}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <button 
          className="btn-secondary"
          onClick={() => {
            // Download all generated images
            const allImages = Object.values(generatedImages).flatMap(img => 
              img.variations ? img.variations.map((v: any) => v.imageUrl) : [img.imageUrl]
            )
            
            if (allImages.length === 0) {
              alert('No images generated yet. Please generate some images first.')
              return
            }
            
            allImages.forEach((imageUrl, index) => {
              setTimeout(() => {
                downloadImage(imageUrl, `wootads-image-${index + 1}.png`)
              }, index * 500) // Stagger downloads
            })
          }}
        >
          <Download size={20} />
          Download All
        </button>
        <button className="btn-primary">
          <Share2 size={20} />
          Share Collection
        </button>
        <button 
          className="btn-primary"
          onClick={() => navigate('/dashboard/create')}
        >
          Create More Ads
        </button>
        {/* Test button */}
        <button 
          className="btn-secondary"
          onClick={() => {
            console.log('Test modal button clicked')
            setSelectedAd(ads[0] || null)
            setShowImageModal(true)
          }}
        >
          Test Modal
        </button>
      </div>

      {/* Image Generation Modal */}
      {showImageModal && selectedAd && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate Images for {selectedAd.productName}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              {/* Layout Selection */}
              <div className="selection-section">
                <h4><Layout size={20} /> Choose Layout</h4>
                <div className="layout-grid">
                  {LAYOUT_TYPES.map(layout => (
                    <button
                      key={layout.id}
                      className={`layout-option ${selectedLayout === layout.id ? 'selected' : ''}`}
                      onClick={() => setSelectedLayout(layout.id)}
                    >
                      <span className="layout-icon">{layout.icon}</span>
                      <div className="layout-info">
                        <div className="layout-name">{layout.name}</div>
                        <div className="layout-desc">{layout.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="selection-section">
                <h4><Palette size={20} /> Choose Style</h4>
                <div className="style-grid">
                  {VISUAL_STYLES.map(style => (
                    <button
                      key={style.id}
                      className={`style-option ${selectedStyle === style.id ? 'selected' : ''}`}
                      onClick={() => setSelectedStyle(style.id)}
                    >
                      <div className="style-name">{style.name}</div>
                      <div className="style-desc">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Images */}
              {generatedImages[selectedAd._id] && (
                <div className="generated-images">
                  <h4>Generated Images</h4>
                  <div className="images-grid">
                    {generatedImages[selectedAd._id].variations ? (
                      // Multiple variations
                      generatedImages[selectedAd._id].variations.map((variation: any, index: number) => (
                        <div key={index} className="image-card">
                          <img 
                            src={variation.imageUrl} 
                            alt={`Generated image ${index + 1}`}
                            className="generated-image"
                          />
                          <div className="image-info">
                            <div className="image-style">{variation.style}</div>
                            <button 
                              className="download-btn"
                              onClick={() => downloadImage(
                                variation.imageUrl, 
                                `${selectedAd.productName}-${variation.style}-${index + 1}.png`
                              )}
                            >
                              <Download size={16} />
                              Download
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Single image
                      <div className="image-card">
                        <img 
                          src={generatedImages[selectedAd._id].imageUrl} 
                          alt="Generated image"
                          className="generated-image"
                        />
                        <div className="image-info">
                          <div className="image-style">{generatedImages[selectedAd._id].style}</div>
                          <button 
                            className="download-btn"
                            onClick={() => downloadImage(
                              generatedImages[selectedAd._id].imageUrl, 
                              `${selectedAd.productName}-${generatedImages[selectedAd._id].style}.png`
                            )}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowImageModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => generateImage(selectedAd)}
                  disabled={generatingImage}
                >
                  {generatingImage ? (
                    <>
                      <Loader size={20} className="spinner" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Generate Image
                    </>
                  )}
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => generateImageVariations(selectedAd)}
                  disabled={generatingImage}
                >
                  {generatingImage ? (
                    <>
                      <Loader size={20} className="spinner" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Generate Variations
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdResults
