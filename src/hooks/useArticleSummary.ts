import { useState, useCallback, useEffect } from 'react'
import { generateSummary, type ArticleSummary } from '@/services/summaryService'
import { isAIConfigured } from '@/services/aiService'

interface UseArticleSummaryOptions {
  articleTitle: string
  articleContent: string
  autoGenerate?: boolean
}

const STORAGE_KEY = 'article_summaries'

// 从 localStorage 读取缓存的总结
function getCachedSummary(articleTitle: string): ArticleSummary | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (!cached) return null
    
    const summaries = JSON.parse(cached)
    return summaries[articleTitle] || null
  } catch {
    return null
  }
}

// 缓存总结到 localStorage
function cacheSummary(articleTitle: string, summary: ArticleSummary) {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    const summaries = cached ? JSON.parse(cached) : {}
    
    // 只保留最近20篇文章的总结
    const keys = Object.keys(summaries)
    if (keys.length >= 20) {
      delete summaries[keys[0]]
    }
    
    summaries[articleTitle] = summary
    localStorage.setItem(STORAGE_KEY, JSON.stringify(summaries))
  } catch (error) {
    console.error('缓存总结失败:', error)
  }
}

export function useArticleSummary({
  articleTitle,
  articleContent,
  autoGenerate = false,
}: UseArticleSummaryOptions) {
  const [summary, setSummary] = useState<ArticleSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  // 检查 API 配置
  useEffect(() => {
    setIsConfigured(isAIConfigured())
  }, [])

  // 生成总结
  const generate = useCallback(async () => {
    if (!articleTitle || !articleContent) return

    // 检查缓存
    const cached = getCachedSummary(articleTitle)
    if (cached) {
      setSummary(cached)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await generateSummary(articleTitle, articleContent)
      setSummary(result)
      cacheSummary(articleTitle, result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成总结失败'
      setError(errorMessage)
      console.error('生成总结失败:', err)
    } finally {
      setIsLoading(false)
    }
  }, [articleTitle, articleContent])

  // 自动生成（如果配置了 API Key）
  useEffect(() => {
    if (autoGenerate && isConfigured && !summary && !isLoading) {
      generate()
    }
  }, [autoGenerate, isConfigured, summary, isLoading, generate])

  // 清除总结
  const clear = useCallback(() => {
    setSummary(null)
    setError(null)
  }, [])

  return {
    summary,
    isLoading,
    error,
    isConfigured,
    generate,
    clear,
  }
}
