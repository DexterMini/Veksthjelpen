'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Minimize2, Maximize2, Volume2, VolumeX } from 'lucide-react'
import { FinanceGPTChatbot, ChatMessage, AIResponse, createChatbotInstance } from '@/lib/aiChatbot'
import { analytics } from '@/lib/analytics'

interface ChatBotProps {
  userProfile?: {
    name?: string
    income?: number
    creditScore?: 'excellent' | 'good' | 'fair' | 'poor'
    preferredLanguage?: 'no' | 'en'
  }
  onNavigate?: (route: string) => void
  className?: string
}

export default function ChatBot({ userProfile, onNavigate, className = '' }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false)
  const [chatbot, setChatbot] = useState<FinanceGPTChatbot | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Initialize chatbot
  useEffect(() => {
    const profileWithDefaults = userProfile ? {
      ...userProfile,
      preferredLanguage: userProfile.preferredLanguage || 'no' as const
    } : undefined
    const bot = createChatbotInstance(sessionId.current, profileWithDefaults)
    setChatbot(bot)
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: `welcome_${Date.now()}`,
      role: 'assistant',
      content: userProfile?.preferredLanguage === 'en' 
        ? "Hi! I'm FinanceGPT, your personal financial advisor. How can I help you today? 👋"
        : "Hei! Jeg er FinanceGPT, din personlige finansrådgiver. Hvordan kan jeg hjelpe deg i dag? 👋",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])

    // Track chatbot initialization
    analytics.trackPageView('chatbot_opened', { userProfile })
  }, [userProfile])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatbot || isLoading) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Track user message
      analytics.trackPageView('chatbot_message_sent', {
        message_length: inputValue.length,
        session_id: sessionId.current
      })

      // Get AI response
      const response: AIResponse = await chatbot.processMessage(inputValue.trim())
      
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        metadata: {
          intent: response.intent,
          confidence: response.confidence
        }
      }

      setMessages(prev => [...prev, assistantMessage])

      // Handle suggested actions
      if (response.suggestedActions) {
        response.suggestedActions.forEach(action => {
          if (action.type === 'navigate' && onNavigate) {
            // Don't auto-navigate, let user click
          }
        })
      }

      // Text-to-speech if enabled
      if (isSpeechEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response.message)
        utterance.lang = userProfile?.preferredLanguage === 'en' ? 'en-US' : 'nb-NO'
        speechSynthesis.speak(utterance)
      }

      // Track AI response
      analytics.trackPageView('chatbot_response_generated', {
        intent: response.intent,
        confidence: response.confidence,
        session_id: sessionId.current
      })

    } catch (error) {
      console.error('Chatbot error:', error)
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: userProfile?.preferredLanguage === 'en' 
          ? "I'm sorry, I encountered an error. Please try again."
          : "Beklager, jeg støtte på en feil. Vennligst prøv igjen.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled)
    if (isSpeechEnabled && 'speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  }

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br>')
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open FinanceGPT Chat"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <div>
              <h3 className="font-semibold text-sm">FinanceGPT Norge</h3>
              {!isMinimized && (
                <p className="text-xs text-blue-100">
                  {userProfile?.preferredLanguage === 'en' ? 'Your AI Financial Advisor' : 'Din AI Finansrådgiver'}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isMinimized && (
              <button
                onClick={toggleSpeech}
                className="p-1 hover:bg-blue-700 rounded"
                title={isSpeechEnabled ? 'Disable speech' : 'Enable speech'}
              >
                {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            )}
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-blue-700 rounded"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-700 rounded text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessageContent(message.content) 
                        }}
                      />
                      
                      {message.metadata?.confidence && message.role === 'assistant' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Confidence: {Math.round(message.metadata.confidence * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {/* Sample quick replies - in real implementation, these would come from the AI response */}
                  {['Sammenlign lån', 'Beregn avdrag', 'Søk nå', 'Mer info'].map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={userProfile?.preferredLanguage === 'en' 
                    ? "Ask me about loans, rates, or financial advice..." 
                    : "Spør meg om lån, renter, eller finansielle råd..."
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Hook for easy integration
export function useChatBot(userProfile?: ChatBotProps['userProfile']) {
  const [isVisible, setIsVisible] = useState(false)
  
  const showChatBot = () => setIsVisible(true)
  const hideChatBot = () => setIsVisible(false)
  
  return {
    isVisible,
    showChatBot,
    hideChatBot,
    ChatBotComponent: (props: Omit<ChatBotProps, 'userProfile'>) => (
      <ChatBot {...props} userProfile={userProfile} />
    )
  }
}