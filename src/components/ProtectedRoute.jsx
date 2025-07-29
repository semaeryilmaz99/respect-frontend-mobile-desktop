import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { state } = useAppContext()
  const { isAuthenticated, loading, onboardingCompleted } = state

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  // If onboarding is not completed, always redirect to onboarding
  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect to feed if user is authenticated but trying to access public routes
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/feed" replace />
  }

  return children
}

export default ProtectedRoute 