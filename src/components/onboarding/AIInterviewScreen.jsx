import { useState, useEffect, useRef } from 'react'
import { apiService } from '../../services/api'

function AIInterviewScreen({ data, onNext, onBack }) {
  const [session, setSession] = useState(data.interviewSession)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [extractedTraits, setExtractedTraits] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Start interview when component mounts
    startInterview()
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startInterview = async () => {
    try {
      setIsTyping(true)
      const response = await apiService.startInterview()
      setSession(response)
      
      // Add first AI message
      setMessages([
        {
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        }
      ])
      setIsTyping(false)
    } catch (error) {
      console.error('Failed to start interview:', error)
      setIsTyping(false)
      // For demo purposes, add a default message
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'm here to get to know you better. Let's start with a simple question: Tell me about yourself and what you're looking for in a connection.",
          timestamp: new Date()
        }
      ])
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return

    const userMessage = currentMessage.trim()
    setCurrentMessage('')
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }])

    try {
      setIsTyping(true)
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a response based on the conversation
      const responses = [
        "That's interesting! Can you tell me more about your core values in life and relationships?",
        "How would you describe your communication style with others?",
        "What activities or interests bring you the most joy?",
        "What are some things you absolutely cannot compromise on in a relationship?",
        "Thank you for sharing that with me. I'm getting a good sense of who you are. Let me ask one more question...",
        "Perfect! I've learned a lot about you. Your personality profile is now complete."
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      }])

      // Check if interview should be complete (demo logic)
      if (messages.length >= 4) {
        setIsComplete(true)
        setExtractedTraits({
          personality_traits: {
            openness: 'high',
            conscientiousness: 'medium',
            extraversion: 'medium',
            agreeableness: 'high',
            emotional_stability: 'high'
          },
          values: ['authenticity', 'growth', 'connection'],
          communication_style: 'thoughtful and direct',
          interests: ['outdoor activities', 'meaningful conversations', 'personal growth'],
          dealbreakers: ['dishonesty', 'lack of empathy']
        })
      }
      
      setIsTyping(false)
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSkip = () => {
    // Allow user to skip interview
    setIsComplete(true)
    setExtractedTraits({
      personality_traits: {},
      values: [],
      communication_style: 'Not specified',
      interests: [],
      dealbreakers: []
    })
  }

  const handleNext = () => {
    onNext({
      interviewSession: session,
      interviewResponses: messages,
      extractedTraits
    })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Let's get to know you
        </h1>
        <p className="text-gray-600">
          Have a conversation with our AI to help us find your perfect match
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!isComplete && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              Skip interview
            </button>
          </div>
        )}

        {/* Complete State */}
        {isComplete && (
          <div className="border-t border-gray-200 p-4 bg-green-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">✅</div>
              <div>
                <p className="font-medium text-gray-900">Interview Complete!</p>
                <p className="text-sm text-gray-600">Your personality profile has been created.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isComplete}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isComplete ? 'Continue' : 'Complete Interview'}
        </button>
      </div>
    </div>
  )
}

export default AIInterviewScreen
