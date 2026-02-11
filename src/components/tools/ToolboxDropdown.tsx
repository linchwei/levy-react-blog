import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Terminal,
  ChevronDown,
  Code2,
  Palette,
  MousePointer2,
  PenTool,
} from 'lucide-react'

interface ToolItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
}

const tools: ToolItem[] = [
  {
    name: 'CSS 动画库',
    path: '/tools/css-animation',
    icon: Palette,
    description: '30+ 种动画效果',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'AI 动画生成器',
    path: '/tools/ai-animation',
    icon: Sparkles,
    description: '自然语言生成动画',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'SVG 动画编辑器',
    path: '/tools/svg-animation',
    icon: PenTool,
    description: '可视化 SVG 路径编辑',
    color: 'from-pink-500 to-purple-500',
  },
  {
    name: '滚动动画设计器',
    path: '/tools/scroll-animation',
    icon: MousePointer2,
    description: '滚动触发动画',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: '代码游乐场',
    path: '/tools/code-playground',
    icon: Terminal,
    description: '在线编写 React 代码',
    color: 'from-emerald-500 to-teal-500',
  },
]

export function ToolboxDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        className="group flex items-center gap-2 bg-linear-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 hover:border-purple-500/60"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Code2 className="w-4 h-4 text-purple-500" />
        <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">
          工具箱
        </span>
        <ChevronDown
          className={`w-4 h-4 text-purple-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-72 z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-3 bg-linear-to-r from-purple-500/10 to-blue-500/10 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  开发工具集合
                </p>
              </div>
              <div className="p-2 space-y-1">
                {tools.map(tool => {
                  const ToolIcon = tool.icon
                  return (
                    <Link
                      key={tool.name}
                      to={tool.path}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-linear-to-r ${tool.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                      >
                        <ToolIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                          {tool.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <Link
                  to="/tools"
                  className="flex items-center justify-center gap-2 p-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <span>查看全部工具</span>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
