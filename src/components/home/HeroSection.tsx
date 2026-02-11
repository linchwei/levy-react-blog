import { useEffect, useState, useRef, useCallback } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Sparkles,
  Code2,
  Zap,
  ChevronDown,
  Award,
  Briefcase,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react'

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/linchwei',
    label: 'GitHub',
    color: 'from-gray-600 to-gray-800',
    stats: '20+ repos',
  },
  {
    icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter',
    color: 'from-sky-400 to-blue-500',
    stats: '1K+ 关注',
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    color: 'from-blue-500 to-blue-700',
    stats: '500+ 连接',
  },
  {
    icon: Mail,
    href: 'mailto:levy0802@qq.com',
    label: 'Email',
    color: 'from-red-400 to-pink-500',
    stats: '随时联系',
  },
]

const stats = [
  { value: 5, suffix: '+', label: '年开发经验', icon: Briefcase },
  { value: 50, suffix: '+', label: '技术文章', icon: Code2 },
  { value: 20, suffix: '+', label: '开源项目', icon: Sparkles },
  { value: 100, suffix: '%', label: '交付质量', icon: Award },
]

const techStack = [
  { name: 'React', color: '#61DAFB', category: 'Frontend' },
  { name: 'TypeScript', color: '#3178C6', category: 'Language' },
  { name: 'Vue.js', color: '#4FC08D', category: 'Frontend' },
  { name: 'Node.js', color: '#339933', category: 'Backend' },
  { name: 'Python', color: '#3776AB', category: 'Backend' },
  { name: 'AI/LLM', color: '#FF6B6B', category: 'AI' },
  { name: 'Tailwind', color: '#06B6D4', category: 'CSS' },
  { name: 'Next.js', color: '#000000', category: 'Framework' },
]

const careerTags = [
  { label: '高级前端工程师', color: 'from-purple-500 to-blue-500' },
  { label: '全栈开发者', color: 'from-blue-500 to-cyan-500' },
  { label: 'AI 应用专家', color: 'from-pink-500 to-rose-500' },
]

// Animated counter hook
function useAnimatedCounter(
  end: number,
  duration: number = 2000,
  start: boolean = true
) {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) {
      // 使用 requestAnimationFrame 延迟 setState
      const rafId = requestAnimationFrame(() => {
        setCount(0)
      })
      return () => {
        cancelAnimationFrame(rafId)
      }
    }

    let canceled = false

    const animate = (timestamp: number) => {
      if (canceled) return
      
      const startTime = timestamp
      const runAnimation = (ts: number) => {
        if (canceled) return
        
        const elapsed = ts - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutExpo = 1 - Math.pow(2, -10 * progress)
        const currentCount = Math.floor(easeOutExpo * end)
        
        setCount(currentCount)
        
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(runAnimation)
        }
      }

      rafRef.current = requestAnimationFrame(runAnimation)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      canceled = true
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [end, duration, start])

  return count
}

