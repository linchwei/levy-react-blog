import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useBlogStore } from '@/stores/blogStore'
import { SkillRadar, TiltCard, TypeWriter } from '@/components/timeline'
import {
  Briefcase, GraduationCap, Award, FolderGit2, Search, Calendar,
  ChevronDown, ChevronUp, MapPin, Building, Star, Brain, Code2,
  Rocket, Github, Award as AwardIcon, Layout, Terminal, Sparkles,
  Zap, TrendingUp, Target, Globe, Cpu, Database, Cloud, Shield,
  Smartphone, Layers, GitBranch, Users, Lightbulb, ChevronRight,
  ChevronUp as ChevronUpIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Type definitions
interface TimelineEvent {
  id: string
  date: string
  title: string
  company?: string
  location?: string
  description: string
  highlights?: string[]
  type: 'work' | 'education' | 'project' | 'award'
  icon: string
  tech?: string[]
  metrics?: { label: string; value: string }[]
}

// Theme colors
const themeColors = {
  dark: {
    bg: 'from-slate-950 via-purple-950/30 to-slate-950',
    neonCyan: '#00f5ff',
    neonPurple: '#b829f7',
    neonPink: '#ff0080',
    glass: 'bg-white/5',
    border: 'border-white/10',
    text: 'text-white',
    textMuted: 'text-slate-400',
    glow: 'shadow-cyan-500/50'
  },
  light: {
    bg: 'from-blue-50 via-white to-purple-50',
    neonCyan: '#0066ff',
    neonPurple: '#7c3aed',
    neonPink: '#ec4899',
    glass: 'bg-white/80',
    border: 'border-white/50',
    text: 'text-slate-900',
    textMuted: 'text-slate-600',
    glow: 'shadow-blue-500/30'
  }
}

// Type configurations
const typeConfig = {
  work: {
    label: '工作经历',
    icon: Briefcase,
    gradient: 'from-cyan-400 to-blue-600',
    glow: '#00f5ff'
  },
  education: {
    label: '教育背景',
    icon: GraduationCap,
    gradient: 'from-violet-400 to-purple-600',
    glow: '#b829f7'
  },
  award: {
    label: '荣誉成就',
    icon: Award,
    gradient: 'from-amber-400 to-orange-600',
    glow: '#ffaa00'
  },
  project: {
    label: '项目作品',
    icon: FolderGit2,
    gradient: 'from-emerald-400 to-teal-600',
    glow: '#00ff88'
  }
}

// Custom icons
const customIcons: Record<string, React.ElementType> = {
  brain: Brain, github: Github, code: Code2, award: AwardIcon,
  layout: Layout, rocket: Rocket, terminal: Terminal, sparkles: Sparkles,
  zap: Zap, trending: TrendingUp, target: Target, globe: Globe,
  cpu: Cpu, database: Database, cloud: Cloud, shield: Shield,
  smartphone: Smartphone, layers: Layers, git: GitBranch, users: Users,
  lightbulb: Lightbulb
}

// Filter button with neon glow
function FilterButton({ type, isActive, count, onClick, isDark }: {
  type: keyof typeof typeConfig
  isActive: boolean
  count: number
  onClick: () => void
  isDark: boolean
}) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative px-6 py-3 rounded-full font-medium transition-all duration-300 overflow-hidden',
        isActive
          ? 'text-white'
          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
      )}
      style={{
        boxShadow: isActive ? `0 0 20px ${config.glow}50` : 'none'
      }}
    >
      {isActive && (
        <motion.div
          layoutId="activeFilter"
          className={cn('absolute inset-0 bg-gradient-to-r', config.gradient)}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs',
          isActive ? 'bg-white/20' : isDark ? 'bg-slate-800' : 'bg-slate-200'
        )}>
          {count}
        </span>
      </span>
    </motion.button>
  )
}

