import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import userService from '../api/userService'
import Header from './Header'
import UserProfile from './UserProfile'
import UserStats from './UserStats'
import UserTopArtists from './UserTopArtists'
import UserTopSongs from './UserTopSongs'
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

        {/* Desktop 2 Kolonlu Layout */}
        <div className="desktop-user-layout">
          {/* Sol: En Çok Destekleyenler */}
          <div className="desktop-user-left">
            <UserTopArtists />
          </div>

          {/* Sağ: En Çok Desteklediği Şarkılar */}
          <div className="desktop-user-right">
            <UserTopSongs />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage 