import { Component, type ReactNode, type ErrorInfo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { ERROR_MESSAGES } from '@/constants'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * 错误边界组件
 * Error Boundary Component
 *
 * 捕获子组件树中的 JavaScript 错误，记录错误并显示降级 UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // 调用外部错误处理回调
    this.props.onError?.(error, errorInfo)

    // 记录错误日志
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys } = this.props
    const { hasError } = this.state

    // 当 resetKeys 变化时重置错误状态
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      )

      if (hasResetKeyChanged) {
        this.resetErrorBoundary()
      }
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // 使用自定义 fallback 或默认错误 UI
      if (fallback) {
        return fallback
      }

      return (
        <DefaultErrorFallback
          error={error!}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return children
  }
}

/**
 * 默认错误回退 UI
 */
function DefaultErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-destructive/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4"
            >
              <AlertCircle className="w-8 h-8 text-destructive" />
            </motion.div>
            <CardTitle className="text-xl">出错了</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              {ERROR_MESSAGES.generic}
            </p>

            {import.meta.env.DEV && (
              <div className="bg-muted p-3 rounded-lg text-sm font-mono text-destructive overflow-auto max-h-32">
                <p className="font-semibold">{error.name}:</p>
                <p>{error.message}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={resetErrorBoundary}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
              >
                <Home className="w-4 h-4 mr-2" />
                首页
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

/**
 * 异步错误边界
 * 用于包裹可能抛出异步错误的组件
 */
export class AsyncErrorBoundary extends ErrorBoundary {
  static getDerivedStateFromProps(_props: Props, _state: State): State | null {
    // 可以在这里添加额外的逻辑
    return null
  }
}

/**
 * 局部错误边界
 * 用于包裹小组件，显示更紧凑的错误 UI
 */
export function LocalErrorBoundary({
  children,
  onReset,
}: {
  children: ReactNode
  onReset?: () => void
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">加载失败</p>
          <Button size="sm" variant="ghost" onClick={onReset}>
            <RefreshCw className="w-3 h-3 mr-1" />
            重试
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
