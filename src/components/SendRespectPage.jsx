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
  )
}

export default SendRespectPage 