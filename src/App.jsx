import { useState, useEffect } from 'react'
import OnboardingFlow from './components/OnboardingFlow'
import LandingPage from './components/LandingPage'
import { apiService } from './services/api'

function App() {
  const [currentView, setCurrentView] = useState('landing') // 'landing', 'onboarding', 'app'
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (token) {
      checkAuth()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const userData = await apiService.getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)
      
      // Redirect based on profile completion
      if (userData.profile_complete) {
        setCurrentView('app')
      } else {
        setCurrentView('onboarding')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      setIsAuthenticated(false)
    }
  }

  const handleStartOnboarding = () => {
    setCurrentView('onboarding')
  }

  const handleOnboardingComplete = (userData) => {
    setUser(userData)
    setCurrentView('app')
  }

  const handleLogout = () => {
    apiService.logout()
    setUser(null)
    setIsAuthenticated(false)
    setCurrentView('landing')
  }

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'landing' && (
        <LandingPage 
          onStartOnboarding={handleStartOnboarding}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      )}
      
      {currentView === 'onboarding' && (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          onCancel={() => setCurrentView('landing')}
        />
      )}
      
      {currentView === 'app' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Wavelength!</h1>
            <p className="text-gray-600 mb-4">Your profile is complete and ready to find matches.</p>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
