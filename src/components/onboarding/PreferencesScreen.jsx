import { useState } from 'react'

function PreferencesScreen({ data, onNext, onBack }) {
  const [preferences, setPreferences] = useState({
    ageRange: data.ageRange || { min: 18, max: 50 },
    maxDistance: data.maxDistance || 50,
    genderPreference: data.genderPreference || ''
  })

  const handleAgeRangeChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      ageRange: {
        ...prev.ageRange,
        [type]: parseInt(value)
      }
    }))
  }

  const handleGenderPreference = (gender) => {
    setPreferences(prev => ({
      ...prev,
      genderPreference: prev.genderPreference === gender ? '' : gender
    }))
  }

  const handleNext = () => {
    onNext(preferences)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Your preferences
        </h1>
        <p className="text-gray-600">
          Tell us what you're looking for in a match
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        {/* Age Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Age Range: {preferences.ageRange.min} - {preferences.ageRange.max}
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min</label>
              <input
                type="range"
                min="18"
                max="50"
                value={preferences.ageRange.min}
                onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max</label>
              <input
                type="range"
                min="18"
                max="100"
                value={preferences.ageRange.max}
                onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Maximum Distance: {preferences.maxDistance} miles
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={preferences.maxDistance}
            onChange={(e) => setPreferences(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5 miles</span>
            <span>100 miles</span>
          </div>
        </div>

        {/* Gender Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Interested in
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Men', 'Women', 'Everyone'].map((option) => {
              const value = option === 'Everyone' ? '' : option.slice(0, -1) // Remove 's' for API
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleGenderPreference(value)}
                  className={`px-4 py-3 border-2 rounded-xl font-medium transition-colors ${
                    (preferences.genderPreference === value && value !== '') || 
                    (preferences.genderPreference === '' && option === 'Everyone')
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            💡 These preferences help us find better matches, but our AI also considers personality compatibility beyond these filters.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default PreferencesScreen
