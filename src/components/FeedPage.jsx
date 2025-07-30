import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import FeedCard from './FeedCard'
import RealTimeChat from './RealTimeChat'
import feedService from '../api/feedService'

const FeedPage = () => {
  const [activeTab, setActiveTab] = useState('community')
  const [feedData, setFeedData] = useState([])
  const [respectFlowData, setRespectFlowData] = useState([])
  const [_topArtists, setTopArtists] = useState([])
  const [_topSongs, setTopSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  const handleRespectSend = () => {
    navigate('/send-respect')
  }

  // Database'den verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Aktif tab'a göre feed verilerini yükle
        if (activeTab === 'community') {
          // Topluluk feed'i - tüm kullanıcı aktiviteleri
          const feed = await feedService.getFeed()
          console.log('🔍 Community feed data:', feed)
          setFeedData(feed)
        } else if (activeTab === 'personal') {
          // Kişisel feed'i - takip edilen sanatçılar ve favori şarkılar
          const feed = await feedService.getPersonalFeed()
          console.log('🔍 Personal feed data:', feed)
          setFeedData(feed)
        }
        
        // Respect flow verilerini yükle
        const respectFlow = await feedService.getRespectFlow()
        setRespectFlowData(respectFlow)
        
        // Top artists yükle
        const artists = await feedService.getTopArtists()
        setTopArtists(artists)
        
        // Top songs yükle
        const songs = await feedService.getTopSongs()
        setTopSongs(songs)
        
      } catch (error) {
        console.error('❌ Feed data load error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [activeTab]) // activeTab değiştiğinde yeniden yükle

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
  if (loading) {
    return (
      <div className="feed-page">
        <Header />
        <div className="loading-container">
          <p>Veriler yükleniyor...</p>
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