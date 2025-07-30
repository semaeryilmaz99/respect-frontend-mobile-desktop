import { supabase } from '../config/supabase'

const feedService = {
  // Genel feed verilerini getir (tüm kullanıcı aktiviteleri)
  getFeed: async (page = 1, type = 'all') => {
    try {
      console.log('📊 Fetching general feed data from Supabase...')
      
      // Basit sorgu ile başla
      let query = supabase
        .from('feed_items')
        .select('*')
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

  // Kullanıcıya özel feed verilerini getir (takip edilen sanatçılar ve favori şarkılar)
  getPersonalFeed: async (page = 1) => {
    try {
      console.log('👤 Fetching personal feed data...')
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Kullanıcı giriş yapmamış')
      }

      // Kullanıcının takip ettiği sanatçıları getir
      const { data: followedArtists, error: followError } = await supabase
        .from('artist_follows')
        .select('artist_id')
        .eq('user_id', user.id)

      let followedArtistIds = []
      if (followError) {
        console.error('Follow error:', followError)
      } else {
        followedArtistIds = followedArtists.map(fa => fa.artist_id)
      }

      // Kullanıcının favori şarkılarını getir
      const { data: favoriteSongs, error: favoriteError } = await supabase
        .from('song_favorites')
        .select('song_id')
        .eq('user_id', user.id)

      let favoriteSongIds = []
      if (favoriteError) {
        console.error('Favorite error:', favoriteError)
      } else {
        favoriteSongIds = favoriteSongs.map(fs => fs.song_id)
      }

      // Eğer takip edilen sanatçı veya favori şarkı yoksa boş array döndür
      if (followedArtistIds.length === 0 && favoriteSongIds.length === 0) {
        console.log('👤 No followed artists or favorite songs found')
        return []
      }

      // Takip edilen sanatçılar ve favori şarkılarla ilgili feed items'ları getir
      let query = supabase
        .from('feed_items')
        .select('*')
        .order('created_at', { ascending: false })

      // OR koşulu oluştur
      const conditions = []
      if (followedArtistIds.length > 0) {
        conditions.push(`artist_id.in.(${followedArtistIds.join(',')})`)
      }
      if (favoriteSongIds.length > 0) {
        conditions.push(`song_id.in.(${favoriteSongIds.join(',')})`)
      }

      if (conditions.length > 0) {
        query = query.or(conditions.join(','))
      }

      const { data, error } = await query
        .range((page - 1) * 20, page * 20 - 1)

      if (error) {
        throw error
      }

      console.log('✅ Personal feed data fetched:', data)
      return data || []

    } catch (error) {
      console.error('❌ Personal feed fetch error:', error)
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
  },

  // Feed item oluştur
  createFeedItem: async (type, artistId = null, songId = null, content = {}) => {
    try {
      console.log('📝 Creating feed item:', { type, artistId, songId, content })
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Kullanıcı giriş yapmamış')
      }

      const { data, error } = await supabase
        .from('feed_items')
        .insert({
          type,
          user_id: user.id,
          artist_id: artistId,
          song_id: songId,
          content
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      console.log('✅ Feed item created:', data)
      return { data, error: null }

    } catch (error) {
      console.error('❌ Feed item creation error:', error)
      return { data: null, error }
    }
  },

  // Respect gönderildiğinde feed item oluştur
  createRespectFeedItem: async (artistId, songId, amount, message) => {
    return await feedService.createFeedItem('respect_sent', artistId, songId, {
      amount,
      message
    })
  },

  // Şarkı favorilendiğinde feed item oluştur
  createSongFavoritedFeedItem: async (songId) => {
    return await feedService.createFeedItem('song_favorited', null, songId)
  },

  // Sanatçı takip edildiğinde feed item oluştur
  createArtistFollowedFeedItem: async (artistId) => {
    return await feedService.createFeedItem('artist_followed', artistId)
  }
}

export default feedService 