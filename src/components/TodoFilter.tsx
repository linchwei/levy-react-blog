import { Button } from '@/components/ui/button'
import { useTodoStore, type FilterType } from '@/stores/todoStore'
import { cn } from '@/lib/utils'

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
]

const selectFilter = (state: ReturnType<typeof useTodoStore.getState>) => state.filter
const selectSetFilter = (state: ReturnType<typeof useTodoStore.getState>) => state.setFilter
const selectTodos = (state: ReturnType<typeof useTodoStore.getState>) => state.todos

export function TodoFilter() {
  const filter = useTodoStore(selectFilter)
  const setFilter = useTodoStore(selectSetFilter)
  const todos = useTodoStore(selectTodos)

  const total = todos.length
  const active = todos.filter(t => !t.completed).length
  const completed = todos.filter(t => t.completed).length

  const getCount = (filterType: FilterType) => {
    switch (filterType) {
      case 'all':
        return total
      case 'active':
        return active
      case 'completed':
        return completed
      default:
        return 0
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(f => (
        <Button
          key={f.value}
          size="sm"
          onClick={() => setFilter(f.value)}
          className={cn(
            'transition-all',
            filter === f.value
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-background border border-input hover:bg-accent'
          )}
        >
          {f.label}
          <span className="ml-2 text-xs bg-background/20 px-2 py-0.5 rounded-full">
            {getCount(f.value)}
          </span>
        </Button>
      ))}
    </div>
  )
}
