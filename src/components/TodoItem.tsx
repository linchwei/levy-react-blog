import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Trash2, CheckCircle2, Clock, GripVertical } from 'lucide-react'
import { useTodoStore, PRIORITY_CONFIG } from '@/stores/todoStore'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { SPRING_CONFIG } from '@/constants'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  isDragging?: boolean
  dragHandleProps?: Record<string, unknown>
}

const selectToggleTodo = (state: ReturnType<typeof useTodoStore.getState>) => state.toggleTodo
const selectDeleteTodo = (state: ReturnType<typeof useTodoStore.getState>) => state.deleteTodo

/**
 * TodoItem 组件
 * 单个待办事项卡片
 */
export function TodoItem({ todo, isDragging, dragHandleProps }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const toggleTodo = useTodoStore(selectToggleTodo)
  const deleteTodo = useTodoStore(selectDeleteTodo)

  const handleToggle = useCallback(() => {
    toggleTodo(todo.id)

    if (!todo.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6'],
        disableForReducedMotion: true,
      })

      toast.success('任务已完成！', {
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      })
    }
  }, [toggleTodo, todo.id, todo.completed])

  const handleDelete = useCallback(() => {
    setIsDeleting(true)
    setTimeout(() => {
      deleteTodo(todo.id)
      toast.success('任务已删除', {
        icon: <Trash2 className="w-4 h-4 text-red-500" />,
      })
    }, 300)
  }, [deleteTodo, todo.id])

  const priority = PRIORITY_CONFIG[todo.priority]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{
        opacity: isDeleting ? 0 : 1,
        y: isDeleting ? -20 : 0,
        scale: isDeleting ? 0.9 : 1,
        x: isDragging ? 5 : 0,
      }}
      exit={{ opacity: 0, x: -100 }}
      transition={SPRING_CONFIG.stiff}
      whileHover={{ scale: 1.01, y: -2 }}
      className={cn('group relative', isDragging && 'z-50')}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          todo.completed && 'opacity-60',
          isDragging && 'shadow-2xl shadow-purple-500/20 rotate-2'
        )}
      >
        {/* Progress bar for completion */}
        <motion.div
          className={cn(
            'absolute bottom-0 left-0 h-1 bg-gradient-to-r',
            priority.gradient
          )}
          initial={{ width: '0%' }}
          animate={{ width: todo.completed ? '100%' : '0%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Background glow on hover */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            priority.bgColor
          )}
        />

        <CardContent className="relative p-4">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            {dragHandleProps && (
              <motion.div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing p-1 -ml-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <GripVertical className="h-5 w-5" />
              </motion.div>
            )}

            {/* Checkbox with animation */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                className={cn(
                  'mt-1 h-5 w-5 border-2 transition-all duration-300',
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-muted-foreground/30 hover:border-purple-500'
                )}
              />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {/* Title with strikethrough animation */}
                  <motion.h3
                    className={cn(
                      'font-semibold text-base transition-all duration-300',
                      todo.completed && 'text-muted-foreground'
                    )}
                    animate={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      opacity: todo.completed ? 0.6 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {todo.title}
                  </motion.h3>

                  {/* Description */}
                  <AnimatePresence>
                    {todo.description && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={cn(
                          'text-sm text-muted-foreground mt-1',
                          todo.completed && 'line-through'
                        )}
                      >
                        {todo.description}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Meta info */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Priority Badge */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs font-medium border',
                                priority.textColor,
                                priority.bgColor,
                                priority.borderColor
                              )}
                            >
                              <span className="mr-1">{priority.icon}</span>
                              {priority.label}
                            </Badge>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>优先级: {priority.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Created time */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(todo.createdAt).toLocaleDateString(
                                'zh-CN'
                              )}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            创建时间:{
                              new Date(todo.createdAt).toLocaleString('zh-CN')
                            }
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Status Badge */}
                    <AnimatePresence>
                      {todo.completed && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Badge
                            variant="default"
                            className="bg-green-500/10 text-green-600 border-green-500/20 text-xs"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            已完成
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Delete Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDelete}
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>删除任务</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
