import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { User, Bot, Copy, Check, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CodeBlock } from './CodeBlock'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
}

interface ChatMessageProps {
  message: Message
  isDark: boolean
  onRegenerate?: () => void
  isLastMessage?: boolean
}

export function ChatMessage({ message, isDark, onRegenerate, isLastMessage }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }, [message.content])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'py-6 px-4 sm:px-6 lg:px-8',
        isUser
          ? isDark
            ? 'bg-zinc-900/50'
            : 'bg-gray-50/50'
          : isDark
            ? 'bg-zinc-900'
            : 'bg-white'
      )}
    >
      <div className="max-w-4xl mx-auto flex gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : isDark
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  : 'bg-gradient-to-br from-emerald-400 to-teal-500'
            )}
          >
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Role label */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'text-sm font-medium',
                isDark ? 'text-zinc-300' : 'text-gray-700'
              )}
            >
              {isUser ? '你' : 'AI 助手'}
            </span>
            <span className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-gray-400')}>
              {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Message content */}
          <div
            className={cn(
              'prose prose-sm max-w-none',
              isDark ? 'prose-invert' : '',
              'prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1',
              'prose-headings:mt-4 prose-headings:mb-2',
              'prose-code:before:content-none prose-code:after:content-none',
              'prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
              isDark
                ? 'prose-code:bg-zinc-800 prose-code:text-zinc-200'
                : 'prose-code:bg-gray-100 prose-code:text-gray-800',
              'prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0'
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const language = match ? match[1] : ''
                  const code = String(children).replace(/\n$/, '')

                  if (!inline && code) {
                    return (
                      <CodeBlock
                        code={code}
                        language={language}
                        isDark={isDark}
                      />
                    )
                  }

                  return (
                    <code
                      className={cn(
                        'px-1.5 py-0.5 rounded text-sm font-mono',
                        isDark
                          ? 'bg-zinc-800 text-zinc-200'
                          : 'bg-gray-100 text-gray-800'
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                a({ children, href }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'underline underline-offset-2 transition-colors',
                        isDark
                          ? 'text-blue-400 hover:text-blue-300'
                          : 'text-blue-600 hover:text-blue-700'
                      )}
                    >
                      {children}
                    </a>
                  )
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table
                        className={cn(
                          'min-w-full text-sm border-collapse',
                          isDark ? 'border-zinc-700' : 'border-gray-200'
                        )}
                      >
                        {children}
                      </table>
                    </div>
                  )
                },
                thead({ children }) {
                  return (
                    <thead
                      className={cn(
                        isDark ? 'bg-zinc-800' : 'bg-gray-50'
                      )}
                    >
                      {children}
                    </thead>
                  )
                },
                th({ children }) {
                  return (
                    <th
                      className={cn(
                        'px-4 py-2 text-left font-medium border-b',
                        isDark
                          ? 'border-zinc-700 text-zinc-200'
                          : 'border-gray-200 text-gray-700'
                      )}
                    >
                      {children}
                    </th>
                  )
                },
                td({ children }) {
                  return (
                    <td
                      className={cn(
                        'px-4 py-2 border-b',
                        isDark
                          ? 'border-zinc-800 text-zinc-300'
                          : 'border-gray-100 text-gray-600'
                      )}
                    >
                      {children}
                    </td>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>

            {/* Streaming indicator */}
            {message.isStreaming && (
              <span className="inline-flex ml-1">
                <span className="animate-pulse">▊</span>
              </span>
            )}
          </div>

          {/* Action buttons */}
          {!isUser && !message.isStreaming && (
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className={cn(
                  'h-7 px-2 text-xs',
                  isDark
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    复制
                  </>
                )}
              </Button>

              {isLastMessage && onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className={cn(
                    'h-7 px-2 text-xs',
                    isDark
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  重新生成
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
