import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUI } from '../context/AppContext'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSidebar } = useUI()
  const isFeedPage = location.pathname === '/feed'
  const isSendRespectPage = location.pathname === '/send-respect'
  
  return (
    <header className="header">
      <div className="header-content">
        <button className="menu-button" onClick={toggleSidebar}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        {/* Desktop'ta feed sayfasında arama motoru, send respect sayfasında "Respect Gönder", diğerlerinde title */}
        {isFeedPage ? (
          <>
            {/* Mobile'da title görünecek, desktop'ta gizlenecek */}
            <h1 className="app-title mobile-only">Respect Müzik</h1>
            
            {/* Desktop'ta arama motoru buraya gelecek */}
            <div className="search-container desktop-search">
              <div className="search-bar">
                <span className="search-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="sanatçı, şarkı veya kullanıcı ara"
                  className="search-input"
                />
              </div>
            </div>
          </>
        ) : isSendRespectPage ? (
          <>
            {/* Mobile'da normal title */}
            <h1 className="app-title mobile-only">Respect Müzik</h1>
            {/* Desktop'ta "Respect Gönder" yazısı */}
            <h1 className="app-title desktop-only">Respect Gönder</h1>
          </>
        ) : (
        <h1 className="app-title">Respect Müzik</h1>
        )}
        
        <button className="user-avatar" onClick={() => navigate('/profile')}>
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="User" />
        </button>
      </div>
      
      {/* Mobile'da feed sayfasında arama motoru alt tarafta kalacak */}
      {isFeedPage && (
        <div className="search-container mobile-search">
          <div className="search-bar">
            <span className="search-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="sanatçı, şarkı veya kullanıcı ara"
              className="search-input"
            />
          </div>
        </div>
      )}
      
      {/* Send respect sayfasında arama motoru yok */}
      {/* Diğer sayfalarda arama motoru alt tarafta */}
      {!isFeedPage && !isSendRespectPage && (
      <div className="search-container">
        <div className="search-bar">
          <span className="search-icon">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="sanatçı, şarkı veya kullanıcı ara"
            className="search-input"
          />
        </div>
      </div>
      )}
    </header>
  )
}

export default Header 