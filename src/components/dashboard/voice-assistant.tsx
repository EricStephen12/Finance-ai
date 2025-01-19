import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MicrophoneIcon, ChatBubbleBottomCenterTextIcon, SparklesIcon, XMarkIcon, ArrowUpIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { getAssistantResponse, generateFinancialPlan, analyzeFinancialScenario } from '@/lib/ai/assistant'

interface VoiceMessage {
  type: 'user' | 'assistant'
  text: string
  sentiment?: 'positive' | 'neutral' | 'concerned'
  suggestedActions?: string[]
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export default function VoiceAssistant() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      type: 'assistant',
      text: "Hi! I'm your AI-powered financial companion. I can help you with detailed financial analysis, personalized advice, and long-term planning. Feel free to type or speak your questions!",
      sentiment: 'positive'
    }
  ])
  const [messageHistory, setMessageHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [userMood, setUserMood] = useState<'happy' | 'neutral' | 'stressed'>('neutral')
  const [isExpanded, setIsExpanded] = useState(true)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)

    // Initialize speech recognition
    const initializeSpeechRecognition = () => {
      try {
        if (typeof window !== 'undefined' && (window.webkitSpeechRecognition || window.SpeechRecognition)) {
          const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
          const recognition = new SpeechRecognition()
          
          recognition.continuous = false
          recognition.interimResults = true
          recognition.lang = 'en-US'

          recognition.onstart = () => {
            setIsListening(true)
          }

          recognition.onresult = async (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0])
              .map(result => result.transcript)
              .join('')

            if (event.results[0].isFinal) {
              await processUserInput(transcript)
            }
          }

          recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
            addMessage({
              type: 'assistant',
              text: "I'm having trouble hearing you. Please try speaking again or type your question.",
              sentiment: 'concerned'
            })
          }

          recognition.onend = () => {
            setIsListening(false)
          }

          recognitionRef.current = recognition
          setIsSpeechSupported(true)
        } else {
          setIsSpeechSupported(false)
        }
      } catch (error) {
        console.error('Error initializing speech recognition:', error)
        setIsSpeechSupported(false)
      }
    }

    initializeSpeechRecognition()
    
    return () => {
      clearInterval(interval)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (error) {
          console.error('Error aborting speech recognition:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setTextInput(value)
    adjustTextareaHeight()

    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set a new timeout to process input after user stops typing
    if (value.trim()) {
      const timeout = setTimeout(() => {
        if (value.trim().length >= 3 && !isProcessing) {
          processUserInput(value)
        }
      }, 1000) // Wait 1 second after user stops typing
      setTypingTimeout(timeout)
    }
  }

  const processUserInput = async (input: string) => {
    if (!user?.id || !input.trim() || isProcessing) return

    setIsProcessing(true)
    try {
      // Add user message
      addMessage({
        type: 'user',
        text: input.trim()
      })

      // Update message history for context
      const updatedHistory = [
        ...messageHistory,
        { role: 'user', content: input.trim() }
      ]
      setMessageHistory(updatedHistory)

      // Get AI response
      const response = await getAssistantResponse(user.id, input.trim(), updatedHistory)

      // Add assistant message
      addMessage({
        type: 'assistant',
        text: response.text,
        sentiment: response.sentiment === 'negative' ? 'concerned' : response.sentiment,
        suggestedActions: response.suggestedActions
      })

      // Update message history with assistant's response
      setMessageHistory([
        ...updatedHistory,
        { role: 'assistant', content: response.text }
      ])

      // Update user mood based on the interaction
      setUserMood(
        response.sentiment === 'positive' ? 'happy' :
        response.sentiment === 'negative' ? 'stressed' :
        'neutral'
      )

    } catch (error: any) {
      console.error('Error processing input:', error)
      addMessage({
        type: 'assistant',
        text: error.message || "I apologize, but I'm having trouble processing your request right now.",
        sentiment: 'concerned'
      })
    } finally {
      setIsProcessing(false)
      setTextInput('')
    }
  }

  const handleVoiceCommand = () => {
    if (!isSpeechSupported || !recognitionRef.current) {
      addMessage({
        type: 'assistant',
        text: "I'm sorry, but voice recognition is not supported in your browser. You can still type your questions!",
        sentiment: 'concerned'
      })
      return
    }

    try {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
        addMessage({
          type: 'assistant',
          text: "I'm listening... Feel free to ask about your finances, request analysis, or discuss your financial goals.",
          sentiment: 'positive'
        })
      }
    } catch (error) {
      console.error('Error handling voice command:', error)
      setIsListening(false)
      addMessage({
        type: 'assistant',
        text: "I encountered an error with voice recognition. Please try again or use text input.",
        sentiment: 'concerned'
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      processUserInput(textInput)
    }
  }

  const addMessage = (message: VoiceMessage) => {
    setMessages(prev => [...prev, message])
  }

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="bg-white rounded-lg shadow-lg p-3 sm:p-4 w-[calc(100%-2rem)] max-w-[20rem] sm:max-w-sm md:max-w-md mb-2"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900">AI Financial Assistant</h3>
                <span className="text-[10px] sm:text-xs text-gray-500">{currentTime}</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Minimize assistant"
              >
                <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent mb-3">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start space-x-1.5 sm:space-x-2 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="p-1 sm:p-1.5 bg-primary-100 rounded-full flex-shrink-0">
                      <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-1.5 sm:p-2 max-w-[75%] ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-xs sm:text-sm break-words">{message.text}</p>
                    {message.type === 'assistant' && message.suggestedActions && message.suggestedActions.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        {message.suggestedActions.map((action, i) => (
                          <p key={i} className="text-[10px] sm:text-xs text-primary-600">
                            → {action}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="p-1 sm:p-1.5 bg-primary-100 rounded-full flex-shrink-0">
                      <ChatBubbleBottomCenterTextIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="relative">
              <textarea
                ref={inputRef}
                value={textInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="w-full pr-20 pl-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={1}
                disabled={isProcessing}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button
                  onClick={() => processUserInput(textInput)}
                  disabled={!textInput.trim() || isProcessing}
                  className="p-1.5 rounded-full text-primary-600 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleVoiceCommand}
                  disabled={isProcessing}
                  className={`p-1.5 rounded-full transition-colors ${
                    isListening
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-600 hover:bg-primary-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={isListening ? 'Stop listening' : 'Start voice command'}
                >
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {isListening && (
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500 animate-pulse">Listening...</p>
              </div>
            )}
            {isProcessing && (
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">Processing your request...</p>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isExpanded && (
        <motion.div
          initial={false}
          animate={{
            scale: isListening ? [1, 1.1, 1] : 1,
            transition: {
              duration: 1,
              repeat: isListening ? Infinity : 0
            }
          }}
          className="flex items-center space-x-2"
        >
          <button
            onClick={() => setIsExpanded(true)}
            className="p-3 rounded-full shadow-lg bg-white text-primary-600 hover:bg-primary-50 transition-colors"
            aria-label="Expand assistant"
          >
            <ArrowUpIcon className="h-6 w-6" />
          </button>
        </motion.div>
      )}
    </div>
  )
} 