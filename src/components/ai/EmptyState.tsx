import { Sparkles, MessageSquare, Code, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  isDark: boolean
  onSuggestionClick?: (suggestion: string) => void
}

const suggestions = [
  {
    icon: MessageSquare,
    title: '解释一下',
    description: 'React 的 useEffect 是如何工作的？',
    prompt: '请详细解释 React 的 useEffect Hook 的工作原理，包括依赖数组、清理函数等。',
  },
  {
    icon: Code,
    title: '帮我写代码',
    description: '用 TypeScript 实现一个防抖函数',
    prompt: '请用 TypeScript 实现一个防抖（debounce）函数，包括类型定义和使用示例。',
  },
  {
    icon: Lightbulb,
    title: '给我建议',
    description: '如何优化前端性能？',
    prompt: '请给出前端性能优化的建议，包括加载优化、渲染优化、代码优化等方面。',
  },
  {
    icon: Sparkles,
    title: '创意写作',
    description: '帮我写一篇技术博客的开头',
    prompt: '请帮我写一篇关于前端开发的技术博客开头段落，要求引人入胜。',
  },
]

export function EmptyState({ isDark, onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4',
            'bg-gradient-to-br from-blue-500 to-purple-600'
          )}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1
          className={cn(
            'text-2xl font-bold mb-2',
            isDark ? 'text-zinc-100' : 'text-gray-900'
          )}
        >
          AI 助手
        </h1>
        <p
          className={cn(
            'text-sm max-w-md',
            isDark ? 'text-zinc-400' : 'text-gray-500'
          )}
        >
          我可以帮你解答技术问题、编写代码、提供建议，或者只是聊聊天。
        </p>
      </motion.div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSuggestionClick?.(suggestion.prompt)}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl text-left transition-all',
              'border hover:shadow-md',
              isDark
                ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                isDark ? 'bg-zinc-800' : 'bg-gray-100'
              )}
            >
              <suggestion.icon
                className={cn(
                  'w-4 h-4',
                  isDark ? 'text-zinc-400' : 'text-gray-500'
                )}
              />
            </div>
            <div className="min-w-0">
              <h3
                className={cn(
                  'font-medium text-sm mb-0.5',
                  isDark ? 'text-zinc-200' : 'text-gray-700'
                )}
              >
                {suggestion.title}
              </h3>
              <p
                className={cn(
                  'text-xs truncate',
                  isDark ? 'text-zinc-500' : 'text-gray-400'
                )}
              >
                {suggestion.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={cn(
          'mt-12 text-xs text-center',
          isDark ? 'text-zinc-500' : 'text-gray-400'
        )}
      >
        <p>提示：支持 Markdown 格式，代码块可复制</p>
      </motion.div>
    </div>
  )
}
