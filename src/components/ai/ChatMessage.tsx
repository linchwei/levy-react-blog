import { motion } from 'framer-motion'
import { User, Bot, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
  onRegenerate?: () => void
}

export function ChatMessage({ role, content, isLoading, onRegenerate }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block max-w-[85%] px-4 py-2.5 rounded-2xl text-left ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
          }`}
        >
          {isLoading && !content ? (
            <div className="flex items-center gap-2 py-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="m-0 leading-relaxed">{children}</p>,
                  code: ({ children }) => (
                    <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-black/10 dark:bg-white/10 p-2 rounded-lg overflow-x-auto text-sm my-2">
                      {children}
                    </pre>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Regenerate button for assistant messages */}
        {!isUser && onRegenerate && content && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            onClick={onRegenerate}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            重新生成
          </Button>
        )}
      </div>
    </motion.div>
  )
}
