import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  isDark: boolean
  placeholder?: string
}

export function ChatInput({ onSend, isLoading, isDark, placeholder = '输入消息...' }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim())
      setMessage('')
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn(
      'relative flex items-end gap-2 p-3 rounded-2xl border backdrop-blur-xl',
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/80 border-white/50'
    )}>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
        className={cn(
          'flex-1 bg-transparent resize-none outline-none text-sm max-h-[120px] py-2 px-1',
          isDark 
            ? 'text-white placeholder:text-slate-500' 
            : 'text-slate-900 placeholder:text-slate-400'
        )}
      />
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className={cn(
          'p-2.5 rounded-xl transition-all duration-300 shrink-0',
          message.trim() && !isLoading
            ? isDark
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,245,255,0.3)]'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(0,102,255,0.2)]'
            : isDark
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  )
}
