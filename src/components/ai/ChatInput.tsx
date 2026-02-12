import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  isDark: boolean
  onStop?: () => void
  placeholder?: string
}

export function ChatInput({
  onSend,
  isLoading,
  isDark,
  onStop,
  placeholder = '输入消息...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isLoading) return

    onSend(trimmedMessage)
    setMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [message, isLoading, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [])

  return (
    <div
      className={cn(
        'border-t px-4 py-4',
        isDark ? 'border-zinc-800 bg-zinc-950' : 'border-gray-200 bg-white'
      )}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-xl border p-3 transition-all',
            isDark
              ? 'border-zinc-700 bg-zinc-900 focus-within:border-zinc-600'
              : 'border-gray-300 bg-white focus-within:border-gray-400'
          )}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent outline-none max-h-[200px] min-h-[24px]',
              isDark
                ? 'text-zinc-100 placeholder:text-zinc-500'
                : 'text-gray-900 placeholder:text-gray-400'
            )}
            disabled={isLoading}
          />

          {isLoading ? (
            <Button
              variant="destructive"
              size="icon"
              onClick={onStop}
              className="flex-shrink-0 h-8 w-8"
            >
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              onClick={handleSend}
              disabled={!message.trim()}
              className={cn(
                'flex-shrink-0 h-8 w-8 transition-all',
                message.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  : 'opacity-50 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>

        <p
          className={cn(
            'text-xs mt-2 text-center',
            isDark ? 'text-zinc-500' : 'text-gray-400'
          )}
        >
          Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  )
}
