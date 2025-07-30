import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import { useAppContext } from '../context/AppContext.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { actions } = useAppContext()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error.message)
          navigate('/login?error=auth_failed')
          return
        }

        if (data.session) {
          // Store user data
          const user = data.session.user
          localStorage.setItem('authToken', data.session.access_token)
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email,
            respectBalance: 1000
          }))

          // Update app context
          actions.setUser({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email,
            respectBalance: 1000,
            token: data.session.access_token
          })

          // Complete onboarding if not done
          actions.completeOnboarding()

          // Check if user has completed profile
          const hasProfile = user.user_metadata?.full_name && 
                           user.user_metadata?.username
          
          if (hasProfile) {
            // User has profile, go to feed
            navigate('/feed')
          } else {
            // New user, go to profile settings
            navigate('/profile/settings')
          }
        } else {
          // No session, redirect to login
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback processing error:', error)
        navigate('/login?error=processing_failed')
      }
    }

    handleAuthCallback()
  }, [navigate, actions])

  return (
    <div className="auth-callback-page">
      <div className="auth-callback-container">
        <LoadingSpinner size="large" text="Giriş işleminiz tamamlanıyor..." />
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Lütfen bekleyin...
        </p>
      </div>
    </div>
  )
}

export default AuthCallback 