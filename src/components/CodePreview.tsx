import { useEffect, useRef, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import { motion, AnimatePresence } from 'framer-motion'
import * as React from 'react'

interface CodePreviewProps {
  code: {
    html: string
    css: string
    js: string
  }
  onError?: (error: Error) => void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onConsole?: (log: {
    type: string
    message: string
    timestamp: number
  }) => void
}

// 使用 Babel 编译的预览组件
export function CodePreview({ code, onError }: CodePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // sandboxRef is used for CodeSandbox instance management
  const babelLoadedRef = useRef(false)

  // 动态加载 Babel
  useEffect(() => {
    if (babelLoadedRef.current) return

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@babel/standalone/babel.min.js'
    script.async = true
    script.onload = () => {
      babelLoadedRef.current = true
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const executeCode = useCallback(async () => {
    if (!containerRef.current || !babelLoadedRef.current) return

    try {
      // 等待 Babel 加载
      if (!(window as any).Babel) {
        setTimeout(executeCode, 100)
        return
      }

      const Babel = (window as any).Babel

      // 编译 JSX
      const compiledJS = Babel.transform(code.js, {
        presets: ['react'],
        filename: 'user-code.js',
      }).code

      // 创建 Shadow DOM 容器
      const container = containerRef.current

      // 清理之前的内容
      if (container.shadowRoot) {
        container.shadowRoot.innerHTML = ''
      } else {
        container.attachShadow({ mode: 'open' })
      }

      const shadowRoot = container.shadowRoot!

      // 添加 Tailwind CDN
      const tailwindScript = document.createElement('script')
      tailwindScript.src = 'https://cdn.tailwindcss.com'
      shadowRoot.appendChild(tailwindScript)

      // 添加样式
      const styleEl = document.createElement('style')
      styleEl.textContent = code.css
      shadowRoot.appendChild(styleEl)

      // 创建挂载点
      const mountPoint = document.createElement('div')
      mountPoint.id = 'root'
      shadowRoot.appendChild(mountPoint)

      // 创建 React 根节点
      const root = ReactDOM.createRoot(mountPoint)

      // 创建用户组件
      const UserComponent = () => {
        try {
          // 创建安全的执行环境
          const sandbox = {
            React,
            useState: React.useState,
            useEffect: React.useEffect,
            useRef: React.useRef,
            useCallback: React.useCallback,
            useMemo: React.useMemo,
            motion,
            AnimatePresence,
            console: window.console,
          }

          // 构建完整的组件代码
          const fullCode = `
            ${compiledJS}
            
            return function App() {
              const [state, setState] = React.useState({});
              
              try {
                ${code.js}
                
                return React.createElement('div', { 
                  className: 'min-h-screen bg-gray-50 p-4'
                }, ${JSON.stringify(code.html)});
              } catch (err) {
                console.error(err);
                return React.createElement('div', { 
                  className: 'p-4 text-red-500' 
                }, 'Error: ' + err.message);
              }
            }
          `

          const func = new Function(...Object.keys(sandbox), fullCode)
          const Component = func(...Object.values(sandbox))

          return React.createElement(Component)
        } catch (err: any) {
          return React.createElement(
            'div',
            {
              className: 'p-4 text-red-500',
            },
            'Error: ' + err.message
          )
        }
      }

      root.render(React.createElement(UserComponent))
    } catch (error: any) {
      onError?.(error)
    }
  }, [code, onError])

  useEffect(() => {
    executeCode()
  }, [executeCode])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] bg-white rounded-lg overflow-hidden"
    />
  )
}

// 简化的预览组件 - 使用 iframe 但优化加载
export function FastCodePreview({ code }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const prevCodeRef = useRef(code)

  useEffect(() => {
    if (!iframeRef.current) return

    // 只有当代码真正变化时才更新
    if (JSON.stringify(prevCodeRef.current) === JSON.stringify(code)) {
      return
    }
    prevCodeRef.current = code

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
  <style>
    ${code.css}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useRef, useCallback } = React;
    const { motion, AnimatePresence } = window.Motion;
    
    try {
      function App() {
        ${code.js}
        
        return (
          <div className="min-h-screen bg-gray-50">
            ${code.html}
          </div>
        );
      }
      
      ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    } catch (err) {
      document.getElementById('root').innerHTML = '<div style="padding: 20px; color: red;">Error: ' + err.message + '</div>';
    }
  </script>
</body>
</html>`

    iframeRef.current.srcdoc = html
  }, [code])

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full min-h-[300px] border-0 rounded-lg"
      sandbox="allow-scripts allow-same-origin"
      title="Code Preview"
    />
  )
}

export default CodePreview
