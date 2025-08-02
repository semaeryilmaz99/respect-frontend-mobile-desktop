import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import userService from '../api/userService'
import LoadingSpinner from './LoadingSpinner'

const UserTopArtists = () => {
  const { state } = useAppContext()
  const { user } = state
  
  const [topArtists, setTopArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTopArtists = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const artists = await userService.getTopRespectedArtists(user.id, 6)
        setTopArtists(artists)
      } catch (error) {
        console.error('Error fetching top artists:', error)
        setError('Sanatçı bilgileri yüklenirken hata oluştu')
        
        // Fallback to mock data
        setTopArtists([
          { id: 1, name: "Arctic Monkeys", total_respect: 450, image_url: "/src/assets/artist/Image.png" },
          { id: 2, name: "Tame Impala", total_respect: 380, image_url: "/src/assets/artist/Image (1).png" },
          { id: 3, name: "The Strokes", total_respect: 320, image_url: "/src/assets/artist/Image (2).png" },
          { id: 4, name: "Mac DeMarco", total_respect: 280, image_url: "/src/assets/artist/Image (3).png" },
          { id: 5, name: "King Krule", total_respect: 250, image_url: "/src/assets/artist/Image (4).png" },
          { id: 6, name: "Radiohead", total_respect: 220, image_url: "/src/assets/artist/Image (5).png" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTopArtists()
  }, [user])

  if (loading) {
    return (
      <div className="user-top-artists">
        <h3 className="section-title">En Çok Desteklediği Sanatçılar</h3>
        <LoadingSpinner />
      </div>
    )
  }

  if (error && topArtists.length === 0) {
    return (
      <div className="user-top-artists">
        <h3 className="section-title">En Çok Desteklediği Sanatçılar</h3>
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="user-top-artists">
      <h3 className="section-title">En Çok Desteklediği Sanatçılar</h3>
      
      {topArtists.length === 0 ? (
        <div className="empty-state">
          <p>Henüz hiç sanatçıya respect göndermemiş</p>
        </div>
      ) : (
        <div className="top-artists-grid">
          {topArtists.map((artist, index) => (
            <div key={artist.id} className={`top-artist-card ${index === 0 ? 'top-respecter' : ''}`}>
              {index === 0 && (
                <div className="top-respecter-badge">TOP RESPECTER</div>
              )}
                             <div className="top-artist-image">
                 <img 
                   src={artist.avatar_url || `/src/assets/artist/Image (${(index % 6) + 1}).png`} 
                   alt={artist.name} 
                 />
               </div>
              <h4 className="top-artist-name">{artist.name}</h4>
              <p className="top-artist-respect">{artist.total_respect} Respect</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserTopArtists 