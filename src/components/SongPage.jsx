import React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Header from './Header'
import SongInfo from './SongInfo'
import SongTopSupporters from './SongTopSupporters'
import SongRecentSupporters from './SongRecentSupporters'
import SongRealTimeChat from './SongRealTimeChat'
import MoreByArtist from './MoreByArtist'
import BackButton from './common/BackButton'

const SongPage = () => {
  const navigate = useNavigate()
  const { id: songId } = useParams()
  const location = useLocation()

  // Şarkı bilgilerini al
  const songData = location.state || {
    songId: songId || '1',
    songTitle: 'Sunset Boulevard',
    artistName: 'The Midnight Collective',
    songCover: '/src/assets/song/Image.png',
    currentRespect: '5,247'
  }

  const handleQuickRespect = (amount) => {
    navigate('/send-respect', {
      state: {
        ...songData,
        preselectedAmount: amount
      }
    })
  }

  const handleFullRespect = () => {
    navigate('/send-respect', {
      state: songData
    })
  }

  return (
    <div className="song-page">
      <div className="page-header mobile-only">
        <BackButton to="/feed" />
      </div>
      <Header />
      
      {/* Mobile Layout - Orijinal sıra */}
      <div className="song-content mobile-only">
        <SongInfo />
        <SongTopSupporters />
        <SongRecentSupporters />
        <SongRealTimeChat />
        <MoreByArtist />
      </div>

      {/* Desktop Layout - 4 Bölümlü */}
      <div className="song-desktop-layout desktop-only">
        {/* Sol: En Çok Respect Gönderelenler */}
        <div className="song-left-panel">
          <SongTopSupporters />
        </div>

        {/* Orta Sol: Şarkı Bilgisi + Sanatçıdan Diğer Şarkılar */}
        <div className="song-center-left">
          <SongInfo />
          <MoreByArtist />
        </div>

        {/* Orta Sağ: Respect Gönder */}
        <div className="song-center-right">
          <div className="desktop-respect-send">
            <h3 className="respect-section-title">Respect Gönder</h3>
            <p className="respect-subtitle">Bu harika şarkıya desteğini göster</p>
            
            <div className="quick-respect-buttons">
              <button 
                className="quick-respect-btn" 
                onClick={() => handleQuickRespect(50)}
              >
                50 Respect
              </button>
              <button 
                className="quick-respect-btn" 
                onClick={() => handleQuickRespect(100)}
              >
                100 Respect
              </button>
              <button 
                className="quick-respect-btn" 
                onClick={() => handleQuickRespect(250)}
              >
                250 Respect
              </button>
              <button 
                className="quick-respect-btn" 
                onClick={() => handleQuickRespect(500)}
              >
                500 Respect
              </button>
              <button 
                className="quick-respect-btn" 
                onClick={() => handleQuickRespect(1000)}
              >
                1000 Respect
              </button>
            </div>
            
            <button className="full-respect-button" onClick={handleFullRespect}>
              Respect Gönder
            </button>
          </div>
        </div>

        {/* Sağ: Chat (zaten fixed positioned) */}
        <SongRealTimeChat />
      </div>
    </div>
  )
}

export default SongPage 