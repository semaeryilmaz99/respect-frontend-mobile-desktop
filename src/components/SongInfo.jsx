import React from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'

const SongInfo = () => {
  const navigate = useNavigate()
  const { id: songId } = useParams()
  const location = useLocation()

  // Navigation state'inden şarkı bilgilerini al, yoksa varsayılan değerleri kullan
  const songData = location.state || {
    songId: songId || '1',
    songTitle: 'Gidiyorum',
    artistName: 'Sezen Aksu',
    songCover: '/src/assets/song/Image.png',
    currentRespect: '1,247'
  }

  const handleSendRespect = () => {
    // Navigate to send respect page with song information as state
    navigate('/send-respect', {
      state: songData
    })
  }

  return (
    <div className="song-info">
      <div className="song-album-cover">
        <img src={songData.songCover} alt="Şarkı Kapağı" />
      </div>
      
      <div className="song-details">
        <div className="song-title-section">
          <h2 className="song-title">{songData.songTitle}</h2>
          <h3 className="song-subtitle">{songData.artistName}</h3>
          <p className="song-respect">{songData.currentRespect} Respect</p>
        </div>
        
        <div className="song-buttons">
          <button className="play-spotify-button">
            Spotify'da Dinle
          </button>
          <button className="send-respect-button" onClick={handleSendRespect}>
            Respect Gönder
          </button>
          
          <FavoriteButton 
            songId="550e8400-e29b-41d4-a716-446655440002" 
            initialFavoritesCount={342}
            size="medium"
          />
        </div>
      </div>
    </div>
  )
}

export default SongInfo 