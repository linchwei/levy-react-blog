import { useState, useCallback } from 'react'
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Message } from './ChatMessage'

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

interface ChatSidebarProps {
  sessions: ChatSession[]
  currentSessionId: string | null
  onNewChat: () => void
  onSelectSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
  onRenameSession: (sessionId: string, newTitle: string) => void
  isDark: boolean
  isOpen: boolean
  onClose: () => void
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  isDark,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleStartEdit = useCallback((session: ChatSession) => {
    setEditingId(session.id)
    setEditTitle(session.title)
  }, [])

  const handleSaveEdit = useCallback(
    (sessionId: string) => {
      if (editTitle.trim()) {
        onRenameSession(sessionId, editTitle.trim())
      }
      setEditingId(null)
      setEditTitle('')
    },
    [editTitle, onRenameSession]
  )

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setEditTitle('')
  }, [])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      date.toDateString()

    if (isToday) {
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (isYesterday) {
      return '昨天'
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col h-full',
          isDark
            ? 'bg-zinc-950 border-r border-zinc-800'
            : 'bg-gray-50 border-r border-gray-200',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className={cn(
          'p-4 border-b',
          isDark ? 'border-zinc-800' : 'border-gray-200'
        )}>
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4" />
            新建对话
          </Button>
        </div>

        {/* Sessions list */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessions.length === 0 ? (
              <div
                className={cn(
                  'text-center py-8 text-sm',
                  isDark ? 'text-zinc-500' : 'text-gray-400'
                )}
              >
                暂无对话记录
              </div>
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  className={cn(
                    'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                    currentSessionId === session.id
                      ? isDark
                        ? 'bg-zinc-800'
                        : 'bg-white shadow-sm'
                      : isDark
                        ? 'hover:bg-zinc-900'
                        : 'hover:bg-gray-100'
                  )}
                  onClick={() => onSelectSession(session.id)}
                >
                  <MessageSquare
                    className={cn(
                      'w-4 h-4 flex-shrink-0',
                      isDark ? 'text-zinc-400' : 'text-gray-500'
                    )}
                  />

                  {editingId === session.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveEdit(session.id)
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        onClick={e => e.stopPropagation()}
                        autoFocus
                        className={cn(
                          'flex-1 px-2 py-1 text-sm rounded border outline-none',
                          isDark
                            ? 'bg-zinc-900 border-zinc-700 text-zinc-100'
                            : 'bg-white border-gray-300 text-gray-900'
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={e => {
                          e.stopPropagation()
                          handleSaveEdit(session.id)
                        }}
                      >
                        <Check className="w-3 h-3 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={e => {
                          e.stopPropagation()
                          handleCancelEdit()
                        }}
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'text-sm truncate',
                            isDark ? 'text-zinc-200' : 'text-gray-700'
                          )}
                        >
                          {session.title}
                        </p>
                        <p
                          className={cn(
                            'text-xs',
                            isDark ? 'text-zinc-500' : 'text-gray-400'
                          )}
                        >
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={e => {
                            e.stopPropagation()
                            handleStartEdit(session)
                          }}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={e => {
                            e.stopPropagation()
                            onDeleteSession(session.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer info */}
        <div
          className={cn(
            'p-4 border-t',
            isDark ? 'border-zinc-800' : 'border-gray-200'
          )}
        >
          <p
            className={cn(
              'text-xs text-center',
              isDark ? 'text-zinc-500' : 'text-gray-400'
            )}
          >
            使用网站主题设置
          </p>
        </div>
      </div>
    </>
  )
}
