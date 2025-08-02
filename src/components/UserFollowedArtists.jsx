import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import userService from '../api/userService'
import LoadingSpinner from './LoadingSpinner'

const UserFollowedArtists = () => {
  const { state } = useAppContext()
  const { user } = state
  
  const [followedArtists, setFollowedArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFollowedArtists = async () => {
      if (!user?.id) {
        console.log('❌ No user ID available')
        setLoading(false)
        return
      }

      console.log('🔄 Fetching followed artists for user:', user.id)

      try {
        setLoading(true)
        const artists = await userService.getFollowedArtists(user.id)
        console.log('📊 Received artists data:', artists)
        setFollowedArtists(artists)
      } catch (error) {
        console.error('❌ Error fetching followed artists:', error)
        setError('Takip edilen sanatçılar yüklenirken hata oluştu')
        
        // Fallback to mock data
        setFollowedArtists([
          { id: 1, name: "Arctic Monkeys", image_url: "/src/assets/artist/Image.png" },
          { id: 2, name: "Tame Impala", image_url: "/src/assets/artist/Image (1).png" },
          { id: 3, name: "The Strokes", image_url: "/src/assets/artist/Image (2).png" },
          { id: 4, name: "Mac DeMarco", image_url: "/src/assets/artist/Image (3).png" },
          { id: 5, name: "King Krule", image_url: "/src/assets/artist/Image (4).png" },
          { id: 6, name: "Radiohead", image_url: "/src/assets/artist/Image (5).png" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFollowedArtists()
  }, [user])

  if (loading) {
    return (
      <div className="user-followed-artists">
        <h3 className="section-title">Takip Ettiği Sanatçılar</h3>
        <LoadingSpinner />
      </div>
    )
  }

  if (error && followedArtists.length === 0) {
    return (
      <div className="user-followed-artists">
        <h3 className="section-title">Takip Ettiği Sanatçılar</h3>
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="user-followed-artists">
      <h3 className="section-title">Takip Ettiği Sanatçılar</h3>
      
      {followedArtists.length === 0 ? (
        <div className="empty-state">
          <p>Henüz hiç sanatçı takip etmiyor</p>
        </div>
      ) : (
        <div className="followed-artists-grid">
          {followedArtists.map((artist, index) => (
            <div key={artist.id} className="followed-artist-card">
                             <div className="followed-artist-image">
                 <img 
                   src={artist.avatar_url || `/src/assets/artist/Image (${(index % 6) + 1}).png`} 
                   alt={artist.name} 
                 />
               </div>
              <h4 className="followed-artist-name">{artist.name}</h4>
              <div className="followed-artist-status">
                <span className="following-badge">Takip Ediliyor</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserFollowedArtists 