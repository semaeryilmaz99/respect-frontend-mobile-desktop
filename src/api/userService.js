import api from '../utils/axios'

// User service
const userService = {
  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData)
    return response
  },

  // Upload profile avatar
  uploadAvatar: async (imageFile) => {
    const formData = new FormData()
    formData.append('avatar', imageFile)
    
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },

  // Get user's top artists
  getUserTopArtists: async (userId, timeframe = 'all', limit = 10) => {
    const response = await api.get(`/users/${userId}/top-artists?timeframe=${timeframe}&limit=${limit}`)
    return response
  },

  // Get user's top songs
  getUserTopSongs: async (userId, timeframe = 'all', limit = 10) => {
    const response = await api.get(`/users/${userId}/top-songs?timeframe=${timeframe}&limit=${limit}`)
    return response
  },

  // Get user's stats
  getUserStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`)
    return response
  },

  // Get user's respect history
  getUserRespectHistory: async (userId, page = 1, limit = 20) => {
    const response = await api.get(`/users/${userId}/respect-history?page=${page}&limit=${limit}`)
    return response
  },

  // Follow/unfollow user
  toggleFollowUser: async (userId) => {
    const response = await api.post(`/users/${userId}/follow`)
    return response
  },

  // Get user's followers
  getUserFollowers: async (userId, page = 1, limit = 20) => {
    const response = await api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`)
    return response
  },

  // Get user's following
  getUserFollowing: async (userId, page = 1, limit = 20) => {
    const response = await api.get(`/users/${userId}/following?page=${page}&limit=${limit}`)
    return response
  },

  // Search users
  searchUsers: async (query, page = 1, limit = 20) => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    return response
  },

  // Get user's playlists
  getUserPlaylists: async (userId, page = 1, limit = 20) => {
    const response = await api.get(`/users/${userId}/playlists?page=${page}&limit=${limit}`)
    return response
  },

  // Create playlist
  createPlaylist: async (playlistData) => {
    const response = await api.post('/users/playlists', playlistData)
    return response
  },

  // Update playlist
  updatePlaylist: async (playlistId, playlistData) => {
    const response = await api.put(`/users/playlists/${playlistId}`, playlistData)
    return response
  },

  // Delete playlist
  deletePlaylist: async (playlistId) => {
    const response = await api.delete(`/users/playlists/${playlistId}`)
    return response
  },

  // Get user notifications
  getUserNotifications: async (page = 1, limit = 20) => {
    const response = await api.get(`/users/notifications?page=${page}&limit=${limit}`)
    return response
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await api.post(`/users/notifications/${notificationId}/read`)
    return response
  },

  // Update user settings
  updateSettings: async (settings) => {
    const response = await api.put('/users/settings', settings)
    return response
  },

  // Get user settings
  getUserSettings: async () => {
    const response = await api.get('/users/settings')
    return response
  }
}

export default userService 