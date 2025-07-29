import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/header-responsive.css'
import './styles/feed-desktop.css'

// Context Provider
import { AppProvider } from './context/AppContext'

// Import all page components
import OnboardingPage from './components/OnboardingPage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import AuthCallback from './components/AuthCallback'
import FeedPage from './components/FeedPage'
import ArtistPage from './components/ArtistPage'
import SongPage from './components/SongPage'
import SendRespectPage from './components/SendRespectPage'
import UserPage from './components/UserPage'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/Toast'

function App() {

  return (
    <ErrorBoundary>
      <AppProvider>
    <Router>
      <div className="App">
        {/* Sidebar */}
            <Sidebar />
            
            {/* Toast Container */}
            <ToastContainer />
        
        <Routes>
            {/* Onboarding route - Special case without ProtectedRoute */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            {/* Auth callback route - For OAuth providers */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Public routes - Only accessible when not authenticated */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={
              <ProtectedRoute requireAuth={false}>
                <SignupPage />
              </ProtectedRoute>
            } />
            <Route path="/forgot-password" element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - Only accessible when authenticated */}
            <Route path="/feed" element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            } />
            <Route path="/artist/:id" element={
              <ProtectedRoute>
                <ArtistPage />
              </ProtectedRoute>
            } />
            <Route path="/song/:id" element={
              <ProtectedRoute>
                <SongPage />
              </ProtectedRoute>
            } />
            <Route path="/send-respect" element={
              <ProtectedRoute>
                <SendRespectPage />
              </ProtectedRoute>
            } />
            <Route path="/user/:id" element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            } />
          
          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </div>
    </Router>
    </AppProvider>
  </ErrorBoundary>
  )
}

export default App
