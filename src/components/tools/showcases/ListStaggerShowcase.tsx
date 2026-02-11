import { useState } from 'react'
import {
  motion,
  AnimatePresence,
  type Variants,
  type Easing,
} from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, RotateCcw } from 'lucide-react'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  stagger: number
}

interface ListStaggerShowcaseProps {
  config: AnimationConfig
}

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

export function ListStaggerShowcase({ config }: ListStaggerShowcaseProps) {
  const [items, setItems] = useState<TodoItem[]>([
    { id: 1, text: '设计新的用户界面', completed: false },
    { id: 2, text: '优化动画性能', completed: true },
    { id: 3, text: '编写文档', completed: false },
    { id: 4, text: '代码审查', completed: false },
  ])
  const [key, setKey] = useState(0)

  const handleReplay = () => {
    const currentItems = [...items]
    setItems([])
    setTimeout(() => {
      setKey(prev => prev + 1)
      setItems(currentItems)
    }, 100)
  }

  const toggleTodo = (id: number) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const deleteTodo = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const getEase = (): Easing => {
    const easeMap: Record<string, Easing> = {
      linear: 'linear' as const,
      easeIn: 'easeIn' as const,
      easeOut: 'easeOut' as const,
      easeInOut: 'easeInOut' as const,
      circIn: 'circIn' as const,
      circOut: 'circOut' as const,
      backIn: 'backIn' as const,
      backOut: 'backOut' as const,
      elastic: [0.68, -0.55, 0.265, 1.55] as Easing,
      bounce: [0.175, 0.885, 0.32, 1.275] as Easing,
    }
    return easeMap[config.ease] || ('easeOut' as Easing)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.stagger,
        delayChildren: config.delay,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: config.stagger * 0.5,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: config.duration,
        ease: getEase(),
      },
    },
    exit: {
      opacity: 0,
      x: 50,
      scale: 0.9,
      transition: {
        duration: config.duration * 0.5,
      },
    },
  }

  return (
    <div className="space-y-4">
      <div className="relative h-80 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden p-6">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">待办事项</h3>
              <span className="text-sm text-muted-foreground">
                {items.filter(i => i.completed).length}/{items.length} 完成
              </span>
            </div>

            <motion.div
              key={key}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-2"
            >
              <AnimatePresence mode="popLayout">
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 group"
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleTodo(item.id)}
                    />
                    <span
                      className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteTodo(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {items.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                暂无待办事项
              </motion.p>
            )}
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleReplay} variant="outline" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        重播列表动画
      </Button>
    </div>
  )
}
