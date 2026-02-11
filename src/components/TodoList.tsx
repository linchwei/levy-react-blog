import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TodoItem } from './TodoItem'
import {
  useTodoStore,
  useFilteredTodos,
  usePriorityStats,
} from '@/stores/todoStore'
import {
  Search,
  ListTodo,
  CheckCircle2,
  Clock,
  Inbox,
  Sparkles,
  Flame,
  AlertCircle,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FILTER_LABELS } from '@/constants'
import type { FilterType, Priority } from '@/types'

// ============================================
// 类型定义
// ============================================
type TabType = FilterType

// ============================================
// 可排序的 TodoItem 包装器
// ============================================
interface SortableTodoItemProps {
  todo: ReturnType<typeof useFilteredTodos>[0]
}

function SortableTodoItem({ todo }: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <TodoItem
        todo={todo}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

// ============================================
// 空状态组件
// ============================================
const EMPTY_STATE_MESSAGES: Record<
  TabType,
  { icon: typeof Inbox; title: string; description: string }
> = {
  all: {
    icon: Inbox,
    title: '暂无待办事项',
    description: '点击上方"添加待办事项"开始创建你的第一个任务吧！',
  },
  active: {
    icon: CheckCircle2,
    title: '没有进行中的任务',
    description: '太棒了！所有任务都已完成，或者你可以添加新任务。',
  },
  completed: {
    icon: Sparkles,
    title: '还没有完成的任务',
    description: '完成任务后会在这里显示，加油！',
  },
}

interface EmptyStateProps {
  type: TabType
}

function EmptyState({ type }: EmptyStateProps) {
  const message = EMPTY_STATE_MESSAGES[type]
  const Icon = message.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
          <Icon className="w-12 h-12 text-purple-400" />
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {message.title}
      </h3>
      <p className="text-muted-foreground max-w-sm">{message.description}</p>
    </motion.div>
  )
}

// ============================================
// 筛选标签组件
// ============================================
interface FilterBadgeProps {
  count: number
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  color: string
  isActive: boolean
  onClick: () => void
}

function FilterBadge({
  count,
  icon: Icon,
  label,
  color,
  isActive,
  onClick,
}: FilterBadgeProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
        isActive
          ? `bg-gradient-to-r ${color} text-white shadow-lg`
          : 'bg-accent text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <motion.span
        key={count}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          'ml-1 px-2 py-0.5 rounded-full text-xs',
          isActive ? 'bg-white/20' : 'bg-background'
        )}
      >
        {count}
      </motion.span>
    </motion.button>
  )
}

// ============================================
// 优先级筛选按钮
// ============================================
interface PriorityFilterButtonProps {
  priority: Priority
  count: number
  isActive: boolean
  onClick: () => void
}

const PRIORITY_FILTER_CONFIG: Record<
  Priority,
  { icon: typeof Flame; label: string; color: string; activeColor: string }
> = {
  high: {
    icon: Flame,
    label: '高优先级',
    color: 'bg-red-500/10 text-red-600 hover:bg-red-500/20',
    activeColor: 'bg-red-500 text-white shadow-lg',
  },
  medium: {
    icon: AlertCircle,
    label: '中优先级',
    color: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
    activeColor: 'bg-yellow-500 text-white shadow-lg',
  },
  low: {
    icon: Info,
    label: '低优先级',
    color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
    activeColor: 'bg-blue-500 text-white shadow-lg',
  },
}

function PriorityFilterButton({
  priority,
  count,
  isActive,
  onClick,
}: PriorityFilterButtonProps) {
  const config = PRIORITY_FILTER_CONFIG[priority]

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
        isActive ? config.activeColor : config.color
      )}
    >
      <config.icon className="w-3 h-3" />
      {config.label}
      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
        {count}
      </span>
    </motion.button>
  )
}

// ============================================
// 主组件
// ============================================
export function TodoList() {
  const todos = useTodoStore(state => state.todos)
  const reorderTodos = useTodoStore(state => state.reorderTodos)

  const filteredTodos = useFilteredTodos()
  const priorityStats = usePriorityStats()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null)

  // 拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 搜索过滤
  const searchFilteredTodos = useMemo(() => {
    if (!searchQuery) return filteredTodos

    const query = searchQuery.toLowerCase()
    return filteredTodos.filter(
      todo =>
        todo.title.toLowerCase().includes(query) ||
        todo.description?.toLowerCase().includes(query)
    )
  }, [filteredTodos, searchQuery])

  // 优先级过滤
  const finalFilteredTodos = useMemo(() => {
    if (!priorityFilter) return searchFilteredTodos
    return searchFilteredTodos.filter(todo => todo.priority === priorityFilter)
  }, [searchFilteredTodos, priorityFilter])

  // 处理拖拽结束
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = todos.findIndex(todo => todo.id === active.id)
        const newIndex = todos.findIndex(todo => todo.id === over.id)
        reorderTodos(oldIndex, newIndex)
      }
    },
    [todos, reorderTodos]
  )

  // 统计
  const stats = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    }),
    [todos]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <CardHeader className="relative pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ListTodo className="h-6 w-6 text-purple-500" />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                任务列表
              </span>
              <Badge variant="secondary" className="ml-2">
                {finalFilteredTodos.length}
              </Badge>
            </CardTitle>

            {/* Search Input */}
            <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索任务..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
              />
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <FilterBadge
              count={stats.all}
              icon={Inbox}
              label={FILTER_LABELS.all}
              color="from-purple-500 to-blue-500"
              isActive={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            />
            <FilterBadge
              count={stats.active}
              icon={Clock}
              label={FILTER_LABELS.active}
              color="from-yellow-500 to-orange-500"
              isActive={activeTab === 'active'}
              onClick={() => setActiveTab('active')}
            />
            <FilterBadge
              count={stats.completed}
              icon={CheckCircle2}
              label={FILTER_LABELS.completed}
              color="from-green-500 to-emerald-500"
              isActive={activeTab === 'completed'}
              onClick={() => setActiveTab('completed')}
            />

            <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

            {/* Priority Filters */}
            {(['high', 'medium', 'low'] as Priority[]).map(priority => (
              <PriorityFilterButton
                key={priority}
                priority={priority}
                count={priorityStats[priority]}
                isActive={priorityFilter === priority}
                onClick={() =>
                  setPriorityFilter(
                    priorityFilter === priority ? null : priority
                  )
                }
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="relative">
          {finalFilteredTodos.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={finalFilteredTodos.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <LayoutGroup>
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-3">
                      {finalFilteredTodos.map((todo, index) => (
                        <motion.div
                          key={todo.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            layout: { duration: 0.2 },
                          }}
                          layout
                        >
                          <SortableTodoItem todo={todo} />
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </LayoutGroup>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
