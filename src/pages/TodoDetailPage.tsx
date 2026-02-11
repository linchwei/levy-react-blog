import { useParams, useNavigate } from 'react-router-dom'
import { useTodoStore, useTodoById, PRIORITY_CONFIG } from '@/stores/todoStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Priority } from '@/types'

const selectToggleTodo = (state: ReturnType<typeof useTodoStore.getState>) =>
  state.toggleTodo
const selectDeleteTodo = (state: ReturnType<typeof useTodoStore.getState>) =>
  state.deleteTodo

export function TodoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const todo = useTodoById(id || '')
  const toggleTodo = useTodoStore(selectToggleTodo)
  const deleteTodo = useTodoStore(selectDeleteTodo)

  if (!todo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center mb-4">
              待办事项不存在或已被删除
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleToggle = () => {
    toggleTodo(todo.id)
    toast.success(todo.completed ? '标记为未完成' : '标记为已完成')
  }

  const handleDelete = () => {
    deleteTodo(todo.id)
    toast.success('待办事项已删除')
    navigate('/')
  }

  const priorityConfig = PRIORITY_CONFIG[todo.priority as Priority]

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Button onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={handleToggle}
                    className="h-6 w-6"
                  />
                  <h1
                    className={cn(
                      'text-2xl font-bold',
                      todo.completed && 'line-through text-muted-foreground'
                    )}
                  >
                    {todo.title}
                  </h1>
                </div>
                <Badge
                  className={
                    priorityConfig.bgColor + ' ' + priorityConfig.textColor
                  }
                >
                  {priorityConfig.label}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                描述
              </h3>
              <p
                className={cn(
                  'text-base leading-relaxed',
                  todo.completed && 'line-through text-muted-foreground'
                )}
              >
                {todo.description || '暂无描述'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>创建时间</span>
              </div>
              <div className="text-sm">
                {new Date(todo.createdAt).toLocaleString('zh-CN')}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>更新时间</span>
              </div>
              <div className="text-sm">
                {new Date(todo.updatedAt).toLocaleString('zh-CN')}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>状态</span>
              </div>
              <div className="text-sm">
                {todo.completed ? (
                  <span className="text-green-600 font-medium">已完成</span>
                ) : (
                  <span className="text-yellow-600 font-medium">进行中</span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 pt-6 border-t">
            <Button className="flex-1" onClick={handleToggle}>
              {todo.completed ? '标记为未完成' : '标记为已完成'}
            </Button>
            <Button onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
