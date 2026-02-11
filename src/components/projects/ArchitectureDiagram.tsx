import { useEffect, useState } from 'react'
import mermaid from 'mermaid'
import type { ArchitectureDiagramProps } from '@/types/project'

export function ArchitectureDiagram({
  diagram,
  className,
}: ArchitectureDiagramProps) {
  const [isDark, setIsDark] = useState(false)
  const [svgContent, setSvgContent] = useState<string>('')
  const [hasError, setHasError] = useState(false)

  // 检测当前主题
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }

    checkTheme()

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          checkTheme()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  // 渲染 Mermaid 图表
  useEffect(() => {
    if (!diagram) {
      setHasError(true)
      return
    }

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        mermaid.initialize({
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          startOnLoad: false,
        })

        const { svg } = await mermaid.render(id, diagram)
        setSvgContent(svg)
        setHasError(false)
      } catch (err) {
        console.error('Mermaid render error:', err)
        console.error('Diagram content:', diagram)
        setHasError(true)
      }
    }

    renderDiagram()
  }, [diagram, isDark])

  if (hasError) {
    return (
      <div
        className={`rounded-lg p-6 ${
          isDark ? 'bg-slate-900' : 'bg-slate-50 border border-border'
        } ${className || ''}`}
      >
        <div className="text-red-500 mb-2">架构图渲染失败</div>
        {diagram && (
          <pre
            className={`text-sm overflow-x-auto p-4 rounded ${isDark ? 'bg-slate-800' : 'bg-white'}`}
          >
            <code>{diagram}</code>
          </pre>
        )}
      </div>
    )
  }

  if (!svgContent) {
    return (
      <div
        className={`rounded-lg p-6 flex items-center justify-center min-h-[200px] ${
          isDark ? 'bg-slate-900' : 'bg-slate-50 border border-border'
        } ${className || ''}`}
      >
        <div className="text-muted-foreground">加载架构图...</div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-lg p-6 overflow-x-auto transition-colors ${
        isDark ? 'bg-slate-900' : 'bg-slate-50 border border-border'
      } ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
