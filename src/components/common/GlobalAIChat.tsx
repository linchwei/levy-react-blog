import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles, Trash2, Bot } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { chatStream } from '@/services/aiService'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export function GlobalAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('ai-chat-history')
    return saved ? JSON.parse(saved) : []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }

    checkTheme()

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          checkTheme()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('ai-chat-history', JSON.stringify(messages))
  }, [messages])

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, streamingContent])

  const handleSend = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, userMessage])
      setIsLoading(true)
      setStreamingContent('')

      try {
        // Prepare conversation history
        const history = messages.map(m => ({
          role: m.role,
          content: m.content,
        }))

        // Stream response
        let fullResponse = ''

        await chatStream({
          messages: [...history, { role: 'user', content }],
          temperature: 0.7,
          stream: true,
          onStream: chunk => {
            fullResponse += chunk
            setStreamingContent(fullResponse)
          },
        })

        // On complete
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullResponse,
          timestamp: Date.now(),
        }
        setMessages(prev => [...prev, assistantMessage])
        setStreamingContent('')
        setIsLoading(false)
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，发生了错误。请稍后重试。',
          timestamp: Date.now(),
        }
        setMessages(prev => [...prev, errorMessage])
        setStreamingContent('')
        setIsLoading(false)
      }
    },
    [messages]
  )

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem('ai-chat-history')
  }

  const quickQuestions = [
    '你能做什么？',
    '介绍一下你自己',
    '帮我写一段代码',
    '有什么建议吗？',
  ]

  return (
    <>
      {/* Floating button - Left bottom */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed right-6 bottom-6 z-50 p-4 rounded-full backdrop-blur-xl border',
          'transition-all duration-300',
          isDark
            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30'
            : 'bg-blue-500/20 border-blue-500/50 text-blue-600 hover:bg-blue-500/30'
        )}
        style={{
          boxShadow: isDark
            ? '0 0 30px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1)'
            : '0 0 30px rgba(0,102,255,0.2), 0 0 60px rgba(0,102,255,0.1)',
        }}
      >
        {/* Pulse animation */}
        <span
          className={cn(
            'absolute inset-0 rounded-full animate-ping opacity-30',
            isDark ? 'bg-cyan-500' : 'bg-blue-500'
          )}
        />

        <MessageCircle className="w-6 h-6 relative z-10" />

        {/* Notification badge */}
        {messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Chat drawer - Right bottom */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'fixed right-0 bottom-0 top-0 w-full sm:w-[420px] z-50',
                'flex flex-col border-l backdrop-blur-2xl',
                isDark
                  ? 'bg-slate-950/90 border-white/10'
                  : 'bg-white/90 border-white/50'
              )}
            >
              {/* Header */}
              <div
                className={cn(
                  'flex items-center justify-between p-4 border-b',
                  isDark ? 'border-white/10' : 'border-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      'bg-gradient-to-br from-purple-500 to-pink-500'
                    )}
                    style={{
                      boxShadow: isDark
                        ? '0 0 15px rgba(184,41,247,0.4)'
                        : '0 0 15px rgba(124,58,237,0.3)',
                    }}
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        'font-semibold',
                        isDark ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      AI 助手
                    </h3>
                    <p
                      className={cn(
                        'text-xs',
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      由 DeepSeek 驱动
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Clear button */}
                  {messages.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearHistory}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        isDark
                          ? 'hover:bg-white/10 text-slate-400 hover:text-red-400'
                          : 'hover:bg-slate-100 text-slate-500 hover:text-red-500'
                      )}
                      title="清空对话"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}

                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isDark
                        ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                        : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                    )}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  // Welcome state
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className={cn(
                        'w-20 h-20 rounded-2xl flex items-center justify-center mb-6',
                        'bg-gradient-to-br from-purple-500 to-pink-500'
                      )}
                      style={{
                        boxShadow: isDark
                          ? '0 0 30px rgba(184,41,247,0.4)'
                          : '0 0 30px rgba(124,58,237,0.3)',
                      }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3
                      className={cn(
                        'text-xl font-bold mb-2',
                        isDark ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      有什么可以帮你的？
                    </h3>
                    <p
                      className={cn(
                        'text-sm mb-6',
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      )}
                    >
                      我可以帮你解答问题、写代码、提供建议，或者只是聊聊天。
                    </p>

                    {/* Quick questions */}
                    <div className="w-full space-y-2">
                      {quickQuestions.map((question, index) => (
                        <motion.button
                          key={question}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          onClick={() => handleSend(question)}
                          className={cn(
                            'w-full p-3 rounded-xl text-left text-sm transition-all duration-300',
                            isDark
                              ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30'
                              : 'bg-white/50 border border-white/50 text-slate-700 hover:bg-white hover:border-blue-500/30'
                          )}
                        >
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Messages list
                  <>
                    {messages.map(message => (
                      <ChatMessage
                        key={message.id}
                        role={message.role}
                        content={message.content}
                        isDark={isDark}
                      />
                    ))}

                    {/* Streaming message */}
                    {streamingContent && (
                      <ChatMessage
                        role="assistant"
                        content={streamingContent}
                        isDark={isDark}
                        isStreaming
                      />
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div
                className={cn(
                  'p-4 border-t',
                  isDark ? 'border-white/10' : 'border-slate-200'
                )}
              >
                <ChatInput
                  onSend={handleSend}
                  isLoading={isLoading}
                  isDark={isDark}
                  placeholder="输入消息，按 Enter 发送..."
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
