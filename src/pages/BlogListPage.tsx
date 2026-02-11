import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { useBlogStore } from '@/stores/blogStore'
import { Clock, Eye, ChevronRight } from 'lucide-react'

const categories = ['全部', 'Frontend', 'Backend', 'Design', 'DevOps']

const tagColors: Record<string, string> = {
  React:
    'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
  TypeScript:
    'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
  Vue: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border-green-200 dark:border-green-500/30',
  Node: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border-green-200 dark:border-green-500/30',
  Python:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30',
  AI: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
  LLM: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
  CSS: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border-pink-200 dark:border-pink-500/30',
  Tailwind:
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30',
  default:
    'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300 border-slate-200 dark:border-slate-500/30',
}

interface Post {
  id: string
  slug: string
  title: string
  tags: string[]
  publishedAt: string | Date
  readingTime: number
  views: number
}

// Blinking cursor component
function BlinkingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      className="inline-block w-2 h-5 bg-purple-500 ml-1"
    />
  )
}

// Tag component with enhanced styling
function Tag({ children }: { children: string }) {
  const colorClass = tagColors[children] || tagColors.default
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border shadow-sm backdrop-blur-sm ${colorClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60" />
      {children}
    </motion.span>
  )
}

// Article list item
function ArticleItem({ post, index }: { post: Post; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link to={`/blog/${post.slug}`}>
        <div className="relative flex items-start gap-4 py-5 px-4 -mx-4 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50">
          {/* Line Number */}
          <div className="flex-shrink-0 w-12 text-right">
            <span
              className={`font-mono text-sm transition-colors duration-200 ${
                isHovered
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              {String(index + 1).padStart(3, '0')}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3
              className={`font-mono text-base mb-2 transition-colors duration-200 line-clamp-1 ${
                isHovered
                  ? 'text-purple-600 dark:text-purple-300'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <span className="text-slate-400 dark:text-slate-500">"</span>
              {post.title}
              <span className="text-slate-400 dark:text-slate-500">"</span>
              {isHovered && <BlinkingCursor />}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.slice(0, 3).map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          {/* Meta Info */}
          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-slate-600">date:</span>
              {new Date(post.publishedAt).toISOString().split('T')[0]}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}min
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {post.views}
            </span>
          </div>

          {/* Arrow */}
          <div
            className={`flex-shrink-0 transition-all duration-200 ${
              isHovered
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-2'
            }`}
          >
            <ChevronRight className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </Link>

      {/* Divider */}
      <div className="ml-16 h-px bg-slate-200 dark:bg-slate-800/50" />
    </motion.div>
  )
}

// Background decoration component
function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  )
}

export function BlogListPage() {
  const { setSelectedCategory, setSearchQuery, getFilteredPosts } =
    useBlogStore()
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchValue, setSearchValue] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const filteredPosts = getFilteredPosts()

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setSelectedCategory(category === '全部' ? null : category)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setSearchQuery(value)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecoration />
      <Navigation />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header - Terminal Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Terminal Window */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
              {/* Title Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">
                    levy@blog: ~/articles
                  </span>
                </div>
                <div className="w-16" />
              </div>

              {/* Terminal Content */}
              <div className="p-6">
                <div className="font-mono text-sm space-y-2">
                  <div className="text-muted-foreground">
                    <span className="text-green-600 dark:text-green-400">
                      ➜
                    </span>
                    <span className="text-blue-600 dark:text-blue-400"> ~</span>
                    <span className="text-foreground"> ls -la articles/</span>
                  </div>
                  <div className="text-muted-foreground">
                    total {filteredPosts.length}
                  </div>
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold text-foreground pt-4"
                  >
                    <span className="text-purple-600 dark:text-purple-400">
                      const
                    </span>{' '}
                    <span className="text-yellow-600 dark:text-yellow-300">
                      articles
                    </span>{' '}
                    <span className="text-muted-foreground">=</span>{' '}
                    <span className="text-foreground">[</span>
                  </motion.h1>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search - Terminal Input Style */}
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-lg border border-border focus-within:border-purple-500/50 transition-colors shadow-sm">
                <span className="text-green-600 dark:text-green-400 font-mono text-sm">
                  ➜
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                  ~
                </span>
                <span className="text-muted-foreground font-mono text-sm">
                  $
                </span>
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => handleSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder='grep -r "关键词" .'
                  className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm placeholder:text-muted-foreground ml-2"
                />
                {isSearchFocused && <BlinkingCursor />}
              </div>
            </div>

            {/* Categories - Code Comments */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-mono text-xs">
                {'/* Filter by category */'}
              </span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30'
                      : 'text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                  }`}
                >
                  {category === '全部' ? '*' : category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Articles List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card/50 rounded-xl border border-border overflow-hidden shadow-sm"
          >
            {/* List Header */}
            <div className="flex items-center gap-4 px-4 py-3 bg-muted/50 border-b border-border text-xs font-mono text-muted-foreground">
              <span className="w-12 text-right">#</span>
              <span className="flex-1">{'// Article.title'}</span>
              <span className="hidden md:block w-32 text-right">
                {'// Meta'}
              </span>
              <span className="w-5" />
            </div>

            {/* Articles */}
            <div className="px-4">
              <AnimatePresence mode="wait">
                {filteredPosts.map((post, index) => (
                  <ArticleItem
                    key={post.id}
                    post={post as Post}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* List Footer */}
            <div className="px-4 py-4 border-t border-border">
              <div className="font-mono text-sm text-muted-foreground">
                <span className="text-foreground">]</span>
                <span className="text-muted-foreground">;</span>
                <span className="text-muted-foreground/60 ml-4">
                  {'//'} 共 {filteredPosts.length} 篇文章
                </span>
              </div>
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="font-mono text-muted-foreground">
                <span className="text-yellow-600 dark:text-yellow-400">
                  Warning:
                </span>{' '}
                No articles found matching your criteria
              </div>
              <div className="mt-2 text-muted-foreground/60 font-mono text-sm">
                Error: 404_NOT_FOUND
              </div>
            </motion.div>
          )}

          {/* Terminal Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 font-mono text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">➜</span>
              <span className="text-blue-600 dark:text-blue-400">~</span>
              <span className="animate-pulse">_</span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
