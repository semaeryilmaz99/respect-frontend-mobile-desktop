import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUI, useAppContext } from '../context/AppContext'
import authService from '../api/authService'

const Sidebar = () => {
  const navigate = useNavigate()
  const { sidebarOpen, closeSidebar } = useUI()
  const { actions } = useAppContext()

  const handleNavigation = (path) => {
    navigate(path)
    closeSidebar() // Sidebar'ı kapat
  }

  const handleLogout = async () => {
    try {
      console.log('🔐 Attempting logout with Supabase...')
      
      // Supabase logout
      await authService.logout()
      
      // Context logout
      actions.logout()
      
      console.log('✅ Logout successful')
      
      // Navigate to login
      navigate('/login')
      closeSidebar()
      
    } catch (error) {
      console.error('❌ Logout error:', error)
      
      // Force logout even if API fails
      actions.logout()
      navigate('/login')
      closeSidebar()
    }
  }

  const menuItems = [
    {
      label: 'Ana Sayfa',
      path: '/feed',
      action: () => handleNavigation('/feed')
    },
    {
      label: 'Sanatçılar',
      path: '/artist/1',
      action: () => handleNavigation('/artist/1')
    },
    {
      label: 'Şarkılar',
      path: '/song/1',
      action: () => handleNavigation('/song/1')
    },
    {
      label: 'Respect Gönder',
      path: '/send-respect',
      action: () => handleNavigation('/send-respect')
    },
    {
      label: 'Profil Ayarları',
      path: '/profile',
      action: () => handleNavigation('/profile')
    },
    {
      label: 'Çıkış',
      action: handleLogout
    }
  ]

  return (
    <>
      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={closeSidebar}>
            ✕
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="sidebar-nav-item"
                onClick={item.action}
              >
                <span className="nav-item-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="User" />
            </div>
            <div className="user-details">
              <p className="user-name">Kullanıcı Adı</p>
              <p className="user-respect">1,247 Respect</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 