import { useState, useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  isDark?: boolean
  className?: string
}

export function CodeBlock({ code, language = 'text', isDark = false, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [code])

  const normalizedLanguage = language?.toLowerCase() || 'text'
  const validLanguages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust',
    'html', 'css', 'scss', 'sass', 'less', 'json', 'xml', 'yaml', 'markdown', 'md',
    'sql', 'bash', 'shell', 'powershell', 'dockerfile', 'nginx', 'graphql',
    'jsx', 'tsx', 'vue', 'svelte', 'php', 'ruby', 'swift', 'kotlin', 'scala',
    'r', 'matlab', 'lua', 'perl', 'haskell', 'clojure', 'erlang', 'elixir',
    'dart', 'julia', 'groovy', 'kotlin', 'scala', 'solidity', 'vyper'
  ]
  const lang = validLanguages.includes(normalizedLanguage) ? normalizedLanguage : 'text'

  return (
    <div className={cn('relative group rounded-lg overflow-hidden my-4', className)}>
      {/* Language label */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2 text-xs font-medium',
        isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-600'
      )}>
        <span className="uppercase">{language || 'text'}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={cn(
            'h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity',
            isDark ? 'hover:bg-zinc-700 text-zinc-400' : 'hover:bg-gray-200 text-gray-600'
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              复制
            </>
          )}
        </Button>
      </div>

      {/* Code content */}
      <SyntaxHighlighter
        language={lang}
        style={isDark ? vscDarkPlus : vs}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          backgroundColor: isDark ? '#1e1e1e' : '#fafafa',
        }}
        showLineNumbers
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: isDark ? '#4b5563' : '#9ca3af',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
