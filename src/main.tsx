import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProviders } from './providers/AppProviders.tsx'

/**
 * 应用入口文件
 * Application Entry Point
 * 
 * 使用 StrictMode 启用 React 严格模式
 * 通过 AppProviders 提供全局上下文
 */
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Please ensure there is a div with id "root" in your HTML.')
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
