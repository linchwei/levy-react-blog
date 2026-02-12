import { useState, useCallback, useEffect, useRef } from 'react'
import { Menu, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { chatStream } from '@/services/aiService'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { ChatSidebar, type ChatSession } from '@/components/ai/ChatSidebar'
import { ChatMessage, type Message } from '@/components/ai/ChatMessage'
import { ChatInput } from '@/components/ai/ChatInput'
import { EmptyState } from '@/components/ai/EmptyState'

const STORAGE_KEY = 'ai-chat-sessions'
const CURRENT_SESSION_KEY = 'ai-chat-current-session'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function generateTitle(content: string): string {
  const trimmed = content.trim()
  if (trimmed.length <= 20) return trimmed
  return trimmed.substring(0, 20) + '...'
}

export function AIChatPage() {
  // 使用网站统一的主题系统
  const [isDark, setIsDark] = useState(true)

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    () => {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(CURRENT_SESSION_KEY)
    }
  )

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 同步网站主题
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  // Get current session
  const currentSession = sessions.find(s => s.id === currentSessionId)
  const messages = currentSession?.messages || []

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  // Save current session id
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem(CURRENT_SESSION_KEY, currentSessionId)
    }
  }, [currentSessionId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setIsSidebarOpen(false)
  }, [])

  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId)
    setIsSidebarOpen(false)
  }, [])

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null)
      }
    },
    [currentSessionId]
  )

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, title: newTitle, updatedAt: Date.now() }
          : s
      )
    )
  }, [])

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsLoading(false)

    // Update streaming state
    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: s.messages.map(m =>
                m.isStreaming ? { ...m, isStreaming: false } : m
              ),
            }
          : s
      )
    )
  }, [currentSessionId])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      // Create new session if none exists
      let sessionId = currentSessionId
      if (!sessionId) {
        const newSession: ChatSession = {
          id: generateId(),
          title: generateTitle(content),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        setSessions(prev => [newSession, ...prev])
        sessionId = newSession.id
        setCurrentSessionId(newSession.id)
      } else {
        // Update session title if it's the first message
        const session = sessions.find(s => s.id === sessionId)
        if (session && session.messages.length === 0) {
          renameSession(sessionId, generateTitle(content))
        }
      }

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      }

      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? {
                ...s,
                messages: [...s.messages, userMessage],
                updatedAt: Date.now(),
              }
            : s
        )
      )

      // Prepare AI message
      const aiMessageId = generateId()
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      }

      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? {
                ...s,
                messages: [...s.messages, aiMessage],
                updatedAt: Date.now(),
              }
            : s
        )
      )

      setIsLoading(true)

      try {
        // Get conversation history
        const currentSession = sessions.find(s => s.id === sessionId)
        const historyMessages = currentSession
          ? currentSession.messages.slice(-10).map(m => ({
              role: m.role,
              content: m.content,
            }))
          : []

        abortControllerRef.current = new AbortController()

        await chatStream({
          messages: [
            ...historyMessages,
            { role: 'user', content: content.trim() },
          ],
          temperature: 0.7,
          maxTokens: 2000,
          onStream: chunk => {
            setSessions(prev =>
              prev.map(s =>
                s.id === sessionId
                  ? {
                      ...s,
                      messages: s.messages.map(m =>
                        m.id === aiMessageId
                          ? { ...m, content: m.content + chunk }
                          : m
                      ),
                    }
                  : s
              )
            )
          },
        })
      } catch (error) {
        console.error('Chat error:', error)
        // Add error message
        setSessions(prev =>
          prev.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map(m =>
                    m.id === aiMessageId
                      ? {
                          ...m,
                          content:
                            m.content +
                            '\n\n[错误: 发送消息失败，请检查 API 配置或稍后重试]',
                          isStreaming: false,
                        }
                      : m
                  ),
                }
              : s
          )
        )
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null

        // Mark streaming as complete
        setSessions(prev =>
          prev.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map(m =>
                    m.id === aiMessageId ? { ...m, isStreaming: false } : m
                  ),
                }
              : s
          )
        )
      }
    },
    [currentSessionId, isLoading, sessions, renameSession]
  )

  const regenerateMessage = useCallback(async () => {
    if (!currentSession) return

    // Find last user message
    const lastUserMessageIndex = [...currentSession.messages]
      .reverse()
      .findIndex(m => m.role === 'user')

    if (lastUserMessageIndex === -1) return

    const actualIndex =
      currentSession.messages.length - 1 - lastUserMessageIndex
    const lastUserMessage = currentSession.messages[actualIndex]

    // Remove AI messages after the last user message
    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: s.messages.slice(0, actualIndex + 1),
              updatedAt: Date.now(),
            }
          : s
      )
    )

    // Resend
    await sendMessage(lastUserMessage.content)
  }, [currentSession, currentSessionId, sendMessage])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 flex pt-16">
        {/* Sidebar - 粘性定位 */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <ChatSidebar
              sessions={sessions}
              currentSessionId={currentSessionId}
              onNewChat={createNewSession}
              onSelectSession={selectSession}
              onDeleteSession={deleteSession}
              onRenameSession={renameSession}
              isDark={isDark}
              isOpen={false}
              onClose={() => {}}
            />
          </div>
        </div>

        {/* Mobile Sidebar - 只在移动端显示 */}
        <div className="lg:hidden">
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onNewChat={createNewSession}
            onSelectSession={selectSession}
            onDeleteSession={deleteSession}
            onRenameSession={renameSession}
            isDark={isDark}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header
            className={cn(
              'flex items-center justify-between px-4 py-3 border-b lg:hidden',
              isDark
                ? 'border-zinc-800 bg-zinc-950'
                : 'border-gray-200 bg-white'
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className={isDark ? 'text-zinc-400' : 'text-gray-600'}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h1
                className={cn(
                  'font-semibold',
                  isDark ? 'text-zinc-100' : 'text-gray-900'
                )}
              >
                {currentSession?.title || 'AI 助手'}
              </h1>
            </div>
            <div className="w-10" />
          </header>

          {/* Messages */}
          <ScrollArea className="flex-1">
            {messages.length === 0 ? (
              <EmptyState isDark={isDark} onSuggestionClick={sendMessage} />
            ) : (
              <div className="pb-4">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isDark={isDark}
                    onRegenerate={
                      index === messages.length - 1 &&
                      message.role === 'assistant'
                        ? regenerateMessage
                        : undefined
                    }
                    isLastMessage={index === messages.length - 1}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <ChatInput
            onSend={sendMessage}
            isLoading={isLoading}
            isDark={isDark}
            onStop={stopGeneration}
            placeholder="输入消息..."
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
