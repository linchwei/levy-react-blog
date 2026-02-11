import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 简单的语法高亮
  const highlightCode = (code: string) => {
    return code
      .replace(
        /(@keyframes|from|to|\d+%)/g,
        '<span class="text-purple-400">$1</span>'
      )
      .replace(
        /(transform|opacity|animation|filter|box-shadow):/g,
        '<span class="text-blue-400">$1</span>:'
      )
      .replace(
        /(translate|scale|rotate|skew|perspective)\w*/g,
        '<span class="text-yellow-400">$1</span>'
      )
      .replace(
        /(#[\da-fA-F]{3,8}|rgba?\([^)]+\))/g,
        '<span class="text-green-400">$1</span>'
      )
      .replace(
        /(\d+(?:\.\d+)?(?:s|ms|px|em|rem|%|deg))/g,
        '<span class="text-orange-400">$1</span>'
      )
      .replace(/(\{|\})/g, '<span class="text-slate-400">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500">$1</span>')
  }

  return (
    <div className="relative group rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {filename && (
            <span className="ml-3 text-xs text-slate-400 font-mono">
              {filename}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <motion.div
            initial={false}
            animate={{ scale: copied ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.div>
          <span className="ml-2">{copied ? '已复制' : '复制'}</span>
        </Button>
      </div>

      {/* Code */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
            className="text-slate-300"
          />
        </pre>
      </div>
    </div>
  )
}
