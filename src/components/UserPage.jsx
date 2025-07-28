import React from 'react'
import Header from './Header'
import UserProfile from './UserProfile'
import UserStats from './UserStats'
import UserTopArtists from './UserTopArtists'
import UserTopSongs from './UserTopSongs'
import BackButton from './common/BackButton'

const UserPage = () => {
  return (
    <div className="user-page">
      <div className="page-header mobile-only">
        <BackButton to="/feed" />
      </div>
      <Header />
      
      {/* Mobile Layout - Orijinal sıra */}
      <div className="user-content mobile-only">
        <UserProfile />
        <UserStats />
        <UserTopArtists />
        <UserTopSongs />
      </div>

      {/* Desktop Layout */}
      <div className="desktop-only">
        {/* Desktop User Profile - Header'ın Altında */}
        <div className="desktop-user-profile">
          <div className="desktop-profile-content">
            <div className="desktop-profile-avatar">
              <img src="/src/assets/user/Image.png" alt="Alex Rodriguez" />
            </div>
            <div className="desktop-profile-info">
              <h1 className="desktop-user-name">Alex Rodriguez</h1>
              <p className="desktop-user-bio">Indie rock tutkunu. Sanatçıları desteklemeyi seven biri.</p>
              
              <div className="desktop-profile-stats">
                <div className="desktop-respect-count">
                  <span className="respect-number">2,847</span>
                  <span className="respect-label">Toplam Respect</span>
                  <span className="respect-goal">Gole</span>
                </div>
                <button className="desktop-edit-profile-btn">
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