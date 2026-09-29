function ProfilePreviewScreen({ data, onNext, onBack }) {
  const { name, age, gender, photos, extractedTraits, ageRange, maxDistance, genderPreference } = data

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Almost done!
        </h1>
        <p className="text-gray-600">
          Review your profile before we start finding matches
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Photos */}
          <div className="relative">
            {photos.length > 0 ? (
              <img
                src={photos[0]}
                alt="Main profile photo"
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <div className="text-6xl">👤</div>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full">
              <p className="font-bold text-gray-900">
                {name}, {age}
              </p>
              <p className="text-sm text-gray-600">{gender}</p>
            </div>
          </div>

          {/* Additional Photos */}
          {photos.length > 1 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto">
                {photos.slice(1).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 2}`}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-6 space-y-4">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 text-sm">
                {name} is a {age}-year-old {gender.toLowerCase()} looking for meaningful connections.
              </p>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Looking for</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Ages {ageRange.min} - {ageRange.max}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Within {maxDistance} miles
                </span>
                {genderPreference && (
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                    {genderPreference}s
                  </span>
                )}
              </div>
            </div>

            {/* AI Traits */}
            {extractedTraits && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personality Insights</h3>
                <div className="space-y-2">
                  {extractedTraits.communication_style && (
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">💬</span>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Communication:</span> {extractedTraits.communication_style}
                      </p>
                    </div>
                  )}
                  
                  {extractedTraits.values && extractedTraits.values.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600">💜</span>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Values:</span> {extractedTraits.values.join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {extractedTraits.interests && extractedTraits.interests.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-pink-600">✨</span>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Interests:</span> {extractedTraits.interests.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <button className="w-full mt-4 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          Edit Profile
        </button>
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
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Complete Profile
        </button>
      </div>
    </div>
  )
}

export default ProfilePreviewScreen