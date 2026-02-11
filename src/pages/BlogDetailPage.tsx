import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Tag,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBlogStore } from '@/stores/blogStore'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  vscDarkPlus,
  prism,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import { ArticleSummary } from '@/components/ai/ArticleSummary'
import { useArticleSummary } from '@/hooks/useArticleSummary'
import { ToolboxDropdown } from '@/components/tools/ToolboxDropdown'

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { getPostBySlug, incrementViews, incrementLikes, posts } =
    useBlogStore()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const post = slug ? getPostBySlug(slug) : undefined

  // AI 文章总结
  const {
    summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    isConfigured: isAIConfigured,
    generate: generateSummary,
  } = useArticleSummary({
    articleTitle: post?.title || '',
    articleContent: post?.content || '',
    autoGenerate: false,
  })

  // 获取相关文章
  const relatedPosts = post
    ? posts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3)
    : []

  // 检测深色模式
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()

    // 监听主题变化
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (post) {
      incrementViews(post.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id])

  // 复制代码到剪贴板
  const handleCopyCode = async (code: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(codeId)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Navigation />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              文章未找到
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              抱歉，您访问的文章不存在或已被删除。
            </p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回文章列表
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('分享取消')
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      // 可以添加toast提示
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-50/80 via-slate-50/60 to-slate-50 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            返回文章列表
          </motion.button>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              {post.category === 'Frontend' && '前端开发'}
              {post.category === 'Design' && 'UI/UX设计'}
              {post.category === 'AI' && '人工智能'}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed"
          >
            {post.excerpt}
          </motion.p>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} 分钟阅读</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.views.toLocaleString()} 阅读</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{post.likes} 喜欢</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="prose prose-slate dark:prose-invert prose-lg max-w-none"
            >
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300 my-6">
                      {children}
                    </blockquote>
                  ),
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const code = String(children).replace(/\n$/, '')
                    const codeId = Math.random().toString(36).substr(2, 9)

                    if (!inline && match) {
                      return (
                        <div className="relative group my-6">
                          {/* 语言标签 */}
                          <div className="absolute top-0 left-4 -translate-y-1/2 z-10">
                            <span className="px-3 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                              {match[1]}
                            </span>
                          </div>

                          {/* 复制按钮 */}
                          <button
                            onClick={() => handleCopyCode(code, codeId)}
                            className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="复制代码"
                          >
                            {copiedCode === codeId ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* 代码高亮 */}
                          <SyntaxHighlighter
                            style={isDarkMode ? vscDarkPlus : prism}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.75rem',
                              padding: '2rem 1.5rem 1.5rem',
                              fontSize: '0.875rem',
                              lineHeight: '1.7',
                            }}
                            showLineNumbers={true}
                            lineNumberStyle={{
                              minWidth: '2.5em',
                              paddingRight: '1em',
                              color: isDarkMode ? '#6e7681' : '#a0aec0',
                            }}
                            {...props}
                          >
                            {code}
                          </SyntaxHighlighter>
                        </div>
                      )
                    }

                    return (
                      <code
                        className="px-1.5 py-0.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    标签
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() =>
                        navigate(`/blog?tag=${encodeURIComponent(tag)}`)
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex items-center gap-4">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => incrementLikes(post.id)}
                >
                  <Heart className="w-4 h-4" />
                  喜欢 ({post.likes})
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </Button>
              </div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-8"
            >
              {/* AI Article Summary */}
              {post && (
                <ArticleSummary
                  summary={summary}
                  isLoading={isSummaryLoading}
                  error={summaryError}
                  isConfigured={isAIConfigured}
                  onGenerate={generateSummary}
                />
              )}

              {/* Author Card */}
              <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  关于作者
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    L
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Levy
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      前端工程师 / 技术博主
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  热爱前端开发和UI设计，专注于React生态和AI技术应用。
                </p>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    相关文章
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map(relatedPost => (
                      <button
                        key={relatedPost.id}
                        onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                        className="w-full text-left group"
                      >
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {new Date(relatedPost.publishedAt).toLocaleDateString(
                            'zh-CN'
                          )}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  文章分类
                </h3>
                <div className="space-y-2">
                  {['Frontend', 'Design', 'AI'].map(category => (
                    <button
                      key={category}
                      onClick={() => navigate(`/blog?category=${category}`)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {category === 'Frontend' && '前端开发'}
                        {category === 'Design' && 'UI/UX设计'}
                        {category === 'AI' && '人工智能'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Toolbox */}
              <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  开发工具
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  探索我开发的交互式工具集合
                </p>
                <ToolboxDropdown />
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* AI Chat Widget */}
      {post && (
        <AIChatWidget articleTitle={post.title} articleContent={post.content} />
      )}

      <Footer />
    </div>
  )
}
