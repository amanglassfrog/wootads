import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {  Link2, FileText, Upload, ArrowRight, ArrowLeft, Wand2, Loader } from 'lucide-react'
import api from '../api/axios'
import './CreateAd.css'

interface ProductData {
  inputType: 'url' | 'text'
  url?: string
  productName: string
  productDescription: string
  targetAudience: string
  platforms: string[]
  tone: string
  scrapedData?: any
}

const PLATFORMS = [
  { id: 'instagram_feed', name: 'Instagram Feed', icon: '📸', desc: '1080x1080 square posts' },
  { id: 'instagram_story', name: 'Instagram Stories', icon: '📱', desc: '9:16 vertical stories' },
  { id: 'facebook_carousel', name: 'Facebook Carousel', icon: '🎠', desc: '5-card sequences' },
  { id: 'google_display', name: 'Google Display', icon: '🎯', desc: 'Multiple banner sizes' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', desc: 'Professional ads' },
]

const TONES = [
  { id: 'professional', name: 'Professional', icon: '👔' },
  { id: 'casual', name: 'Casual', icon: '😊' },
  { id: 'playful', name: 'Playful', icon: '🎉' },
  { id: 'friendly', name: 'Friendly', icon: '🤝' },
  { id: 'bold', name: 'Bold', icon: '⚡' },
]

const CreateAd = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<ProductData>({
    inputType: 'url',
    url: '',
    productName: '',
    productDescription: '',
    targetAudience: '',
    platforms: ['instagram_feed'],
    tone: 'professional',
  })

  // Step 1: Input method selection and data entry
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    setError('')
  }

  // Analyze URL
  const analyzeProductUrl = async () => {
    if (!formData.url) {
      setError('Please enter a product URL')
      return
    }

    setAnalyzing(true)
    setError('')

    try {
      const response = await api.post('/ads/analyze-url', { url: formData.url })
      const { data } = response.data

      setFormData({
        ...formData,
        productName: data.title || formData.productName,
        productDescription: data.description || formData.productDescription,
        scrapedData: data,
      })

      setStep(2)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze URL')
    } finally {
      setAnalyzing(false)
    }
  }

  // Platform toggle
  const togglePlatform = (platformId: string) => {
    const platforms = formData.platforms.includes(platformId)
      ? formData.platforms.filter(p => p !== platformId)
      : [...formData.platforms, platformId]
    
    setFormData({ ...formData, platforms })
  }

  // Generate ads
  const generateAds = async () => {
    if (formData.platforms.length === 0) {
      setError('Please select at least one platform')
      return
    }

    if (!formData.productName || !formData.productDescription || !formData.targetAudience) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.post('/ads/generate', formData)
      
      // Navigate to results page
      navigate('/dashboard/ads/results', {
        state: {
          ads: response.data.ads,
          metadata: response.data.generationMetadata,
        },
      })
    } catch (err: any) {
      console.error('Ad generation error:', err)
      setError(err.response?.data?.message || 'Failed to generate ads')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-ad-page">
      <div className="create-ad-container">
        {/* Header */}
        <div className="create-ad-header">
          <h1>
            <Wand2 size={32} />
            Smart Design Generator
          </h1>
          <p>Create stunning ad creatives powered by AI in seconds</p>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Input</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Customize</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Generate</div>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="wizard-step">
            <h2>How would you like to start?</h2>
            
            <div className="input-type-selector">
              <button
                className={`input-type-btn ${formData.inputType === 'url' ? 'active' : ''}`}
                onClick={() => handleInputChange('inputType', 'url')}
              >
                <Link2 size={24} />
                <span>Product URL</span>
                <small>AI will extract product info</small>
              </button>
              
              <button
                className={`input-type-btn ${formData.inputType === 'text' ? 'active' : ''}`}
                onClick={() => handleInputChange('inputType', 'text')}
              >
                <FileText size={24} />
                <span>Describe Product</span>
                <small>Manually enter details</small>
              </button>
            </div>

            {formData.inputType === 'url' ? (
              <div className="input-section">
                <label htmlFor="url">Product URL</label>
                <div className="url-input-group">
                  <input
                    id="url"
                    type="url"
                    placeholder="https://example.com/products/your-product"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && analyzeProductUrl()}
                  />
                  <button 
                    className="btn-primary"
                    onClick={analyzeProductUrl}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <>
                        <Loader size={18} className="spinner" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
                <small className="help-text">
                  Paste a product URL and we'll automatically extract images, description, and pricing
                </small>
              </div>
            ) : (
              <div className="input-section">
                <div className="form-group">
                  <label htmlFor="productName">Product Name *</label>
                  <input
                    id="productName"
                    type="text"
                    placeholder="e.g., Organic Green Tea Blend"
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productDescription">Product Description *</label>
                  <textarea
                    id="productDescription"
                    rows={4}
                    placeholder="Describe your product, its benefits, and key features..."
                    value={formData.productDescription}
                    onChange={(e) => handleInputChange('productDescription', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="targetAudience">Target Audience *</label>
                  <input
                    id="targetAudience"
                    type="text"
                    placeholder="e.g., Health-conscious millennials, busy professionals"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  />
                </div>

                <button
                  className="btn-primary btn-large"
                  onClick={() => setStep(2)}
                  disabled={!formData.productName || !formData.productDescription || !formData.targetAudience}
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Customize */}
        {step === 2 && (
          <div className="wizard-step">
            <h2>Customize Your Creatives</h2>

            {/* Scraped data preview */}
            {formData.scrapedData && (
              <div className="scraped-data-preview">
                <h3>✓ AI found this information:</h3>
                <div className="preview-grid">
                  <div className="preview-item">
                    <strong>Product:</strong> {formData.productName}
                  </div>
                  {formData.scrapedData.price && (
                    <div className="preview-item">
                      <strong>Price:</strong> ${formData.scrapedData.price}
                    </div>
                  )}
                  <div className="preview-item">
                    <strong>Description:</strong> {formData.productDescription?.substring(0, 100)}...
                  </div>
                </div>
                <button className="btn-text" onClick={() => setStep(1)}>
                  ✏️ Edit Details
                </button>
              </div>
            )}

            {/* Target Audience - always required */}
            <div className="form-section">
              <div className="form-group">
                <label>Target Audience *</label>
                <input
                  type="text"
                  placeholder="e.g., Health-conscious millennials, busy professionals"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  required
                />
                <small className="help-text">
                  Who is this product for? Be specific about age, interests, or demographics.
                </small>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="form-section">
              <h3>Select Platforms</h3>
              <div className="platform-grid">
                {PLATFORMS.map(platform => (
                  <button
                    key={platform.id}
                    className={`platform-card ${formData.platforms.includes(platform.id) ? 'selected' : ''}`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <span className="platform-icon">{platform.icon}</span>
                    <div className="platform-info">
                      <div className="platform-name">{platform.name}</div>
                      <div className="platform-desc">{platform.desc}</div>
                    </div>
                    {formData.platforms.includes(platform.id) && (
                      <span className="check-badge">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="form-section">
              <h3>Tone of Voice</h3>
              <div className="tone-grid">
                {TONES.map(tone => (
                  <button
                    key={tone.id}
                    className={`tone-btn ${formData.tone === tone.id ? 'selected' : ''}`}
                    onClick={() => handleInputChange('tone', tone.id)}
                  >
                    <span className="tone-icon">{tone.icon}</span>
                    <span>{tone.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="step-navigation">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={20} />
                Back
              </button>
              <button
                className="btn-primary btn-large"
                onClick={() => setStep(3)}
                disabled={formData.platforms.length === 0 || !formData.targetAudience.trim()}
              >
                Review & Generate
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Generate */}
        {step === 3 && (
          <div className="wizard-step">
            <h2>Review & Generate</h2>

            <div className="review-section">
              <div className="review-item">
                <strong>Product:</strong>
                <span>{formData.productName}</span>
              </div>
              
              <div className="review-item">
                <strong>Description:</strong>
                <span>{formData.productDescription?.substring(0, 150)}...</span>
              </div>
              
              <div className="review-item">
                <strong>Target Audience:</strong>
                <span className={!formData.targetAudience.trim() ? 'missing-field' : ''}>
                  {formData.targetAudience || '⚠️ Please fill in Target Audience'}
                </span>
              </div>
              
              <div className="review-item">
                <strong>Platforms:</strong>
                <div className="selected-platforms">
                  {formData.platforms.map(p => {
                    const platform = PLATFORMS.find(pl => pl.id === p)
                    return (
                      <span key={p} className="platform-badge">
                        {platform?.icon} {platform?.name}
                      </span>
                    )
                  })}
                </div>
              </div>
              
              <div className="review-item">
                <strong>Tone:</strong>
                <span className="tone-badge">
                  {TONES.find(t => t.id === formData.tone)?.icon}{' '}
                  {TONES.find(t => t.id === formData.tone)?.name}
                </span>
              </div>
            </div>

            <div className="generation-info">
              <Wand2 size={24} />
              <div>
                <h4>AI will generate:</h4>
                <ul>
                  <li>3 creative variations per platform</li>
                  <li>Optimized headlines and copy</li>
                  <li>Platform-specific layouts</li>
                  <li>Performance predictions</li>
                </ul>
              </div>
            </div>

            <div className="step-navigation">
              <button className="btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={20} />
                Back
              </button>
              <button
                className="btn-primary btn-large"
                onClick={generateAds}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="spinner" />
                    Generating Creatives...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    Generate Ads
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateAd

