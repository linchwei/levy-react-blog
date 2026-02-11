/**
 * 全局常量定义
 * Global Constants
 */

// ============================================
// Todo 相关常量
// ============================================
export const TODO_STORAGE_KEY = 'todo-storage-v1'

export const PRIORITY_CONFIG = {
  low: {
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/10',
    label: '低优先级',
    icon: '🔵',
    gradient: 'from-blue-500 to-cyan-500',
  },
  medium: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-500/20',
    bgColor: 'bg-yellow-500/10',
    label: '中优先级',
    icon: '🟡',
    gradient: 'from-yellow-500 to-orange-500',
  },
  high: {
    color: 'bg-red-500',
    textColor: 'text-red-600',
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/10',
    label: '高优先级',
    icon: '🔴',
    gradient: 'from-red-500 to-pink-500',
  },
} as const

export const FILTER_LABELS: Record<string, string> = {
  all: '全部',
  active: '进行中',
  completed: '已完成',
}

// ============================================
// 动画相关常量
// ============================================
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
}

export const SPRING_CONFIG = {
  default: { stiffness: 300, damping: 30 },
  gentle: { stiffness: 100, damping: 20 },
  stiff: { stiffness: 500, damping: 30 },
  bounce: { stiffness: 400, damping: 10 },
}

export const STAGGER_DELAY = 0.05

// ============================================
// 代码游乐场常量
// ============================================
export const EDITOR_DEFAULT_SETTINGS = {
  fontSize: 14,
  wordWrap: 'on' as const,
  minimap: false,
  lineNumbers: 'on' as const,
  tabSize: 2,
}

export const DEBOUNCE_DELAY = 500

export const PREVIEW_TIMEOUT = 30000

// ============================================
// UI 相关常量
// ============================================
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const Z_INDEX = {
  dropdown: 50,
  sticky: 100,
  fixed: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
  toast: 600,
}

// ============================================
// 错误信息常量
// ============================================
export const ERROR_MESSAGES = {
  generic: '发生错误，请稍后重试',
  network: '网络连接失败，请检查网络',
  timeout: '请求超时，请稍后重试',
  notFound: '未找到请求的资源',
  unauthorized: '未授权，请重新登录',
  validation: '表单验证失败，请检查输入',
}

// ============================================
// 成功信息常量
// ============================================
export const SUCCESS_MESSAGES = {
  save: '保存成功',
  delete: '删除成功',
  update: '更新成功',
  create: '创建成功',
  copy: '复制成功',
}
