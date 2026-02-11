import { motion } from 'framer-motion'
import { User, Bot, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isDark: boolean
  isStreaming?: boolean
}

export function ChatMessage({ role, content, isDark, isStreaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    // Split by code blocks
    const parts = text.split(/(```[\s\S]*?```)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Code block
        const code = part.slice(3, -3).trim()
        const language = code.split('\n')[0]
        const codeContent = code.includes('\n') ? code.slice(code.indexOf('\n') + 1) : code
        
        return (
          <div key={index} className="my-2 rounded-lg overflow-hidden">
            <div className={cn(
              'px-3 py-1 text-xs font-mono',
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
            )}>
              {language || 'code'}
            </div>
            <pre className={cn(
              'p-3 overflow-x-auto text-sm font-mono',
              isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-700'
            )}>
              <code>{codeContent}</code>
            </pre>
          </div>
        )
      }
      
      // Regular text with inline code
      const lines = part.split('\n')
      return lines.map((line, lineIndex) => {
        // Inline code
        const inlineCodeRegex = /`([^`]+)`/g
        const parts = line.split(inlineCodeRegex)
        
        return (
          <span key={`${index}-${lineIndex}`}>
            {parts.map((segment, segIndex) => {
              if (segIndex % 2 === 1) {
                // Inline code
                return (
                  <code
                    key={segIndex}
                    className={cn(
                      'px-1.5 py-0.5 rounded text-sm font-mono',
                      isDark 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-blue-500/10 text-blue-600'
                    )}
                  >
                    {segment}
                  </code>
                )
              }
              return <span key={segIndex}>{segment}</span>
            })}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        )
      })
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 mb-4',
        role === 'user' ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          role === 'user'
            ? isDark 
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
              : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            : isDark
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
        )}
        style={{
          boxShadow: role === 'user'
            ? isDark ? '0 0 10px rgba(0,245,255,0.3)' : '0 0 10px rgba(0,102,255,0.2)'
            : isDark ? '0 0 10px rgba(184,41,247,0.3)' : '0 0 10px rgba(124,58,237,0.2)'
        }}
      >
        {role === 'user' ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message bubble */}
      <div className="flex-1 max-w-[85%]">
        <div
          className={cn(
            'relative rounded-2xl px-4 py-3 backdrop-blur-xl border',
            role === 'user'
              ? isDark
                ? 'bg-cyan-500/10 border-cyan-500/30 text-white ml-auto'
                : 'bg-blue-500/10 border-blue-500/30 text-slate-900 ml-auto'
              : isDark
                ? 'bg-white/5 border-white/10 text-slate-200'
                : 'bg-white/80 border-white/50 text-slate-800'
          )}
          style={{
            boxShadow: role === 'user'
              ? isDark ? '0 0 20px rgba(0,245,255,0.1)' : '0 0 20px rgba(0,102,255,0.1)'
              : 'none'
          }}
        >
          {/* Content */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {renderContent(content)}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 align-middle animate-pulse bg-current" />
            )}
          </div>

          {/* Copy button */}
          {!isStreaming && (
            <button
              onClick={handleCopy}
              className={cn(
                'absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity',
                isDark 
                  ? 'hover:bg-white/10 text-slate-400 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
              )}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
