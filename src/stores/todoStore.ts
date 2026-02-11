import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Todo,
  Priority,
  FilterType,
  TodoStats,
  TodoFormData,
} from '@/types'
import { TODO_STORAGE_KEY, PRIORITY_CONFIG } from '@/constants'

// ============================================
// Store 状态类型
// ============================================
interface TodoState {
  todos: Todo[]
  filter: FilterType
}

// ============================================
// Store Actions 类型
// ============================================
interface TodoActions {
  addTodo: (data: TodoFormData) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  updateTodo: (
    id: string,
    updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ) => void
  setFilter: (filter: FilterType) => void
  reorderTodos: (oldIndex: number, newIndex: number) => void
  clearCompleted: () => void
}

// ============================================
// 派生状态计算函数
// ============================================
const calculateStats = (todos: Todo[]): TodoStats => ({
  total: todos.length,
  completed: todos.filter(todo => todo.completed).length,
  active: todos.filter(todo => !todo.completed).length,
})

const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed)
    case 'completed':
      return todos.filter(todo => todo.completed)
    default:
      return todos
  }
}

// ============================================
// 创建 Todo Store
// ============================================
export const useTodoStore = create<TodoState & TodoActions>()(
  persist(
    set => ({
      todos: [],
      filter: 'all',

      addTodo: data => {
        const now = new Date()
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description || '',
          priority: data.priority,
          completed: false,
          createdAt: now,
          updatedAt: now,
        }
        set(state => ({
          todos: [newTodo, ...state.todos],
        }))
      },

      deleteTodo: id => {
        set(state => ({
          todos: state.todos.filter(todo => todo.id !== id),
        }))
      },

      toggleTodo: id => {
        set(state => ({
          todos: state.todos.map(todo =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          ),
        }))
      },

      updateTodo: (id, updates) => {
        set(state => ({
          todos: state.todos.map(todo =>
            todo.id === id
              ? { ...todo, ...updates, updatedAt: new Date() }
              : todo
          ),
        }))
      },

      setFilter: filter => {
        set({ filter })
      },

      reorderTodos: (oldIndex, newIndex) => {
        set(state => {
          const newTodos = [...state.todos]
          const [movedTodo] = newTodos.splice(oldIndex, 1)
          newTodos.splice(newIndex, 0, movedTodo)
          return { todos: newTodos }
        })
      },

      clearCompleted: () => {
        set(state => ({
          todos: state.todos.filter(todo => !todo.completed),
        }))
      },
    }),
    {
      name: TODO_STORAGE_KEY,
      version: 1,
      partialize: state => ({
        todos: state.todos,
        filter: state.filter,
      }),
    }
  )
)

// ============================================
// 优化的选择器 Hooks
// 使用稳定的选择器避免无限循环
// ============================================

// 稳定的选择器函数
const selectTodos = (state: TodoState & TodoActions) => state.todos
const selectFilter = (state: TodoState & TodoActions) => state.filter

/**
 * 获取所有待办事项
 */
export function useTodos(): Todo[] {
  return useTodoStore(selectTodos)
}

/**
 * 获取当前筛选状态
 */
export function useFilter(): FilterType {
  return useTodoStore(selectFilter)
}

/**
 * 获取统计信息
 */
export function useTodoStats(): TodoStats {
  const todos = useTodoStore(selectTodos)
  return calculateStats(todos)
}

/**
 * 获取过滤后的待办事项
 */
export function useFilteredTodos(): Todo[] {
  const todos = useTodoStore(selectTodos)
  const filter = useTodoStore(selectFilter)
  return filterTodos(todos, filter)
}

/**
 * 根据 ID 获取单个待办事项
 */
export function useTodoById(id: string): Todo | undefined {
  const todos = useTodoStore(selectTodos)
  return todos.find(todo => todo.id === id)
}

/**
 * 获取优先级统计
 */
export function usePriorityStats(): Record<Priority, number> {
  const todos = useTodoStore(selectTodos)
  return {
    high: todos.filter(t => t.priority === 'high').length,
    medium: todos.filter(t => t.priority === 'medium').length,
    low: todos.filter(t => t.priority === 'low').length,
  }
}

/**
 * 获取完成率
 */
export function useCompletionRate(): number {
  const total = useTodoStore(state => state.todos.length)
  const completed = useTodoStore(
    state => state.todos.filter(todo => todo.completed).length
  )
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

// ============================================
// 导出常量配置
// ============================================
export { PRIORITY_CONFIG }
export type { Todo, Priority, FilterType, TodoStats, TodoFormData }
