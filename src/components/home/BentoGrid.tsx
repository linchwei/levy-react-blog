import { useRef, useState, useCallback } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { useTodoStats } from '@/stores/todoStore'
import { useBlogStore } from '@/stores/blogStore'
import {
  CheckSquare,
  FileText,
  FolderGit2,
  User,
  Wrench,
  Clock,
  ArrowUpRight,
  Sparkles,
  Palette,
  Terminal,
  Box,
  Activity,
  TrendingUp,
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
}

// Spotlight card component
function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={`group relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  )
}

// 3D Tilt Card Component
function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg'])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const xPct = mouseX / width - 0.5
      const yPct = mouseY / height - 0.5
      x.set(xPct)
      y.set(yPct)
    },
    [x, y]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  )
}

// Animated number component
function AnimatedNumber({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 })
  const display = useTransform(spring, current => Math.round(current))

  if (isInView) {
    spring.set(value)
  }

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

// Floating particles component
function FloatingParticles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full bg-linear-to-r ${color}`}
          style={{
            right: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export function BentoGrid() {
  const todoStats = useTodoStats()
  const { posts, projects } = useBlogStore()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const items = [
    {
      id: 'articles',
      title: '技术文章',
      description: '分享前端开发经验与技术见解',
      icon: FileText,
      href: '/blog',
      stats: posts.length,
      suffix: '篇',
      statLabel: '文章',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/5 to-cyan-500/5',
      size: 'large',
      featured: true,
    },
    {
      id: 'projects',
      title: '开源项目',
      description: '个人作品与技术实践',
      icon: FolderGit2,
      href: '/projects',
      stats: projects.length,
      suffix: '个',
      statLabel: '项目',
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/5 to-pink-500/5',
      size: 'large',
      featured: true,
    },
    {
      id: 'tools',
      title: '开发工具',
      description: 'CSS动画、代码游乐场、性能分析等',
      icon: Wrench,
      href: '/tools',
      stats: 7,
      suffix: '个',
      statLabel: '工具',
      color: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/5 to-orange-500/5',
      size: 'medium',
      subItems: [
        { icon: Palette, label: 'CSS动画', color: 'text-pink-500' },
        { icon: Terminal, label: '代码', color: 'text-emerald-500' },
        { icon: Box, label: '3D', color: 'text-blue-500' },
        { icon: Activity, label: '性能', color: 'text-red-500' },
      ],
    },
    {
      id: 'todos',
      title: '待办事项',
      description: '高效管理日常任务',
      icon: CheckSquare,
      href: '/todo',
      stats: todoStats.active,
      suffix: '',
      statLabel: '进行中',
      color: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/5 to-teal-500/5',
      size: 'small',
    },
    {
      id: 'about',
      title: '关于我',
      description: '了解更多关于我的故事',
      icon: User,
      href: '/about',
      stats: null,
      suffix: '',
      statLabel: '点击查看',
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/5 to-emerald-500/5',
      size: 'small',
    },
    {
      id: 'timeline',
      title: '成长时间线',
      description: '我的技术成长历程',
      icon: Clock,
      href: '/timeline',
      stats: null,
      suffix: '',
      statLabel: '查看经历',
      color: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/5 to-purple-500/5',
      size: 'small',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/30 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            探索更多
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              我的数字空间
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            在这里你可以找到我的文章、项目、工具等各种内容，
            <br className="hidden sm:block" />
            每一个模块都是我精心打造的数字作品
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {items.map(item => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`${
                item.size === 'large' ? 'md:col-span-1 lg:col-span-1' : ''
              } ${item.featured ? 'lg:row-span-1' : ''}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <SpotlightCard>
                <TiltCard>
                  <Link to={item.href}>
                    <Card
                      className={`group relative overflow-hidden h-full bg-linear-to-br ${item.bgGradient} border-border/50 hover:border-purple-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer`}
                    >
                      {/* Animated background */}
                      <motion.div
                        className={`absolute inset-0 bg-linear-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      />

                      {/* Floating particles for featured items */}
                      {item.featured && (
                        <FloatingParticles color={item.color} />
                      )}

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>

                      <div className="p-6 h-full flex flex-col relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            className={`p-3 rounded-xl bg-linear-to-r ${item.color} shadow-lg`}
                          >
                            <item.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -10, scale: 0.8 }}
                            animate={{
                              opacity: hoveredItem === item.id ? 1 : 0,
                              x: hoveredItem === item.id ? 0 : -10,
                              scale: hoveredItem === item.id ? 1 : 0.8,
                            }}
                            transition={{ duration: 0.2 }}
                            className="p-2 rounded-lg bg-accent"
                          >
                            <ArrowUpRight className="w-5 h-5 text-purple-400" />
                          </motion.div>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.description}
                        </p>

                        {/* Stats */}
                        {item.stats !== null && (
                          <div className="mt-auto flex items-center gap-2">
                            <span className="text-2xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                              <AnimatedNumber
                                value={item.stats}
                                suffix={item.suffix}
                              />
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {item.statLabel}
                            </span>
                          </div>
                        )}

                        {/* Sub items for tools */}
                        {item.subItems && (
                          <div className="mt-auto flex items-center gap-2 flex-wrap">
                            {item.subItems.map((sub, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i, type: 'spring' }}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent text-xs"
                              >
                                <sub.icon className={`w-3 h-3 ${sub.color}`} />
                                <span className="text-muted-foreground">
                                  {sub.label}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Progress bar for featured items */}
                        {item.featured && (
                          <motion.div className="mt-4 h-1 rounded-full bg-accent overflow-hidden">
                            <motion.div
                              className={`h-full bg-linear-to-r ${item.color}`}
                              initial={{ width: '0%' }}
                              whileInView={{ width: '75%' }}
                              transition={{
                                duration: 1.2,
                                delay: 0.5,
                                ease: 'easeOut',
                              }}
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Corner decoration */}
                      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-linear-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </Card>
                  </Link>
                </TiltCard>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            想要了解更多？查看我的完整作品集
          </p>
          <Link to="/projects">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
            >
              <TrendingUp className="w-5 h-5" />
              查看全部作品
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
