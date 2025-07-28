import api from '../utils/axios'

// Feed service
const feedService = {
  // Get community feed
  getCommunityFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/feed/community?page=${page}&limit=${limit}`)
    return response
  },

  // Get personal feed
  getPersonalFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/feed/personal?page=${page}&limit=${limit}`)
    return response
  },

  // Get trending songs
  getTrendingSongs: async (timeframe = 'week') => {
    const response = await api.get(`/feed/trending/songs?timeframe=${timeframe}`)
    return response
  },

  // Get trending artists
  getTrendingArtists: async (timeframe = 'week') => {
    const response = await api.get(`/feed/trending/artists?timeframe=${timeframe}`)
    return response
  },

  // Get recent activity
  getRecentActivity: async (userId, page = 1, limit = 10) => {
    const response = await api.get(`/feed/activity/${userId}?page=${page}&limit=${limit}`)
    return response
  },

  // Mark feed item as read
  markAsRead: async (feedItemId) => {
    const response = await api.post(`/feed/mark-read/${feedItemId}`)
    return response
  },

  // React to feed item (like, love, etc.)
  reactToFeedItem: async (feedItemId, reactionType) => {
    const response = await api.post(`/feed/react/${feedItemId}`, {
      reaction: reactionType
    })
    return response
  },

  // Share feed item
  shareFeedItem: async (feedItemId, platform) => {
    const response = await api.post(`/feed/share/${feedItemId}`, {
      platform
    })
    return response
  }
}

export default feedService 