import React from 'react'
import { useNavigate } from 'react-router-dom'

const FeedCard = ({ type, title, buttonText, profileImage, artistId, songId, userId }) => {
  const navigate = useNavigate()
  const getCardLabel = (type) => {
    switch (type) {
      case 'respect-activity':
        return 'Respect Activity'
      case 'chat-reply':
        return 'Chat Reply'
      case 'new-release':
        return 'New Release'
      case 'followed-respect':
        return 'Followed Respect'
      case 'followed-new-song':
        return 'Followed New Song'
      case 'followed-chat':
        return 'Followed Chat'
      case 'trending-song':
        return 'Trending Song'
      case 'trending-artist':
        return 'Trending Artist'
      case 'respect-notification':
        return 'Respect Notification'
      default:
        return 'Activity Card'
    }
  }

  const handleButtonClick = () => {
    switch (type) {
      case 'trending-song':
      case 'new-release':
      case 'followed-respect':
      case 'followed-new-song':
        // If button text suggests respect sending, go to send respect page
        if (buttonText?.toLowerCase().includes('respect') || buttonText?.toLowerCase().includes('gönder')) {
          navigate('/send-respect', {
            state: {
              songId: songId || '1',
              songTitle: title.split(':')[1]?.split('-')[0]?.trim() || 'Bilinmeyen Şarkı',
              artistName: title.split('-')[1]?.trim() || 'Bilinmeyen Sanatçı',
              songCover: profileImage,
              currentRespect: '0'
            }
          })
        } else {
          navigate(songId ? `/song/${songId}` : '/song/1')
        }
        break
      case 'trending-artist':
        navigate(artistId ? `/artist/${artistId}` : '/artist/1')
        break
      case 'chat-reply':
      case 'followed-chat':
        navigate(songId ? `/song/${songId}` : '/song/1') // Navigate to song for chat
        break
      case 'respect-notification':
        navigate(userId ? `/user/${userId}` : '/profile')
        break
      default:
        console.log('Button clicked for:', type)
    }
  }

  return (
    <div className="feed-card" data-type={type}>
      <div className="card-label">
        {getCardLabel(type)}
      </div>
      
      <div className="card-content">
        <div className="card-top">
          <div className="card-text">
            <h3 className="card-title">{title}</h3>
          </div>
          
          <div className="profile-image-container">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="profile-image"
            />
          </div>
        </div>
        
        <button className="card-button" onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default FeedCard 