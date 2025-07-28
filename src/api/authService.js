import api from '../utils/axios'

// Authentication service
const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    
    if (response.token) {
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  },

  // Register new user
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData)
    
    if (response.token) {
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  },

  // Spotify OAuth login
  spotifyLogin: async () => {
    const response = await api.get('/auth/spotify')
    return response
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Log error but continue with cleanup
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    
    if (response.token) {
      localStorage.setItem('authToken', response.token)
    }
    
    return response
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password: newPassword
    })
    return response
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken')
    return !!token
  },

  // Get stored user data
  getStoredUser: () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  }
}

export default authService 