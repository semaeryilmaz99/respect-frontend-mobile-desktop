import React from 'react'
import { useNavigate } from 'react-router-dom'

const SongsList = () => {
  const navigate = useNavigate()
  
  const songs = [
    {
      id: 1,
      title: "Gidiyorum",
      artist: "Sezen Aksu",
      cover: "/src/assets/song/Image.png"
    },
    {
      id: 2,
      title: "Şarkı Söyleyemem",
      artist: "Sezen Aksu", 
      cover: "/src/assets/song/Image (1).png"
    },
    {
      id: 3,
      title: "Kaybolan Yıllar",
      artist: "Sezen Aksu", 
      cover: "/src/assets/song/Image (2).png"
    }
  ]

  const handleSongClick = (song) => {
    // Şarkıya tıklandığında song sayfasına yönlendir
    navigate(`/song/${song.id}`, {
      state: {
        songId: song.id,
        songTitle: song.title,
        artistName: song.artist,
        songCover: song.cover,
        currentRespect: '1,247' // Örnek respect sayısı
      }
    })
  }

  return (
    <div className="songs-list">
      <h3 className="section-title">Şarkılar</h3>
      
      <div className="songs-container">
        {songs.map((song) => (
          <div 
            key={song.id} 
            className="song-item"
            onClick={() => handleSongClick(song)}
            style={{ cursor: 'pointer' }}
          >
            <div className="song-cover">
              <img src={song.cover} alt={`${song.title} kapağı`} />
            </div>
            
            <div className="song-info">
              <h4 className="song-title">{song.title}</h4>
              <p className="song-artist">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SongsList 