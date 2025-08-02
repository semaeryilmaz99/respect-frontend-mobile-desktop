import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import userService from '../api/userService'
import LoadingSpinner from './LoadingSpinner'

const UserRecentRespects = () => {
  const { state } = useAppContext()
  const { user } = state
  
  const [recentRespects, setRecentRespects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecentRespects = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const respects = await userService.getRecentRespectTransactions(user.id, 8)
        setRecentRespects(respects)
      } catch (error) {
        console.error('Error fetching recent respects:', error)
        setError('Son respect gönderimleri yüklenirken hata oluştu')
        
        // Fallback to mock data
        setRecentRespects([
          { 
            id: 1, 
            amount: 50, 
            recipient_name: "Arctic Monkeys", 
            recipient_image: "/src/assets/artist/Image.png",
            item_title: "Do I Wanna Know?",
            transaction_type: "song",
            created_at: new Date().toISOString()
          },
          { 
            id: 2, 
            amount: 30, 
            recipient_name: "Tame Impala", 
            recipient_image: "/src/assets/artist/Image (1).png",
            transaction_type: "artist",
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          { 
            id: 3, 
            amount: 25, 
            recipient_name: "The Strokes", 
            recipient_image: "/src/assets/artist/Image (2).png",
            item_title: "Last Nite",
            transaction_type: "song",
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentRespects()
  }, [user])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Az önce'
    if (diffInHours < 24) return `${diffInHours} saat önce`
    if (diffInHours < 48) return 'Dün'
    return date.toLocaleDateString('tr-TR')
  }

  if (loading) {
    return (
      <div className="user-recent-respects">
        <h3 className="section-title">Son Respect Gönderimleri</h3>
        <LoadingSpinner />
      </div>
    )
  }

  if (error && recentRespects.length === 0) {
    return (
      <div className="user-recent-respects">
        <h3 className="section-title">Son Respect Gönderimleri</h3>
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="user-recent-respects">
      <h3 className="section-title">Son Respect Gönderimleri</h3>
      
      {recentRespects.length === 0 ? (
        <div className="empty-state">
          <p>Henüz hiç respect göndermemiş</p>
        </div>
      ) : (
        <div className="recent-respects-list">
          {recentRespects.map((respect) => (
            <div key={respect.id} className="recent-respect-item">
              <div className="recent-respect-image">
                <img 
                  src={respect.recipient_image || "/src/assets/artist/Image.png"} 
                  alt={respect.recipient_name} 
                />
              </div>
              <div className="recent-respect-info">
                <h4 className="recent-respect-recipient">{respect.recipient_name}</h4>
                {respect.item_title && (
                  <p className="recent-respect-song">{respect.item_title}</p>
                )}
                <p className="recent-respect-time">{formatDate(respect.created_at)}</p>
              </div>
              <div className="recent-respect-amount">
                <span className="respect-amount">+{respect.amount}</span>
                <span className="respect-label">Respect</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserRecentRespects 