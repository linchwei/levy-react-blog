---
name: "react-expert"
description: "Provides expert React, TypeScript, and modern frontend development guidance. Invoke when working with React components, hooks, state management, or UI/UX improvements."
---

# React Expert Skill

## 项目技术栈

- **React 19** + TypeScript
- **Vite** (rolldown-vite@7.2.5)
- **Tailwind CSS v4**
- **shadcn/ui** 组件库
- **Framer Motion** 动画
- **Zustand** 状态管理
- **@dnd-kit** 拖拽功能
- **React Hook Form** + Zod 表单验证

## 项目架构

```
src/
├── components/          # UI 组件
│   ├── ui/             # shadcn/ui 基础组件
│   ├── common/         # 通用组件 (LoadingSpinner, AnimatedCard)
│   ├── home/           # 首页组件
│   ├── blog/           # 博客组件
│   ├── todo/           # Todo 组件
│   └── ...
├── pages/              # 页面组件
├── hooks/              # 自定义 Hooks
├── stores/             # Zustand 状态管理
├── types/              # TypeScript 类型定义
├── constants/          # 常量定义
├── providers/          # Context Providers
├── error/              # 错误边界
├── lib/                # 工具函数
└── styles/             # 样式文件
```

## 代码规范

### 导入顺序

```typescript
// 1. React 相关
import { useState, useEffect, memo } from 'react'

// 2. 第三方库
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// 3. UI 组件
import { Button } from '@/components/ui/button'

// 4. 自定义组件
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

// 5. Hooks
import { useDebounce } from '@/hooks'

// 6. Stores
import { useTodoStore, useTodoStats } from '@/stores/todoStore'

// 7. 工具函数
import { cn } from '@/lib/utils'

// 8. 类型
import type { Todo } from '@/types'

// 9. 常量
import { PRIORITY_CONFIG } from '@/constants'
```

### 组件命名规范

- **组件**: PascalCase (e.g., `TodoItem`, `AnimatedCard`)
- **Hooks**: camelCase with `use` prefix (e.g., `useDebounce`, `useTodoStats`)
- **工具函数**: camelCase (e.g., `calculateStats`, `filterTodos`)
- **常量**: UPPER_SNAKE_CASE (e.g., `TODO_STORAGE_KEY`, `PRIORITY_CONFIG`)

### 性能优化最佳实践

1. **使用 React.memo** 包装纯展示组件
2. **使用 useMemo** 缓存计算结果
3. **使用 useCallback** 缓存回调函数
4. **使用选择器 hooks** 避免不必要的重渲染
5. **代码分割** 使用 React.lazy 和 Suspense

### Store 使用规范

```typescript
// ✅ 好的做法 - 使用优化的选择器
const todoStats = useTodoStats()
const filteredTodos = useFilteredTodos()

// ❌ 避免 - 订阅整个 store
const { todos, filter, addTodo } = useTodoStore()
```

### 表单处理规范

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* form fields */}
      </form>
    </Form>
  )
}
```

## 自定义 Hooks

### useDebounce

```typescript
import { useDebounce } from '@/hooks'

const debouncedValue = useDebounce(value, 500)
```

### useLocalStorage

```typescript
import { useLocalStorage } from '@/hooks'

const [value, setValue, removeValue] = useLocalStorage('key', defaultValue)
```

### useTodoStats

```typescript
import { useTodoStats, useFilteredTodos, useTodoById } from '@/stores/todoStore'

const stats = useTodoStats() // { total, completed, active }
const todos = useFilteredTodos()
const todo = useTodoById(id)
```

## 动画规范

### Framer Motion

```typescript
import { motion } from 'framer-motion'
import { SPRING_CONFIG } from '@/constants'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ...SPRING_CONFIG.default }}
  whileHover={{ scale: 1.02 }}
>
  {children}
</motion.div>
```

### 使用 AnimatedCard 组件

```typescript
import { AnimatedCard } from '@/components/common/AnimatedCard'

<AnimatedCard delay={0.1} hoverEffect="lift">
  <CardContent>
    {/* content */}
  </CardContent>
</AnimatedCard>
```

## 错误处理

### 使用错误边界

```typescript
import { ErrorBoundary } from '@/error/ErrorBoundary'

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### 使用 Toast 通知

```typescript
import { toast } from 'sonner'

toast.success('操作成功')
toast.error('操作失败')
toast.info('提示信息')
```

## 类型定义

### 组件 Props

```typescript
import type { BaseComponentProps } from '@/types'

interface MyComponentProps extends BaseComponentProps {
  title: string
  onAction: () => void
}

export const MyComponent = memo(function MyComponent({ 
  title, 
  onAction, 
  className 
}: MyComponentProps) {
  // component logic
})
```

## 路由

### 懒加载页面

```typescript
import { lazy, Suspense } from 'react'
import { PageLoader } from '@/components/common/LoadingSpinner'

const MyPage = lazy(() => import('@/pages/MyPage').then(m => ({ default: m.MyPage })))

<Suspense fallback={<PageLoader />}>
  <MyPage />
</Suspense>
```

## 注意事项

1. **不要使用 `any` 类型** - 保持类型安全
2. **优先使用选择器 hooks** - 避免不必要的重渲染
3. **使用 `cn()` 合并 className** - 保持样式一致性
4. **使用常量配置** - 避免硬编码
5. **添加适当的注释** - 提高代码可读性
