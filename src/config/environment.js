// Environment Configuration
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws',
  
  // Authentication
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'dev-secret-key',
  SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '',
  
  // Third Party Services
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  
  // Feature Flags
  ENABLE_REAL_TIME_CHAT: import.meta.env.VITE_ENABLE_REAL_TIME_CHAT === 'true' || true,
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true' || false,
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true' || false,
  
  // Development
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV,
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // App Info
  APP_NAME: 'Respect',
  APP_VERSION: '1.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  WEBSOCKET_TIMEOUT: 5000, // 5 seconds
  
  // Local Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
    LAST_VISITED: 'lastVisited'
  }
}

// Validation
const validateConfig = () => {
  const required = ['API_BASE_URL']
  const missing = required.filter(key => !config[key])
  
  if (missing.length > 0) {
    console.warn(`Missing required config: ${missing.join(', ')}`)
  }
  
  if (config.DEBUG_MODE) {
    console.log('🔧 App Configuration:', config)
  }
}

// Initialize validation
validateConfig()

export default config 