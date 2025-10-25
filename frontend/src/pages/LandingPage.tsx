import { useNavigate } from 'react-router-dom'
import { Sparkles, Zap, Wand2, Rocket, Star, ArrowRight } from 'lucide-react'
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Sparkles size={32} />
              <span>WootAds</span>
            </div>
            <nav className="nav">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#pricing">Pricing</a>
            </nav>
            <div className="auth-buttons">
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="badge">
              <Star size={16} />
              <span>AI-Powered Ad Creation</span>
            </div>
            <h1 className="hero-title">
              Create Stunning Ads in
              <span className="gradient-text"> Seconds</span>
            </h1>
            <p className="hero-subtitle">
              Transform your ideas into beautiful, high-converting advertisements
              with the power of AI. No design skills required.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary btn-large" onClick={() => navigate('/register')}>
                Start Creating Free
                <ArrowRight size={20} />
              </button>
              <button className="btn-outline btn-large">
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-value">10K+</div>
                <div className="stat-label">Ads Created</div>
              </div>
              <div className="stat">
                <div className="stat-value">5K+</div>
                <div className="stat-label">Happy Users</div>
              </div>
              <div className="stat">
                <div className="stat-value">99%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to create professional ads</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Wand2 size={24} />
              </div>
              <h3>AI-Powered Design</h3>
              <p>
                Let AI generate stunning visuals and layouts based on your product
                and brand guidelines.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3>Lightning Fast</h3>
              <p>
                Create professional ads in seconds, not hours. Export ready-to-use
                creatives instantly.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={24} />
              </div>
              <h3>Smart Copy Generation</h3>
              <p>
                AI writes compelling ad copy that converts, tailored to your
                target audience.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Rocket size={24} />
              </div>
              <h3>Multi-Platform Export</h3>
              <p>
                Export ads optimized for Facebook, Instagram, Google, and more
                with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Create your first ad in 3 simple steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Describe Your Product</h3>
              <p>Tell us about your product or paste a URL. Our AI will understand your needs.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Creates Magic</h3>
              <p>Watch as AI generates beautiful designs, compelling copy, and stunning visuals.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Export & Launch</h3>
              <p>Download your ad and launch your campaign across multiple platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Create Amazing Ads?</h2>
            <p>Join thousands of marketers who trust WootAds</p>
            <button className="btn-primary btn-large" onClick={() => navigate('/register')}>
              Get Started for Free
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <Sparkles size={24} />
                <span>WootAds</span>
              </div>
              <p>AI-powered ad creation platform</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#demo">Demo</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#blog">Blog</a>
                <a href="#careers">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#contact">Contact</a>
                <a href="#terms">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 WootAds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage


