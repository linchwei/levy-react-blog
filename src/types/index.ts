/**
 * 全局类型定义
 * Global Type Definitions
 */

// ============================================
// Todo 相关类型
// ============================================
export type Priority = 'low' | 'medium' | 'high'
export type FilterType = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  createdAt: Date
  updatedAt: Date
}

export interface TodoStats {
  total: number
  completed: number
  active: number
}

export interface TodoFormData {
  title: string
  description?: string
  priority: Priority
}

// ============================================
// 代码游乐场类型
// ============================================
export interface CodeTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  preview?: string
  code: {
    html: string
    css: string
    js: string
  }
}

export interface EditorSettings {
  fontSize: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  minimap: boolean
  lineNumbers: 'on' | 'off' | 'relative' | 'interval'
  tabSize: number
}

export type ViewMode = 'split' | 'code' | 'preview'
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

// ============================================
// 通用组件 Props 类型
// ============================================
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface AnimatedCardProps extends BaseComponentProps {
  delay?: number
  duration?: number
  hoverScale?: number
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

// ============================================
// API 相关类型
// ============================================
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// ============================================
// 动画相关类型
// ============================================
export interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string | number[]
}

export interface SpringConfig {
  stiffness?: number
  damping?: number
  mass?: number
}

// ============================================
// 工具函数类型
// ============================================
export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<T>
) => void

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

// ============================================
// 路由相关类型
// ============================================
export interface RouteConfig {
  path: string
  component: React.LazyExoticComponent<React.ComponentType>
  exact?: boolean
  lazy?: boolean
}

// ============================================
// 状态管理类型
// ============================================
export type StoreSelector<T, R> = (state: T) => R

export interface PersistConfig {
  name: string
  version?: number
  partialize?: <T>(state: T) => Partial<T>
}
