import { useState, useRef, useCallback } from 'react'
import { useForm, type ControllerRenderProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Sparkles, X, Check } from 'lucide-react'
import { useTodoStore, PRIORITY_CONFIG } from '@/stores/todoStore'
import { toast } from 'sonner'
import { ANIMATION_DURATION as ANIMATION_DURATION_CONFIG } from '@/constants'
import type { TodoFormData } from '@/types'

const ANIMATION_DURATION = ANIMATION_DURATION_CONFIG.normal

const formSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最多100个字符'),
  description: z.string().max(500, '描述最多500个字符').optional(),
  priority: z.enum(['low', 'medium', 'high']),
})

type FormValues = z.infer<typeof formSchema>

const DEFAULT_VALUES: FormValues = {
  title: '',
  description: '',
  priority: 'medium',
}

const PRIORITY_ANIMATION = {
  low: { scale: 1, rotate: 0 },
  medium: { scale: 1.05, rotate: 2 },
  high: { scale: 1.1, rotate: -2 },
}

const selectAddTodo = (state: ReturnType<typeof useTodoStore.getState>) => state.addTodo

function AddTodoComponent() {
  const addTodo = useTodoStore(selectAddTodo)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const handleSubmit = useCallback(async (values: FormValues) => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    const todoData: TodoFormData = {
      title: values.title,
      description: values.description,
      priority: values.priority,
    }

    addTodo(todoData)

    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
        disableForReducedMotion: true,
      })
    }

    toast.success('待办事项已添加！', {
      icon: <Check className="w-4 h-4 text-green-500" />,
    })

    form.reset()
    setIsExpanded(false)
    setIsSubmitting(false)
  }, [addTodo, form])

  const handleCancel = useCallback(() => {
    form.reset()
    setIsExpanded(false)
  }, [form])

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleAnimationComplete = useCallback(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const selectedPriority = form.watch('priority')

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="relative overflow-hidden border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-950 dark:to-purple-950/20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <CardHeader className="relative">
          <CardTitle className="flex items-center justify-between text-lg font-semibold">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {isExpanded ? '✨ 新待办事项' : '添加待办事项'}
            </span>
            <motion.div
              animate={{
                rotate: isExpanded ? 45 : 0,
                scale: isExpanded ? 1.1 : 1,
              }}
              transition={{ duration: ANIMATION_DURATION }}
            >
              {isExpanded ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <X className="h-5 w-5 text-red-500" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExpand}
                  className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 group"
                >
                  <Plus className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </motion.div>
          </CardTitle>
        </CardHeader>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
              onAnimationComplete={handleAnimationComplete}
            >
              <CardContent className="relative">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }: { field: ControllerRenderProps<FormValues, 'title'> }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">任务标题</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="输入待办事项标题..."
                              {...field}
                              ref={inputRef}
                              className="border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }: { field: ControllerRenderProps<FormValues, 'description'> }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">描述（可选）</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="添加详细描述..."
                              {...field}
                              className="min-h-[80px] border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 transition-all resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }: { field: ControllerRenderProps<FormValues, 'priority'> }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">优先级</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-purple-200 dark:border-purple-800">
                                <SelectValue placeholder="选择优先级" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex items-center gap-2">
                                    <span>{config.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <motion.div
                      key={selectedPriority}
                      animate={PRIORITY_ANIMATION[selectedPriority as keyof typeof PRIORITY_ANIMATION]}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`p-3 rounded-lg ${PRIORITY_CONFIG[selectedPriority as keyof typeof PRIORITY_CONFIG].color} bg-opacity-10`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>{PRIORITY_CONFIG[selectedPriority as keyof typeof PRIORITY_CONFIG].label}</span>
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300"
                      >
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-2"
                            >
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <Sparkles className="w-4 h-4" />
                              </motion.div>
                              添加中...
                            </motion.div>
                          ) : (
                            <motion.div
                              key="idle"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              添加待办事项
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <motion.div
            className="absolute bottom-2 right-2 opacity-20"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="h-8 w-8 text-purple-500" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

export function AddTodo() {
  return <AddTodoComponent />
}
