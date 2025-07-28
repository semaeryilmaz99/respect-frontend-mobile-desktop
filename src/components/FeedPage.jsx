import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import FeedCard from './FeedCard'
import RealTimeChat from './RealTimeChat'

const FeedPage = () => {
  const [activeTab, setActiveTab] = useState('community')
  const navigate = useNavigate()
  
  const handleRespectSend = () => {
    navigate('/send-respect')
  }

  // Respect Akışı verileri (desktop sol panel için)
  const respectFlowData = [
    {
      id: 1,
      user: { name: 'Ahmet Yılmaz', avatar: '/src/assets/user/Image.png' },
      artist: { name: 'Sezen Aksu', avatar: '/src/assets/artist/Image.png' },
      song: { title: 'Gidiyorum', cover: '/src/assets/song/Image.png' },
      amount: 50,
      time: '2 dakika önce',
      message: 'Bu şarkı harika!'
    },
    {
      id: 2,
      user: { name: 'Ayşe Demir', avatar: '/src/assets/user/Image (1).png' },
      artist: { name: 'Tarkan', avatar: '/src/assets/artist/Image (1).png' },
      song: { title: 'Dudu', cover: '/src/assets/song/Image (1).png' },
      amount: 100,
      time: '5 dakika önce',
      message: 'Efsane şarkı!'
    },
    {
      id: 3,
      user: { name: 'Mehmet Öz', avatar: '/src/assets/user/Image (2).png' },
      artist: { name: 'Ajda Pekkan', avatar: '/src/assets/artist/Image (2).png' },
      song: { title: 'Pet\'r Oil', cover: '/src/assets/song/Image (2).png' },
      amount: 25,
      time: '8 dakika önce'
    },
    {
      id: 4,
      user: { name: 'Fatma Şen', avatar: '/src/assets/user/Image (3).png' },
      artist: { name: 'Barış Manço', avatar: '/src/assets/artist/Image (3).png' },
      song: { title: 'Dağlar Dağlar', cover: '/src/assets/song/Image (3).png' },
      amount: 200,
      time: '15 dakika önce',
      message: 'Barış Manço\'nun sesi mükemmel!'
    },
    {
      id: 5,
      user: { name: 'Ali Kaya', avatar: '/src/assets/user/Image (4).png' },
      artist: { name: 'Cem Karaca', avatar: '/src/assets/artist/Image (4).png' },
      song: { title: 'Resimdeki Gözyaşları', cover: '/src/assets/song/Image (4).png' },
      amount: 75,
      time: '20 dakika önce'
    }
  ]

  // Topluluk sekmesi verileri
  const communityFeedData = [
    {
      type: 'trending-song',
      title: 'Bu hafta en çok respect alan şarkı: Sezen Aksu - Gidiyorum (2,847 respect)',
      buttonText: 'Dinle',
      profileImage: '/src/assets/song/Image.png'
    },
    {
      type: 'new-release',
      title: 'Yeni şarkı yayınlandı: Tarkan - Yeni Aşk',
      buttonText: 'Dinle',
      profileImage: '/src/assets/artist/Image (1).png'
    },
    {
      type: 'chat-reply',
      title: 'Ajda Pekkan - Bambaşka şarkısında hayranlarına cevap verdi',
      buttonText: 'Sohbete Katıl',
      profileImage: '/src/assets/artist/Image (2).png'
    },
    {
      type: 'trending-artist',
      title: 'Bu ayın trending sanatçısı: Barış Manço (15,482 respect)',
      buttonText: 'Profili Gör',
      profileImage: '/src/assets/artist/Image (3).png'
    },
    {
      type: 'respect-notification',
      title: 'Kullanıcı @musiclover23 Ahmet Kaya - İşte Gidiyorum şarkısına 10 respect gönderdi',
      buttonText: 'Profili Gör',
      profileImage: '/src/assets/user/Image.png'
    }
  ]

  // Sana Özel sekmesi verileri
  const personalFeedData = [
    {
      type: 'followed-respect',
      title: 'Takip ettiğin Sezen Aksu - Gidiyorum şarkısına yeni respectler geldi (47 yeni respect)',
      buttonText: 'Dinle',
      profileImage: '/src/assets/artist/Image.png'
    },
    {
      type: 'followed-new-song',
      title: 'Takip ettiğin sanatçı Cem Karaca yeni şarkı yayınladı: "Yeni Türkü"',
      buttonText: 'Dinle',
      profileImage: '/src/assets/artist/Image (4).png'
    },
    {
      type: 'followed-chat',
      title: 'Takip ettiğin Barış Manço - Gülpembe şarkısında yeni sohbet cevabı',
      buttonText: 'Sohbete Katıl',
      profileImage: '/src/assets/artist/Image (5).png'
    },
    {
      type: 'chat-reply',
      title: 'Ahmet Kaya - İşte Gidiyorum şarkısındaki mesajına @fan_ahmet cevap verdi',
      buttonText: 'Sohbete Katıl',
      profileImage: '/src/assets/user/Image (1).png'
    },
    {
      type: 'followed-respect',
      title: 'Takip ettiğin Ajda Pekkan sanatçısına 128 yeni respect gönderildi',
      buttonText: 'Profili Gör',
      profileImage: '/src/assets/artist/Image (6).png'
    }
  ]

  const currentData = activeTab === 'community' ? communityFeedData : personalFeedData

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