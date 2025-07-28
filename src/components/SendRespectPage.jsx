import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { respectService } from '../api'
import Header from './Header'
import BackButton from './common/BackButton'

const SendRespectPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get song data from navigation state or use defaults
  const songData = location.state || {
    songId: '1',
    songTitle: 'Gidiyorum',
    artistName: 'Sezen Aksu',
    songCover: '/src/assets/respect.png',
    currentRespect: '1,247'
  }

  const respectAmounts = [20, 50, 100, 200, 500, 1000]

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value)
    setSelectedAmount(null)
  }

  const handleSendRespect = async () => {
    const amount = selectedAmount || parseInt(customAmount)
    if (!amount || amount <= 0) {
      setError('Geçerli bir miktar seçin')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      await respectService.sendRespectToSong(songData.songId, amount)
      
      console.log(`${songData.songTitle} şarkısına ${amount} respect başarıyla gönderildi`)
      
      // Navigate back to the song page after successful respect send
      navigate(`/song/${songData.songId}`)
    } catch (err) {
      setError(err.message || 'Respect gönderilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="send-respect-page">
      <div className="respect-header mobile-only" style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        padding: '16px 20px',
        background: 'transparent'
      }}>
        <BackButton />
      </div>
      <Header />

      <div className="respect-main-container">
        {/* Sol Bölüm - Sadece Masaüstünde Görünür */}
        <div className="respect-left-panel desktop-only">
          {/* Hızlı Gönderim Butonu */}
          <div className="quick-send-section">
            <h3 className="panel-title">Hızlı Gönderim</h3>
            <button 
              className="quick-send-button"
              onClick={() => handleAmountSelect(100)}
              disabled={loading}
            >
              100 Respect Gönder
            </button>
          </div>

          {/* Sanatçı Teşekkür Mesajı */}
          <div className="artist-thanks-section">
            <h3 className="panel-title">Sanatçı Mesajı</h3>
            <div className="thanks-message">
              <div className="artist-avatar">
                <img src="/src/assets/user/Image.png" alt="Sanatçı" />
              </div>
              <div className="thanks-text">
                <p>"Desteğiniz için çok teşekkür ederim! Müziğimi sevdiğiniz için mutluyum."</p>
                <span className="artist-signature">- {songData.artistName}</span>
              </div>
            </div>
          </div>

          {/* İstatistik Bildirimleri */}
          <div className="stats-section">
            <h3 className="panel-title">İstatistikler</h3>
            <div className="stat-item">
              <p>Bugün bu şarkıya respect gönderen <strong>18. kişisiniz</strong></p>
            </div>
          </div>

          {/* Son Respect Göndericiler */}
          <div className="recent-supporters-section">
            <h3 className="panel-title">Son Respect Gönderen 5 Kişi</h3>
            <div className="recent-supporters-list">
              {[
                { name: 'Ahmet K.', amount: 200, time: '2 dk önce' },
                { name: 'Ayşe M.', amount: 150, time: '5 dk önce' },
                { name: 'Mehmet Y.', amount: 100, time: '8 dk önce' },
                { name: 'Fatma S.', amount: 50, time: '12 dk önce' },
                { name: 'Ali R.', amount: 300, time: '15 dk önce' }
              ].map((supporter, index) => (
                <div key={index} className="supporter-item">
                  <div className="supporter-avatar">
                    <img src={`/src/assets/user/Image (${index + 1}).png`} alt={supporter.name} />
                  </div>
                  <div className="supporter-info">
                    <span className="supporter-name">{supporter.name}</span>
                    <span className="supporter-amount">{supporter.amount} Respect</span>
                  </div>
                  <span className="supporter-time">{supporter.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Bölüm - Mevcut Respect Content */}
        <div className="respect-content">
          <div className="song-info-section">
            <div className="song-cover">
              <img src={songData.songCover} alt={songData.songTitle} />
            </div>
            <div className="song-details">
              <h2 className="song-name">{songData.songTitle}</h2>
              <p className="artist-name">{songData.artistName}</p>
            </div>
          </div>

          <div className="amount-selection">
            <h3 className="section-title">Miktar Seç</h3>
            
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <div className="amount-grid">
              {respectAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`amount-button ${selectedAmount === amount ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(amount)}
                  disabled={loading}
                >
                  {amount} Respect
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Miktar girin"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="custom-amount-input"
              disabled={loading}
            />
          </div>

          <button 
            className="send-support-button"
            onClick={handleSendRespect}
            disabled={(!selectedAmount && !customAmount) || loading}
          >
            {loading ? 'Gönderiliyor...' : 'Gönder ve Destekle'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SendRespectPage 