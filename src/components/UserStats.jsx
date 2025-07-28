import React from 'react'

const UserStats = () => {
  return (
    <div className="user-stats">
      <div className="stat-card">
        <div className="stat-label">Gönderilen Respect</div>
        <div className="stat-value">1,234</div>
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