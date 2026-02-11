import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, FileText, Users, Clock, Lightbulb, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ArticleSummary as ArticleSummaryType } from '@/services/summaryService'

interface ArticleSummaryProps {
  summary: ArticleSummaryType | null
  isLoading: boolean
  error: string | null
  isConfigured: boolean
  onGenerate: () => void
}

export function ArticleSummary({
  summary,
  isLoading,
  error,
  isConfigured,
  onGenerate,
}: ArticleSummaryProps) {
  // 未配置 API Key
  if (!isConfigured) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                AI 总结未启用
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                请在 .env.local 中配置 DeepSeek API Key 以启用文章总结功能
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 加载中
  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <h3 className="font-semibold text-slate-900 dark:text-white">AI 正在总结...</h3>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[95%]" />
            <Skeleton className="h-3 w-[85%]" />
            <Skeleton className="h-3 w-[90%]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // 错误状态
  if (error) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                生成总结失败
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {error}
              </p>
              <Button size="sm" variant="outline" onClick={onGenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 未生成总结
  if (!summary) {
    return (
      <Card className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
            AI 文章总结
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            使用 DeepSeek 大模型快速了解文章核心内容
          </p>
          <Button onClick={onGenerate} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            生成总结
          </Button>
        </CardContent>
      </Card>
    )
  }

  // 显示总结内容
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border-blue-200 dark:border-blue-800 overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">AI 文章总结</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={onGenerate}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              重新生成
            </Button>
          </div>

          {/* Overview */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">文章概要</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
              {summary.overview}
            </p>
          </div>

          {/* Key Points */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">关键要点</span>
            </div>
            <ul className="space-y-2 pl-6">
              {summary.keyPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                适合：{summary.targetAudience}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {summary.readingTime}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
