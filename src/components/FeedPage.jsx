import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import FeedCard from './FeedCard'
import RealTimeChat from './RealTimeChat'
import { useApi, usePaginatedApi } from '../hooks/useApi'
import { feedService } from '../api'

const FeedPage = () => {
  const [activeTab, setActiveTab] = useState('community')
  const navigate = useNavigate()
  
  // API hook'ları kullanarak veri yükleme
  const { 
    data: feedData, 
    loading: feedLoading, 
    error: feedError, 
    execute: refreshFeed 
  } = useApi(
    () => activeTab === 'community' 
      ? feedService.getFeed() 
      : feedService.getPersonalFeed(),
    [activeTab], // activeTab değiştiğinde yeniden yükle
    true // component mount olduğunda otomatik çalışsın
  )

  const { 
    data: respectFlowData, 
    loading: respectFlowLoading 
  } = useApi(
    () => feedService.getRespectFlow(),
    [],
    true
  )

  const { 
    data: topArtists, 
    loading: artistsLoading 
  } = useApi(
    () => feedService.getTopArtists(),
    [],
    true
  )

  const { 
    data: topSongs, 
    loading: songsLoading 
  } = useApi(
    () => feedService.getTopSongs(),
    [],
    true
  )
  
  const handleRespectSend = () => {
    navigate('/send-respect')
  }

  // Loading durumlarını birleştir
  const isLoading = feedLoading || respectFlowLoading || artistsLoading || songsLoading

  // Database'den gelen verileri formatla
  const formatFeedData = (data) => {
    return data.map(item => ({
      type: item.type,
      title: getFeedItemTitle(item),
      buttonText: getFeedItemButtonText(item),
      profileImage: getFeedItemImage(item)
    }))
  }

  const getFeedItemTitle = (item) => {
    if (item.type === 'respect_sent') {
      const amount = item.content?.amount || 0
      const message = item.content?.message || ''
      return `Şarkıya ${amount} respect gönderildi${message ? `: "${message}"` : ''}`
    } else if (item.type === 'song_favorited') {
      return 'Şarkı favorilere eklendi'
    } else if (item.type === 'artist_followed') {
      return 'Sanatçı takip edildi'
    }
    return 'Aktivite gerçekleşti'
  }

  const getFeedItemButtonText = (item) => {
    if (item.type === 'respect_sent') {
      return 'Detayları Gör'
    }
    return 'Görüntüle'
  }

  const getFeedItemImage = () => {
    return '/src/assets/artist/Image.png'
  }

  // Loading durumu
  if (isLoading) {
    return (
      <div className="feed-page">
        <Header />
        <div className="loading-container">
          <p>Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Error durumu
  if (feedError) {
    return (
      <div className="feed-page">
        <Header />
        <div className="error-container">
          <h3>Bir hata oluştu</h3>
          <p>{feedError.message}</p>
          <button onClick={refreshFeed}>Tekrar Dene</button>
        </div>
      </div>
    )
  }

  // Database'den gelen verileri kullan
  const currentData = formatFeedData(feedData)

  return (
    <div className="feed-page">
      <Header />
      
      {/* Desktop Respect Gönder Button */}
      <div className="desktop-respect-button-container">
        <button className="desktop-respect-button" onClick={handleRespectSend}>
          Respect Gönder
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="feed-tabs">
        <button 
          className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => setActiveTab('community')}
        >
          Topluluk
        </button>
        <button 
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Sana Özel
        </button>
      </div>
      
      {/* Fixed Chat Panel - sadece desktop'ta görünür */}
      <div className="chat-panel">
        <RealTimeChat />
      </div>
      
      {/* Mobile Chat Panel - sadece mobile'da görünür */}
      <div className="mobile-chat-panel">
        <RealTimeChat />
      </div>
      
      {/* Desktop Layout: Sol respect akışı + Sağ ana feed */}
      <div className="feed-layout">
        {/* Sol Panel - Respect Akışı (sadece desktop'ta görünür) */}
        <div className="respect-flow-panel desktop-only">
          <h2 className="respect-flow-title">Respect Akışı</h2>
          <div className="respect-flow-items">
            {respectFlowData.map((item) => (
              <div key={item.id} className="respect-flow-item">
                <div className="respect-flow-header">
                  <img src={item.user.avatar} alt={item.user.name} className="user-avatar-small" />
                  <div className="respect-flow-info">
                    <span className="user-name">{item.user.name}</span>
                    <span className="respect-time">{item.time}</span>
                  </div>
                  <span className="respect-amount">+{item.amount}</span>
                </div>
                
                <div className="respect-flow-content">
                  <img src={item.song.cover} alt={item.song.title} className="song-cover-small" />
                  <div className="song-info">
                    <p className="song-title">{item.song.title}</p>
                    <p className="artist-name">{item.artist.name}</p>
                  </div>
                </div>
                
                {item.message && (
                  <p className="respect-message">"{item.message}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
                {/* Orta Panel - Ana Feed */}
        <div className="main-feed-panel">
          {/* Feed Header - Desktop Only */}
          <div className="feed-header">
            <h2 className="feed-header-title">Respect topluluğunda neler oluyor?</h2>
          </div>
          
          <div className="feed">
            {currentData.map((item, index) => (
              <FeedCard
                key={index}
                type={item.type}
                title={item.title}
                buttonText={item.buttonText}
                profileImage={item.profileImage}
              />
            ))}
          </div>
        </div>
        

      </div>
    </div>
  )
}

export default FeedPage 