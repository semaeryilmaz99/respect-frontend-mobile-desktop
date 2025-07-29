import { supabase } from '../config/supabase'

const feedService = {
  // Feed verilerini getir
  getFeed: async (page = 1, type = 'all') => {
    try {
      console.log('📊 Fetching feed data from Supabase...')
      
      let query = supabase
        .from('feed_items')
        .select(`
          *,
          profiles(username, full_name, avatar_url),
          artists(name, avatar_url),
          songs(title, cover_url)
        `)
        .order('created_at', { ascending: false })

      if (type !== 'all') {
        query = query.eq('type', type)
      }

      const { data, error } = await query
        .range((page - 1) * 20, page * 20 - 1)

      if (error) {
        throw error
      }

      console.log('✅ Feed data fetched:', data)
      return data || []

    } catch (error) {
      console.error('❌ Feed fetch error:', error)
      return []
    }
  },

  // Respect flow verilerini getir (son respect işlemleri)
  getRespectFlow: async (limit = 10) => {
    try {
      console.log('💰 Fetching respect flow data...')
      
      const { data, error } = await supabase
        .from('respect_transactions')
        .select(`
          *,
          profiles(username, full_name, avatar_url),
          artists(name, avatar_url),
          songs(title, cover_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      console.log('✅ Respect flow data fetched:', data)
      return data || []

    } catch (error) {
      console.error('❌ Respect flow fetch error:', error)
      return []
    }
  },

  // Top artists getir
  getTopArtists: async (limit = 5) => {
    try {
      console.log('🏆 Fetching top artists...')
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('total_respect', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      console.log('✅ Top artists fetched:', data)
      return data || []

    } catch (error) {
      console.error('❌ Top artists fetch error:', error)
      return []
    }
  },

  // Top songs getir
  getTopSongs: async (limit = 5) => {
    try {
      console.log('🎵 Fetching top songs...')
      
      const { data, error } = await supabase
        .from('songs')
        .select(`
          *,
          artists(name, avatar_url)
        `)
        .order('total_respect', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      console.log('✅ Top songs fetched:', data)
      return data || []

    } catch (error) {
      console.error('❌ Top songs fetch error:', error)
      return []
    }
  }
}

export default feedService 