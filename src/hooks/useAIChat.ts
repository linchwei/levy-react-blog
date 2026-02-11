import { useState, useCallback, useRef } from 'react'
import { chatStream, getArticleSystemPrompt, type ChatMessage } from '@/services/aiService'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface UseAIChatOptions {
  articleTitle: string
  articleContent: string
}

export function useAIChat({ articleTitle, articleContent }: UseAIChatOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 生成唯一ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    // 添加用户消息
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    // 准备AI消息
    const aiMessageId = generateId()
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, aiMessage])

    try {
      // 构建消息历史
      const historyMessages: ChatMessage[] = [
        {
          role: 'system',
          content: getArticleSystemPrompt(articleTitle, articleContent),
        },
        ...messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: content.trim() },
      ]

      // 流式接收响应
      await chatStream({
        messages: historyMessages,
        temperature: 0.7,
        maxTokens: 1500,
        onStream: (chunk) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMessageId
                ? { ...m, content: m.content + chunk }
                : m
            )
          )
        },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '请求失败'
      setError(errorMessage)
      
      // 更新AI消息显示错误
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMessageId
            ? { ...m, content: `抱歉，发生了错误：${errorMessage}` }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [articleTitle, articleContent, messages])

  // 重新生成最后一条回复
  const regenerate = useCallback(async () => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    if (!lastUserMessage) return

    // 移除最后一条AI回复
    setMessages(prev => {
      const lastAiIndex = prev.findLastIndex(m => m.role === 'assistant')
      if (lastAiIndex > -1) {
        return prev.slice(0, lastAiIndex)
      }
      return prev
    })

    // 重新发送
    await sendMessage(lastUserMessage.content)
  }, [messages, sendMessage])

  // 清空对话
  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  // 停止生成
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
  }, [])

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    error,
    sendMessage,
    regenerate,
    clearMessages,
    stopGeneration,
  }
}