// Timeline card with 3D tilt and neon effects
function TimelineCard({ event, index, isLast, isDark }: {
  event: TimelineEvent
  index: number
  isLast: boolean
  isDark: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = typeConfig[event.type]
  const CustomIcon = customIcons[event.icon] || config.icon
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      className="relative"
    >
      {/* Animated timeline line */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={cn(
            "absolute left-6 top-16 bottom-0 w-px origin-top",
            isDark ? "bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-transparent" : "bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-transparent"
          )}
        />
      )}

      <div className="flex gap-6">
        {/* Pulsing timeline node */}
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{
              boxShadow: [
                `0 0 0 0 ${config.glow}00`,
                `0 0 20px 5px ${config.glow}40`,
                `0 0 0 0 ${config.glow}00`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center relative z-10',
              'bg-gradient-to-br'
            )}
            style={{
              background: `linear-gradient(135deg, ${config.glow}, ${config.glow}80)`
            }}
          >
            {React.createElement(CustomIcon, { className: "w-6 h-6 text-white" })}
          </motion.div>
        </div>

        {/* 3D Tilt Card */}
        <div className="flex-1 pb-12">
          <TiltCard isDark={isDark} glowColor={config.glow}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      className={cn(
                        'text-white border-0 px-3 py-1 rounded-full text-xs font-semibold',
                        'bg-gradient-to-r',
                        config.gradient
                      )}
                      style={{ boxShadow: `0 0 10px ${config.glow}50` }}
                    >
                      {config.label}
                    </Badge>
                    <span className={cn('text-sm flex items-center gap-1', colors.textMuted)}>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(event.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h3 className={cn('text-xl font-bold mb-1', colors.text)}>
                    {event.title}
                  </h3>
                  {(event.company || event.location) && (
                    <div className={cn('flex flex-wrap gap-3 text-sm', colors.textMuted)}>
                      {event.company && (
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />{event.company}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />{event.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className={cn('leading-relaxed mb-4', colors.textMuted)}>
                {event.description}
              </p>

              {/* Tech stack */}
              {event.tech && event.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tech.map((tech, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        'px-3 py-1 text-xs font-medium rounded-full border transition-all duration-300',
                        isDark
                          ? 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                          : 'bg-white/50 border-slate-200 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(0,102,255,0.2)]'
                      )}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Metrics */}
              {event.metrics && event.metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {event.metrics.map((metric, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={cn(
                        'rounded-xl p-3 text-center border',
                        isDark
                          ? 'bg-white/5 border-white/10'
                          : 'bg-white/50 border-white/50'
                      )}
                    >
                      <div
                        className="text-lg font-bold"
                        style={{ color: config.glow }}
                      >
                        {metric.value}
                      </div>
                      <div className={cn('text-xs', colors.textMuted)}>{metric.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Highlights */}
              <AnimatePresence>
                {isExpanded && event.highlights && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn('pt-4 border-t', isDark ? 'border-white/10' : 'border-slate-200')}
                  >
                    <h4 className={cn('font-semibold text-sm mb-3 flex items-center gap-2', colors.text)}>
                      <Star className="w-4 h-4" style={{ color: config.glow }} />
                      关键成果
                    </h4>
                    <ul className="space-y-2">
                      {event.highlights.map((highlight, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={cn('flex items-start gap-2 text-sm', colors.textMuted)}
                        >
                          <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: config.glow }} />
                          <span>{highlight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expand button */}
              {event.highlights && event.highlights.length > 0 && (
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1.5 text-sm font-medium mt-4 transition-colors"
                  style={{ color: config.glow }}
                >
                  <span>{isExpanded ? '收起详情' : '查看详情'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </motion.button>
              )}
            </div>
          </TiltCard>
        </div>
      </div>
    </motion.div>
  )
}

// Stats card with neon glow
function StatCard({ label, value, icon: Icon, color, isDark, delay }: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  isDark: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={cn(
        'relative rounded-2xl p-6 border backdrop-blur-xl overflow-hidden',
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/50'
      )}
      style={{
        boxShadow: isDark ? `0 0 30px ${color}20` : `0 0 20px ${color}15`
      }}
    >
      {/* Glow background */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
        style={{ background: color }}
      />

      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}80)`,
            boxShadow: `0 0 20px ${color}50`
          }}
        >
          {React.createElement(Icon, { className: "w-6 h-6 text-white" })}
        </div>
        <div className={cn('text-3xl font-bold mb-1', isDark ? 'text-white' : 'text-slate-900')}>
          {value}
        </div>
        <div className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
          {label}
        </div>
      </div>
    </motion.div>
  )
}

// Main page component
export function TimelinePage() {
  const { timeline, fetchData, isLoading, error } = useBlogStore()
  const [selectedTypes, setSelectedTypes] = useState<Array<keyof typeof typeConfig>>(['work', 'education', 'project', 'award'])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDark, setIsDark] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  const colors = isDark ? themeColors.dark : themeColors.light

  // Theme detection
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'))
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  // Load data
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Process events
  const events = useMemo(() => {
    return [...timeline].sort(
      (a, b) => new Date(b.date as unknown as string).getTime() - new Date(a.date as unknown as string).getTime()
    ) as unknown as TimelineEvent[]
  }, [timeline])

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesType = selectedTypes.includes(event.type)
      const matchesSearch = !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [events, selectedTypes, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    return events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [events])

  // Sample skills for radar
  const skills = [
    { name: 'React', level: 98 },
    { name: 'TypeScript', level: 95 },
    { name: 'Node.js', level: 88 },
    { name: 'Architecture', level: 92 },
    { name: 'Performance', level: 90 },
    { name: 'Leadership', level: 85 }
  ]

  const toggleTypeFilter = (type: keyof typeof typeConfig) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-500 overflow-x-hidden',
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    )}>
      <Navigation />

      <main ref={containerRef} className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            style={{ opacity }}
            className="text-center mb-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 border backdrop-blur-xl',
                isDark
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-600'
              )}
              style={{
                boxShadow: isDark ? '0 0 20px rgba(0,245,255,0.2)' : '0 0 20px rgba(0,102,255,0.1)'
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>技术成长之路</span>
            </motion.div>

            {/* Title with typewriter */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={cn('text-5xl sm:text-6xl md:text-7xl font-bold mb-6', colors.text)}
            >
              <TypeWriter
                text="我的时间线"
                speed={80}
                className={cn(
                  'bg-clip-text text-transparent bg-gradient-to-r',
                  isDark ? 'from-cyan-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'
                )}
              />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={cn('text-lg max-w-2xl mx-auto mb-12', colors.textMuted)}
            >
              从初级开发者到技术专家的蜕变历程，记录每一个技术突破与成长里程碑
            </motion.p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              <StatCard
                label="里程碑"
                value={events.length}
                icon={Target}
                color={isDark ? '#00f5ff' : '#0066ff'}
                isDark={isDark}
                delay={0.6}
              />
              <StatCard
                label="年经验"
                value={`${new Date().getFullYear() - 2016}+`}
                icon={Briefcase}
                color={isDark ? '#b829f7' : '#7c3aed'}
                isDark={isDark}
                delay={0.7}
              />
              <StatCard
                label="项目"
                value={stats.project || 0}
                icon={FolderGit2}
                color={isDark ? '#00ff88' : '#10b981'}
                isDark={isDark}
                delay={0.8}
              />
              <StatCard
                label="荣誉"
                value={stats.award || 0}
                icon={Award}
                color={isDark ? '#ffaa00' : '#f59e0b'}
                isDark={isDark}
                delay={0.9}
              />
            </div>
          </motion.div>

          {/* Skill Radar & Search Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Skill Radar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                'rounded-2xl p-6 border backdrop-blur-xl',
                isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/50'
              )}
            >
              <h3 className={cn('text-xl font-bold mb-4', colors.text)}>技能雷达</h3>
              <div className="flex justify-center">
                <SkillRadar skills={skills} isDark={isDark} />
              </div>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                'rounded-2xl p-6 border backdrop-blur-xl',
                isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/50'
              )}
            >
              <h3 className={cn('text-xl font-bold mb-4', colors.text)}>筛选与搜索</h3>

              {/* Search */}
              <div className="relative mb-6">
                <Search className={cn('absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5', colors.textMuted)} />
                <Input
                  placeholder="搜索事件、公司或关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'pl-12 py-3 rounded-xl border-0 focus:ring-2',
                    isDark
                      ? 'bg-white/5 text-white placeholder:text-slate-500 focus:ring-cyan-500/50'
                      : 'bg-white text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/50'
                  )}
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map(type => (
                  <FilterButton
                    key={type}
                    type={type}
                    isActive={selectedTypes.includes(type)}
                    count={stats[type] || 0}
                    onClick={() => toggleTypeFilter(type)}
                    isDark={isDark}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Timeline Events */}
          <div className="relative">
            {isLoading ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className={cn(
                    'w-12 h-12 mx-auto mb-4 rounded-full border-2 border-t-transparent',
                    isDark ? 'border-cyan-500' : 'border-blue-500'
                  )}
                />
                <p className={colors.textMuted}>加载中...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className={cn('text-red-400 mb-4', colors.text)}>{error}</p>
                <Button onClick={() => fetchData()}>重试</Button>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <p className={colors.textMuted}>暂无匹配的事件</p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredEvents.map((event, index) => (
                  <TimelineCard
                    key={event.id}
                    event={event}
                    index={index}
                    isLast={index === filteredEvents.length - 1}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Scroll to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'fixed bottom-8 right-8 p-3 rounded-full border backdrop-blur-xl z-50',
          isDark
            ? 'bg-white/5 border-white/20 text-cyan-400 hover:border-cyan-500/50'
            : 'bg-white/80 border-slate-200 text-blue-600 hover:border-blue-500/50'
        )}
        style={{
          boxShadow: isDark ? '0 0 20px rgba(0,245,255,0.2)' : '0 0 20px rgba(0,102,255,0.1)'
        }}
      >
        <ChevronUpIcon className="w-6 h-6" />
      </motion.button>

      <Footer />
    </div>
  )
}
