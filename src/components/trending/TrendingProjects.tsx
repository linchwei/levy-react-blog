import { motion } from 'framer-motion'
import {
  Star,
  GitFork,
  ExternalLink,
  Code2,
  RefreshCw,
  Flame,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTrendingRepos } from '@/hooks/useTrendingRepos'
import type { TrendingRepo } from '@/hooks/useTrendingRepos'
import { useState } from 'react'

interface RepoCardProps {
  repo: TrendingRepo
  index: number
  pageOffset: number
}

function RepoCard({ repo, index, pageOffset }: RepoCardProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      TypeScript: 'bg-blue-500',
      JavaScript: 'bg-yellow-500',
      Python: 'bg-green-500',
      Rust: 'bg-orange-500',
      Go: 'bg-cyan-500',
      Vue: 'bg-emerald-500',
      HTML: 'bg-red-500',
      CSS: 'bg-purple-500',
      Java: 'bg-orange-600',
      'C++': 'bg-pink-500',
    }
    return colors[language] || 'bg-gray-500'
  }

  // 计算全局排名
  const globalRank = pageOffset + index + 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-10 h-10 rounded-full border-2 border-border group-hover:border-primary/50 transition-colors"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center border border-border">
                  <span className="text-xs font-bold text-primary">
                    {globalRank}
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                  {repo.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {repo.owner.login}
                </p>
              </div>
            </div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
            {repo.description || 'No description available'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {repo.language && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}
                  />
                  <span>{repo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{formatNumber(repo.stargazers_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{formatNumber(repo.forks_count)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function RepoCardSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

// 分页组件
interface PaginationProps {
  page: number
  setPage: (page: number) => void
  totalCount: number
  perPage: number
  hasMore: boolean
}

function Pagination({ page, setPage, totalCount, perPage, hasMore }: PaginationProps) {
  const totalPages = Math.ceil(totalCount / perPage)
  const maxVisiblePages = 5

  // 计算显示的页码范围
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 显示第一页
      pages.push(1)
      
      // 计算中间页码
      let startPage = Math.max(2, page - 1)
      let endPage = Math.min(totalPages - 1, page + 1)
      
      // 调整范围以始终显示3个中间页码
      if (page <= 2) {
        endPage = Math.min(totalPages - 1, 4)
      } else if (page >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3)
      }
      
      // 添加省略号
      if (startPage > 2) {
        pages.push('...')
      }
      
      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // 添加省略号
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      
      // 显示最后一页
      pages.push(totalPages)
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 上一页按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 页码按钮 */}
      <div className="flex items-center gap-1">
        {visiblePages.map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={pageNum}
              variant={page === pageNum ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPage(pageNum as number)}
              className="h-9 w-9 min-w-[36px]"
            >
              {pageNum}
            </Button>
          )
        ))}
      </div>

      {/* 下一页按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPage(page + 1)}
        disabled={!hasMore}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function TrendingProjects() {
  const [language, setLanguage] = useState<string>('typescript')
  const [since, setSince] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const perPage = 9

  const { 
    repos, 
    loading, 
    error, 
    refetch, 
    page, 
    setPage, 
    totalCount, 
    hasMore 
  } = useTrendingRepos({
    language,
    since,
    perPage,
  })

  const languageOptions = [
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
    { value: 'vue', label: 'Vue' },
    { value: 'react', label: 'React' },
  ]

  const sinceOptions = [
    { value: 'daily', label: '今日', icon: Calendar },
    { value: 'weekly', label: '本周', icon: Flame },
    { value: 'monthly', label: '本月', icon: TrendingUp },
  ]

  // 计算当前页的起始排名
  const pageOffset = (page - 1) * perPage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            热门前端项目
          </h2>
          <p className="text-muted-foreground mt-1">
            发现 GitHub 上最受欢迎的开源项目
            {!loading && totalCount > 0 && (
              <span className="ml-2 text-sm">
                (共 {totalCount} 个)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Select */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px]">
              <Code2 className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Since Select */}
          <Select
            value={since}
            onValueChange={v => setSince(v as 'daily' | 'weekly' | 'monthly')}
          >
            <SelectTrigger className="w-[120px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sinceOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={loading}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="font-medium">加载失败</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Repo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? // Loading skeletons
            Array.from({ length: perPage }).map((_, i) => (
              <RepoCardSkeleton key={i} />
            ))
          : // Repo cards
            repos.map((repo, index) => (
              <RepoCard 
                key={repo.id} 
                repo={repo} 
                index={index} 
                pageOffset={pageOffset}
              />
            ))}
      </div>

      {/* Pagination */}
      {!loading && repos.length > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalCount={totalCount}
          perPage={perPage}
          hasMore={hasMore}
        />
      )}

      {/* Footer */}
      {!loading && repos.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>
            数据来源于 GitHub API ·
            <a
              href="https://github.com/trending"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              查看完整榜单
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
