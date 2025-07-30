import React from 'react'
import { useAppContext } from '../context/AppContext'

const UserStats = ({ userData }) => {
  const { state } = useAppContext()
  const { user } = state
  
  // Use passed userData or fallback to context user
  const displayData = userData || {
    respect_balance: user?.user_metadata?.respect_balance || 1000
  }
  
  return (
    <div className="user-stats">
      <div className="stat-card">
        <div className="stat-label">Gönderilen Respect</div>
        <div className="stat-value">{displayData.respect_balance?.toLocaleString() || '1,000'}</div>
        <div className="stat-change positive">+12%</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">Şu Anda Dinliyor</div>
        <div className="stat-song">Gece Serennâdı</div>
        <div className="stat-count">0</div>
      </div>
    </div>
  )
}

export default UserStats 