// Animated grid background
function AnimatedGrid({ scrollYProgress }: { scrollYProgress: any }) {
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ y, opacity }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:8rem_8rem]"
        animate={{ backgroundPosition: ['0px 0px', '4rem 4rem'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

// Floating orbs
function FloatingOrbs({ scrollYProgress }: { scrollYProgress: any }) {
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '70%'])
  const y4 = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])

  const orbs = [
    {
      color: 'bg-purple-500',
      size: 'w-96 h-96',
      x: '5%',
      y: '10%',
      delay: 0,
      yTransform: y1,
    },
    {
      color: 'bg-blue-500',
      size: 'w-72 h-72',
      x: '75%',
      y: '20%',
      delay: 2,
      yTransform: y2,
    },
    {
      color: 'bg-cyan-500',
      size: 'w-48 h-48',
      x: '65%',
      y: '60%',
      delay: 4,
      yTransform: y3,
    },
    {
      color: 'bg-pink-500',
      size: 'w-64 h-64',
      x: '15%',
      y: '50%',
      delay: 1,
      yTransform: y4,
    },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${orb.color} ${orb.size} blur-3xl`}
          style={{ left: orb.x, top: orb.y, y: orb.yTransform, opacity: 0.15 }}
          animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{
            duration: 10 + i * 2,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Text reveal animation
function TextReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: string
  delay?: number
  className?: string
}) {
  const characters = children.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    },
  }

  const child = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring' as const, damping: 12, stiffness: 100 },
    },
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={children}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className={`${className} inline-block`}
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// 3D Tilt card
function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    setRotateX((-mouseY / (rect.height / 2)) * 10)
    setRotateY((mouseX / (rect.width / 2)) * 10)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setRotateX(0)
    setRotateY(0)
  }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Tech Stack Cloud - macOS Style Window
function TechStackCloud() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
      className="hidden lg:block absolute right-8 xl:right-20 top-1/2 -translate-y-1/2"
    >
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-xl border border-slate-700/50 shadow-2xl shadow-purple-500/10 w-80 overflow-hidden">
        {/* macOS Window Title Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
          {/* Window Control Buttons */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600/30 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600/30 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600/30 shadow-sm" />
          </div>
          <span className="ml-3 text-xs text-slate-400 font-medium">Tech Stack</span>
        </div>
        
        {/* Window Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-300">技术栈</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-4 h-4 text-yellow-400" />
            </motion.div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-default backdrop-blur-sm"
                style={{
                  backgroundColor: `${tech.color}15`,
                  color: tech.color,
                  border: `1px solid ${tech.color}30`,
                  boxShadow: `0 2px 8px ${tech.color}10`,
                }}
              >
                {tech.name}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700/30">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <TrendingUp className="w-3 h-3" />
              <span>持续学习 AI / LLM 新技术</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Stat card component
function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const count = useAnimatedCounter(stat.value, 2000, isVisible)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2 + index * 0.1, type: 'spring', stiffness: 100 }}
      onViewportEnter={() => setIsVisible(true)}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.05 }}
      className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-accent/50 hover:bg-accent backdrop-blur-sm border border-border/50 transition-colors cursor-default"
    >
      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
        <stat.icon className="w-5 h-5 text-purple-400" />
      </motion.div>
      <div>
        <span className="text-2xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          {count}
          {stat.suffix}
        </span>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
      </div>
    </motion.div>
  )
}

// Main Hero Section
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)


  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const y = useTransform(smoothScrollY, [0, 1], ['0%', '40%'])
  const opacity = useTransform(smoothScrollY, [0, 0.5], [1, 0])
  const scale = useTransform(smoothScrollY, [0, 0.5], [1, 0.9])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
      <AnimatedGrid scrollYProgress={smoothScrollY} />
      <FloatingOrbs scrollYProgress={smoothScrollY} />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 w-full pt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Career Tags */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="mb-6 flex flex-wrap justify-center gap-2"
            >
              {careerTags.map((tag, index) => (
                <motion.span
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-linear-to-r ${tag.color} text-white text-sm font-medium shadow-lg`}
                >
                  <Award className="w-4 h-4" />
                  {tag.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Welcome Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
              className="mb-8"
            >
              <motion.span
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(139, 92, 246, 0.4)',
                }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
                欢迎来到我的数字花园
              </motion.span>
            </motion.div>

            {/* Avatar */}
            <div className="mb-8">
              <TiltCard className="relative inline-block">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                  }}
                  className="relative"
                >
                  <motion.div
                    className="absolute -inset-4 rounded-full bg-linear-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-linear-to-r from-purple-500 via-blue-500 to-cyan-500 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                      <span className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        LL
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute -inset-4 rounded-full border-2 border-dashed border-purple-500/20"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute -inset-8 rounded-full border border-dotted border-blue-500/10"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                    className="absolute bottom-3 right-3"
                  >
                    <span className="relative flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-4 border-background"></span>
                    </span>
                  </motion.div>
                </motion.div>
              </TiltCard>
            </div>

            {/* Name */}
            <div className="mb-4">
              <TextReveal
                delay={0.5}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
              >
                Levy Lin
              </TextReveal>
            </div>

            {/* Core Value Proposition */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-6"
            >
              <p className="text-xl sm:text-2xl text-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                专注于构建高性能、可扩展的 Web 应用
                <br className="hidden sm:block" />
                <span className="text-muted-foreground font-normal">
                  深耕前端工程化，探索 AI 应用落地，追求极致用户体验
                </span>
              </p>
            </motion.div>

            {/* Location & Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                中国 · 远程工作
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                5+ 年开发经验
              </span>
              <span className="inline-flex items-center gap-1.5 text-green-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                开放合作机会
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12"
            >
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, type: 'spring', stiffness: 100 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to="/projects">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 text-base px-8"
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    查看项目作品
                  </Button>
                </motion.div>
              </Link>
              <Link to="/blog">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 hover:bg-accent transition-all duration-300 text-base px-8"
                  >
                    <Code2 className="w-5 h-5 mr-2" />
                    阅读技术文章
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="flex justify-center gap-4"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20, scale: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="group relative p-3.5 rounded-xl bg-accent/50 hover:bg-accent transition-all duration-300"
                  aria-label={social.label}
                >
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-linear-to-r ${social.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}
                  />
                  <social.icon className="w-5 h-5 relative z-10" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {social.stats}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack Cloud */}
      <TechStackCloud />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        >
          <span className="text-sm font-medium tracking-wide">向下滚动</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
