import api from '../utils/axios'

// Respect service
const respectService = {
  // Send respect to artist
  sendRespectToArtist: async (artistId, amount, message = null) => {
    const response = await api.post('/respect/send/artist', {
      artistId,
      amount,
      message
    })
    return response
  },

  // Send respect to song
  sendRespectToSong: async (songId, amount, message = null) => {
    const response = await api.post('/respect/send/song', {
      songId,
      amount,
      message
    })
    return response
  },

  // Get user's respect balance
  getRespectBalance: async () => {
    const response = await api.get('/respect/balance')
    return response
  },

  // Get respect transaction history
  getRespectHistory: async (page = 1, limit = 20, type = 'all') => {
    const response = await api.get(`/respect/history?page=${page}&limit=${limit}&type=${type}`)
    return response
  },

  // Purchase respect credits
  purchaseRespect: async (packageId, paymentMethod) => {
    const response = await api.post('/respect/purchase', {
      packageId,
      paymentMethod
    })
    return response
  },

  // Get available respect packages
  getRespectPackages: async () => {
    const response = await api.get('/respect/packages')
    return response
  },

  // Get respect leaderboard
  getRespectLeaderboard: async (category = 'artists', timeframe = 'week', limit = 100) => {
    const response = await api.get(`/respect/leaderboard?category=${category}&timeframe=${timeframe}&limit=${limit}`)
    return response
  },

  // Get respect statistics
  getRespectStats: async (timeframe = 'week') => {
    const response = await api.get(`/respect/stats?timeframe=${timeframe}`)
    return response
  },

  // Claim daily respect bonus
  claimDailyBonus: async () => {
    const response = await api.post('/respect/daily-bonus')
    return response
  },

  // Get daily bonus status
  getDailyBonusStatus: async () => {
    const response = await api.get('/respect/daily-bonus/status')
    return response
  },

  // Get respect given to specific artist
  getRespectGivenToArtist: async (artistId) => {
    const response = await api.get(`/respect/given/artist/${artistId}`)
    return response
  },

  // Get respect given to specific song
  getRespectGivenToSong: async (songId) => {
    const response = await api.get(`/respect/given/song/${songId}`)
    return response
  },

  // Get total respect earned (for artists)
  getTotalRespectEarned: async () => {
    const response = await api.get('/respect/earned')
    return response
  },

  // Withdraw respect earnings (for artists)
  withdrawRespectEarnings: async (amount, withdrawalMethod) => {
    const response = await api.post('/respect/withdraw', {
      amount,
      withdrawalMethod
    })
    return response
  },

  // Get withdrawal history (for artists)
  getWithdrawalHistory: async (page = 1, limit = 20) => {
    const response = await api.get(`/respect/withdrawals?page=${page}&limit=${limit}`)
    return response
  },

  // Report respect transaction
  reportRespectTransaction: async (transactionId, reason) => {
    const response = await api.post(`/respect/report/${transactionId}`, {
      reason
    })
    return response
  },

  // Get respect analytics for artists
  getRespectAnalytics: async (timeframe = 'month') => {
    const response = await api.get(`/respect/analytics?timeframe=${timeframe}`)
    return response
  }
}

export default respectService 