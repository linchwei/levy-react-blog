import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatMessage } from './ChatMessage'
import { useAIChat } from '@/hooks/useAIChat'
import { isAIConfigured } from '@/services/aiService'

interface AIChatWidgetProps {
  articleTitle: string
  articleContent: string
}

export function AIChatWidget({
  articleTitle,
  articleContent,
}: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    error,
    sendMessage,
    regenerate,
    clearMessages,
  } = useAIChat({ articleTitle, articleContent })

  // 检查 API 配置
  useEffect(() => {
    setIsConfigured(isAIConfigured())
  }, [])

  // 自动滚动到底部
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // 自动调整 textarea 高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [inputValue])

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 快捷问题
  const quickQuestions = [
    '这篇文章主要讲了什么？',
    '能解释一下文中的核心概念吗？',
    '这篇文章适合什么水平的读者？',
  ]

  if (!isConfigured) {
    return null // 如果未配置 API Key，不显示组件
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold text-sm">AI 助手</h3>
                  <p className="text-xs text-white/80">基于 DeepSeek 大模型</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                    onClick={clearMessages}
                    title="清空对话"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                    有什么可以帮你的？
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    我可以帮你理解这篇文章的内容
                  </p>
                  <div className="space-y-2">
                    {quickQuestions.map(question => (
                      <button
                        key={question}
                        onClick={() => sendMessage(question)}
                        className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      isLoading={isLoading && message.content === ''}
                      onRegenerate={
                        message.role === 'assistant' ? regenerate : undefined
                      }
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入问题，按 Enter 发送..."
                  className="min-h-[44px] max-h-[120px] resize-none bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-[44px] w-[44px] p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
                AI 生成内容仅供参考
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
