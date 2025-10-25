import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import {
  Sparkles,
  LayoutDashboard,
  Wand2,
  Image,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import CreateAd from './CreateAd'
import AdResults from './AdResults'
import './Dashboard.css'

// Placeholder components for different sections
const Overview = () => (
  <div className="dashboard-content">
    <h1>Welcome to WootAds!</h1>
    <p>Start creating amazing ads with AI-powered tools.</p>
    <div className="quick-stats">
      <div className="stat-card">
        <h3>0</h3>
        <p>Total Ads</p>
      </div>
      <div className="stat-card">
        <h3>0</h3>
        <p>Templates</p>
      </div>
      <div className="stat-card">
        <h3>0</h3>
        <p>Projects</p>
      </div>
    </div>
  </div>
)

const Templates = () => (
  <div className="dashboard-content">
    <h1>Templates</h1>
    <p>Browse and use pre-made templates</p>
    <div className="placeholder-content">
      <Image size={64} />
      <p>Template library coming soon...</p>
    </div>
  </div>
)

const Projects = () => (
  <div className="dashboard-content">
    <h1>My Projects</h1>
    <p>Manage your ad campaigns and projects</p>
    <div className="placeholder-content">
      <FolderOpen size={64} />
      <p>Project management coming soon...</p>
    </div>
  </div>
)

const SettingsPage = () => (
  <div className="dashboard-content">
    <h1>Settings</h1>
    <p>Manage your account and preferences</p>
    <div className="placeholder-content">
      <Settings size={64} />
      <p>Settings panel coming soon...</p>
    </div>
  </div>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/create', icon: Wand2, label: 'Create Ad' },
    { path: '/dashboard/templates', icon: Image, label: 'Templates' },
    { path: '/dashboard/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Sparkles size={24} />
            <span>WootAds</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/create" element={<CreateAd />} />
          <Route path="/ads/results" element={<AdResults />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default Dashboard

