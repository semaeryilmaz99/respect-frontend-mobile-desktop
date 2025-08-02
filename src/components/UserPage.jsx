import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import userService from '../api/userService'
import { supabase } from '../config/supabase'
import Header from './Header'
import UserProfile from './UserProfile'
import UserStats from './UserStats'
import UserTopArtists from './UserTopArtists'
import UserTopSongs from './UserTopSongs'
import UserFollowedArtists from './UserFollowedArtists'
import UserFavoritedSongs from './UserFavoritedSongs'
import UserRecentRespects from './UserRecentRespects'
import BackButton from './common/BackButton'
import LoadingSpinner from './LoadingSpinner'

const UserPage = () => {
  const navigate = useNavigate()
  const { state } = useAppContext()
  const { user } = state
  
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const handleEditProfile = () => {
    navigate('/profile/settings')
  }

  const handleDebugFollows = async () => {
    if (!user?.id) {
      console.log('❌ No user ID for debug')
      return
    }
    
    console.log('🔍 Debug: Checking follows for user:', user.id)
    
    try {
      // Direct Supabase query for debugging
      const { data, error } = await supabase
        .from('artist_follows')
        .select('*')
        .eq('user_id', user.id)
      
      console.log('🔍 Debug: Raw artist_follows data:', data)
      console.log('🔍 Debug: Error:', error)
      
      // Also check artists table
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .limit(5)
      
      console.log('🔍 Debug: Sample artists data:', artistsData)
      console.log('🔍 Debug: Artists error:', artistsError)
      
      // Test userService.getFollowedArtists function
      console.log('🔍 Debug: Testing userService.getFollowedArtists...')
      const followedArtists = await userService.getFollowedArtists(user.id)
      console.log('🔍 Debug: userService.getFollowedArtists result:', followedArtists)
      
      // Test the exact query that userService uses
      console.log('🔍 Debug: Testing exact userService query...')
      const { data: exactData, error: exactError } = await supabase
        .from('artist_follows')
        .select(`
          *,
          artists (
            id,
            name,
            avatar_url,
            total_respect,
            followers_count
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      console.log('🔍 Debug: Exact query data:', exactData)
      console.log('🔍 Debug: Exact query error:', exactError)
      
      // Test feed items
      console.log('🔍 Debug: Testing feed items...')
      const { data: feedData, error: feedError } = await supabase
        .from('feed_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      console.log('🔍 Debug: Feed items data:', feedData)
      console.log('🔍 Debug: Feed items error:', feedError)
      
      // Test feed items count
      const { count: feedCount, error: feedCountError } = await supabase
        .from('feed_items')
        .select('*', { count: 'exact', head: true })
      
      console.log('🔍 Debug: Feed items count:', feedCount)
      console.log('🔍 Debug: Feed items count error:', feedCountError)
      
      // Test feed items table structure
      console.log('🔍 Debug: Testing feed items table structure...')
      const { data: tableStructure, error: structureError } = await supabase
        .from('feed_items')
        .select('*')
        .limit(1)
      
      console.log('🔍 Debug: Feed items table structure:', tableStructure)
      console.log('🔍 Debug: Feed items table structure error:', structureError)
      
      // Test inserting a test feed item
      console.log('🔍 Debug: Testing feed item insertion...')
      const { data: testInsert, error: insertError } = await supabase
        .from('feed_items')
        .insert({
          type: 'artist_followed',
          user_id: user.id,
          artist_id: '550e8400-e29b-41d4-a716-446655440001', // Test artist ID
          content: { test: true }
        })
        .select()
        .single()
      
      console.log('🔍 Debug: Test feed item insert result:', testInsert)
      console.log('🔍 Debug: Test feed item insert error:', insertError)
      
      // Test auth status
      console.log('🔍 Debug: Testing auth status...')
      const { data: authStatus, error: authError } = await supabase
        .rpc('check_auth_status')
      
      console.log('🔍 Debug: Auth status:', authStatus)
      console.log('🔍 Debug: Auth error:', authError)
      
      // Test current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      console.log('🔍 Debug: Current user from auth:', currentUser)
      
    } catch (error) {
      console.error('🔍 Debug error:', error)
    }
  }
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const profile = await userService.getProfile(user.id)
        setUserData(profile)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setError('Profil bilgileri yüklenirken hata oluştu')
        
        // Fallback to user data from context
        setUserData({
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Kullanıcı',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'kullanici',
          bio: 'Profil bilgileri yüklenemedi.',
          avatar_url: user.user_metadata?.avatar_url || '/src/assets/user/Image.png',
          respect_balance: 1000
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [user])
  
  // Loading state
  if (loading) {
    return <LoadingSpinner />
  }
  
  // Error state
  if (error && !userData) {
    return (
      <div className="user-page">
        <Header />
        <div className="error-message">
          {error}
        </div>
      </div>
    )
  }
  
  // Use real user data or fallback to default
  const displayUserData = userData || {
    full_name: 'Alex Rodriguez',
    username: 'alexrodriguez',
    bio: 'Indie rock tutkunu. Sanatçıları desteklemeyi seven biri.',
    avatar_url: '/src/assets/user/Image.png',
    respect_balance: 2847
  }
  
  return (
    <div className="user-page">
      <div className="page-header mobile-only">
        <BackButton to="/feed" />
      </div>
      <Header />
      
      {/* Mobile Layout - Orijinal sıra */}
      <div className="user-content mobile-only">
        <UserProfile userData={displayUserData} />
        <UserStats userData={displayUserData} />
        <UserRecentRespects />
        <UserFollowedArtists />
        <UserFavoritedSongs />
        <UserTopArtists />
        <UserTopSongs />
      </div>

      {/* Desktop Layout */}
      <div className="desktop-only">
        {/* Desktop User Profile - Header'ın Altında */}
        <div className="desktop-user-profile">
          <div className="desktop-profile-content">
            <div className="desktop-profile-avatar">
              <img src={displayUserData.avatar_url} alt={displayUserData.full_name} />
            </div>
            <div className="desktop-profile-info">
              <h1 className="desktop-user-name">{displayUserData.full_name}</h1>
              <p className="desktop-user-bio">{displayUserData.bio}</p>
              
              <div className="desktop-profile-stats">
                <div className="desktop-respect-count">
                  <span className="respect-number">{displayUserData.respect_balance?.toLocaleString() || '2,847'}</span>
                  <span className="respect-label">Toplam Respect</span>
                  <span className="respect-goal">Gole</span>
                </div>
                <button className="desktop-edit-profile-btn" onClick={handleEditProfile}>
                  Profil Düzenle
                </button>
                <button 
                  className="desktop-edit-profile-btn" 
                  onClick={handleDebugFollows}
                  style={{ marginTop: '8px', backgroundColor: '#ff6b6b' }}
                >
                  Debug Follows
                </button>
              </div>
            </div>
          </div>

          {/* Şu An Dinliyor - Profile İçinde */}
          <div className="profile-now-playing">
            <h3 className="section-title">Şu An Dinliyor</h3>
            <div className="now-playing-card">
              <div className="now-playing-avatar">
                <img src="/src/assets/user/Image (1).png" alt="İstakoz" />
              </div>
              <div className="now-playing-info">
                <h4 className="now-playing-artist">İstakoz</h4>
                <p className="now-playing-album">Gaye Su Akyol</p>
                <p className="now-playing-quote">"Bu şarkıyı da sevdiğimizi - birlikte dinleyelim!"</p>
              </div>
              <button className="now-playing-listen-btn">
                Birlikte Dinle
              </button>
            </div>
          </div>
        </div>

        {/* Desktop 3 Kolonlu Layout */}
        <div className="desktop-user-layout">
          {/* Sol: Takip Edilen Sanatçılar ve Favori Şarkılar */}
          <div className="desktop-user-left">
            <UserFollowedArtists />
            <UserFavoritedSongs />
          </div>

          {/* Orta: Son Respect Gönderimleri */}
          <div className="desktop-user-center">
            <UserRecentRespects />
          </div>

          {/* Sağ: En Çok Destekleyenler */}
          <div className="desktop-user-right">
            <UserTopArtists />
            <UserTopSongs />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage 