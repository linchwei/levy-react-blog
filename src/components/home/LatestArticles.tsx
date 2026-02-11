import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useBlogStore } from '@/stores/blogStore'
import { ArrowUpRight, Clock, Calendar } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
  },
}

// Code-style tag component
function CodeTag({
  children,
  color = 'blue',
}: {
  children: string
  color?: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    purple: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    green: 'text-green-400 border-green-400/30 bg-green-400/10',
    orange: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    pink: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-mono rounded border ${colorMap[color] || colorMap.blue}`}
    >
      <span className="text-muted-foreground">&lt;</span>
      {children}
      <span className="text-muted-foreground">/&gt;</span>
    </span>
  )
}

// Article list item
function ArticleItem({ post, index }: { post: any; index: number }) {


  return (
    <motion.div variants={itemVariants} className="group relative">
      <Link to={`/blog/${post.slug}`}>
        <div className="relative flex items-center gap-6 py-6 px-4 -mx-4 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5">
          {/* Index Number */}
          <div className="relative flex-shrink-0 w-16 text-center">
            <span className="font-mono text-4xl font-bold text-muted-foreground/30 group-hover:text-purple-400/50 transition-colors duration-300">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg font-medium text-foreground group-hover:text-purple-400 transition-colors duration-300 mb-2 line-clamp-1">
              {post.title}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.slice(0, 3).map((tag: string, i: number) => {
                const colors = ['blue', 'purple', 'green', 'orange', 'pink']
                return (
                  <CodeTag key={tag} color={colors[i % colors.length]}>
                    {tag}
                  </CodeTag>
                )
              })}
            </div>
          </div>

          {/* Meta Info */}
          <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min
            </span>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-border/50 group-hover:border-purple-400/50 group-hover:bg-purple-500/10 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>

          {/* Hover Glow Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full group-hover:h-12 transition-all duration-300" />
        </div>
      </Link>

      {/* Divider */}
      <div className="absolute bottom-0 left-16 right-0 h-px bg-gradient-to-r from-border via-border to-transparent group-hover:from-purple-500/30 group-hover:via-blue-500/30 transition-colors duration-300" />
    </motion.div>
  )
}

// Featured Article (Hero Style)
function FeaturedArticle({ post }: { post: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <Link to={`/blog/${post.slug}`}>
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10 border border-border/50 hover:border-purple-500/30 transition-all duration-500">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative grid md:grid-cols-2 gap-6 p-8">
            {/* Left - Content */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  精选文章
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
                {post.title}
              </h3>

              <p className="text-muted-foreground mb-6 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.slice(0, 4).map((tag: string, i: number) => (
                  <CodeTag
                    key={tag}
                    color={['purple', 'blue', 'green', 'orange'][i]}
                  >
                    {tag}
                  </CodeTag>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} 分钟阅读
                </span>
                <span className="flex items-center gap-1.5 group-hover:text-purple-400 transition-colors">
                  阅读全文
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative aspect-video md:aspect-auto rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-6xl font-bold text-purple-400/20 mb-2">
                    01
                  </div>
                  <div className="text-sm text-muted-foreground">Featured</div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 border border-purple-500/20 rounded-full" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-blue-500/20 rounded-full" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function LatestArticles() {
  const { getFeaturedPosts } = useBlogStore()
  const posts = getFeaturedPosts()
  const featuredPost = posts[0]
  const otherPosts = posts.slice(1, 5) // Show 4 more articles

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                最新文章
              </span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              分享技术心得、学习笔记和开发经验
            </p>
          </div>
        </motion.div>

        {/* Featured Article */}
        {featuredPost && <FeaturedArticle post={featuredPost} />}

        {/* Article List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* List Header */}
          <div className="flex items-center gap-4 py-4 px-4 text-xs font-mono text-muted-foreground border-b border-border/50">
            <span className="w-16 text-center">#</span>
            <span className="flex-1">TITLE</span>
            <span className="hidden sm:block w-32 text-right">DATE</span>
            <span className="w-10"></span>
          </div>

          {/* Articles */}
          <div className="relative">
            {otherPosts.map((post, index) => (
              <ArticleItem key={post.id} post={post} index={index} />
            ))}
          </div>

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 hover:border-purple-400/50 hover:bg-purple-500/5 transition-all duration-300 group"
            >
              <span className="font-mono text-sm text-muted-foreground group-hover:text-purple-400 transition-colors">
                viewAll()
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
