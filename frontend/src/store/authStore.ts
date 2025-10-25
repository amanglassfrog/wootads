import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => {
    set({ user, token, isAuthenticated: true })
    localStorage.setItem('auth-token', token)
    localStorage.setItem('auth-user', JSON.stringify(user))
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
  },
}))

// Initialize from localStorage
const token = localStorage.getItem('auth-token')
const userStr = localStorage.getItem('auth-user')
if (token && userStr) {
  try {
    const user = JSON.parse(userStr)
    useAuthStore.setState({ user, token, isAuthenticated: true })
  } catch (e) {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
  }
}

