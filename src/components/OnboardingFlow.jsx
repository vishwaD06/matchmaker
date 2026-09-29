import { useState, useEffect } from 'react'
import WelcomeScreen from './onboarding/WelcomeScreen'
import BasicInfoScreen from './onboarding/BasicInfoScreen'
import PhotoUploadScreen from './onboarding/PhotoUploadScreen'
import PreferencesScreen from './onboarding/PreferencesScreen'
import AIInterviewScreen from './onboarding/AIInterviewScreen'
import ProfilePreviewScreen from './onboarding/ProfilePreviewScreen'

function OnboardingFlow({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState({
    // Basic info
    name: '',
    age: '',
    gender: '',
    
    // Photos
    photos: [],
    
    // Preferences
    ageRange: { min: 18, max: 50 },
    maxDistance: 50,
    genderPreference: '',
    
    // Interview data
    interviewSession: null,
    interviewResponses: [],
    extractedTraits: null,
    
    // Profile completion
    bio: ''
  })

  const totalSteps = 6

  const steps = [
    { component: WelcomeScreen, title: 'Welcome' },
    { component: BasicInfoScreen, title: 'Basic Info' },
    { component: PhotoUploadScreen, title: 'Photos' },
    { component: PreferencesScreen, title: 'Preferences' },
    { component: AIInterviewScreen, title: 'AI Interview' },
    { component: ProfilePreviewScreen, title: 'Preview' },
  ]

  const handleNext = (data) => {
    setOnboardingData(prev => ({ ...prev, ...data }))
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    // Here you would send the complete onboarding data to your backend
    console.log('Onboarding complete:', onboardingData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onComplete(onboardingData)
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <div className="w-6" /> {/* Spacer for balance */}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <CurrentStepComponent
            data={onboardingData}
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === totalSteps - 1}
          />
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow
