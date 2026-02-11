import { type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/error/ErrorBoundary'

interface AppProvidersProps {
  children: ReactNode
}

// 生产环境使用 basename，开发环境不使用
const basename = import.meta.env.PROD ? '/levy-react-blog' : '/'

/**
 * 应用级 Providers 组合
 * Application-level Providers Composition
 *
 * 集中管理所有全局 Providers，保持入口文件简洁
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        {children}
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

/**
 * 页面级 Providers
 * 用于包裹单个页面，提供页面级别的上下文
 */
export function PageProviders({ children }: AppProvidersProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
