function WelcomeScreen({ onNext, isFirstStep }) {
  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">👋</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Wavelength
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're excited to help you find meaningful connections. Let's set up your profile in just a few minutes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Interview</h3>
          <p className="text-sm text-gray-600">
            Quick conversation to understand your personality
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-3">📸</div>
          <h3 className="font-semibold text-gray-900 mb-2">Add Photos</h3>
          <p className="text-sm text-gray-600">
            Show your authentic self
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-3">⚙️</div>
          <h3 className="font-semibold text-gray-900 mb-2">Set Preferences</h3>
          <p className="text-sm text-gray-600">
            Tell us what you're looking for
          </p>
        </div>
      </div>

      <button
        onClick={() => onNext({})}
        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg w-full max-w-xs"
      >
        Let's Get Started
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Takes about 5 minutes • No credit card required
      </p>
    </div>
  )
}

export default WelcomeScreen
