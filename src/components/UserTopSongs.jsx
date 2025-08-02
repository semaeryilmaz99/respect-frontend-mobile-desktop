import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import userService from '../api/userService'
import LoadingSpinner from './LoadingSpinner'

const UserTopSongs = () => {
  const { state } = useAppContext()
  const { user } = state
  
  const [topSongs, setTopSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTopSongs = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const songs = await userService.getTopRespectedSongs(user.id, 5)
        setTopSongs(songs)
      } catch (error) {
        console.error('Error fetching top songs:', error)
        setError('Şarkı bilgileri yüklenirken hata oluştu')
        
        // Fallback to mock data
        setTopSongs([
          { id: 1, title: "Do I Wanna Know?", artist_name: "Arctic Monkeys", total_respect: 85, cover_url: "/src/assets/song/Image.png" },
          { id: 2, title: "The Less I Know The Better", artist_name: "Tame Impala", total_respect: 72, cover_url: "/src/assets/song/Image (1).png" },
          { id: 3, title: "Last Nite", artist_name: "The Strokes", total_respect: 68, cover_url: "/src/assets/song/Image (2).png" },
          { id: 4, title: "Chamber of Reflection", artist_name: "Mac DeMarco", total_respect: 55, cover_url: "/src/assets/song/Image (3).png" },
          { id: 5, title: "Easy Easy", artist_name: "King Krule", total_respect: 42, cover_url: "/src/assets/song/Image (4).png" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTopSongs()
  }, [user])

  if (loading) {
    return (
      <div className="user-top-songs">
        <h3 className="section-title">En Çok Desteklediği Şarkılar</h3>
        <LoadingSpinner />
      </div>
    )
  }

  if (error && topSongs.length === 0) {
    return (
      <div className="user-top-songs">
        <h3 className="section-title">En Çok Desteklediği Şarkılar</h3>
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="user-top-songs">
      <h3 className="section-title">En Çok Desteklediği Şarkılar</h3>
      
      {topSongs.length === 0 ? (
        <div className="empty-state">
          <p>Henüz hiç şarkıya respect göndermemiş</p>
        </div>
      ) : (
        <div className="top-songs-grid">
          {topSongs.map((song, index) => (
            <div key={song.id} className="top-song-card">
              <div className="top-song-cover">
                <img 
                  src={song.cover_url || `/src/assets/song/Image (${(index % 5) + 1}).png`} 
                  alt={`${song.title} kapağı`} 
                />
              </div>
              <h4 className="top-song-title">{song.title}</h4>
              <p className="top-song-artist">{song.artist_name}</p>
              <p className="top-song-respect">{song.total_respect} Respect</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserTopSongs 