import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'

import { Button } from '@/components/ui/button'
import { TiltCard } from '@/components/about/TiltCard'
import { TypeWriter } from '@/components/about/TypeWriter'
import { SkillRadarChart } from '@/components/about/SkillRadarChart'
import { useBlogStore } from '@/stores/blogStore'
import {
  MapPin, Mail, Calendar, Briefcase, Code, Brain, Target, Palette,
  Github, Linkedin, Twitter, Sparkles, Zap, Globe, BookOpen, Coffee,
  Plane, Music, Camera, Gamepad2, Cat, ChevronUp,
  Star, Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  }
}

// Stats data
const stats = [
  { label: '年开发经验', value: 8, suffix: '+' },
  { label: 'GitHub Stars', value: 16500, suffix: '+' },
  { label: '技术文章', value: 50, suffix: '+' },
  { label: '影响开发者', value: 50000, suffix: '+' },
]

// Identities data
const identities = [
  {
    icon: Code,
    title: '前端专家',
    subtitle: 'Frontend Architect',
    description: '深耕前端领域8年，精通React、Vue、TypeScript等现代前端技术栈。对前端工程化、性能优化、架构设计有深入研究。',
    skills: ['React/Vue', '工程化', '性能优化', '架构设计', 'TypeScript'],
    color: '#00f5ff',
    lightColor: '#0066ff'
  },
  {
    icon: Brain,
    title: 'AI 深度学习',
    subtitle: 'AI & Deep Learning',
    description: '专注于大语言模型应用开发，精通Prompt Engineering、RAG、AI Agent等前沿技术。',
    skills: ['LLM开发', 'Prompt工程', 'RAG架构', 'LangChain', '模型微调'],
    color: '#b829f7',
    lightColor: '#7c3aed'
  },
  {
    icon: Target,
    title: '产品经理',
    subtitle: 'Product Manager',
    description: '具备技术背景的产品经理，能够从技术和商业双重视角思考产品问题。',
    skills: ['需求分析', '用户研究', '数据驱动', 'PRD撰写', '项目管理'],
    color: '#ffaa00',
    lightColor: '#f59e0b'
  },
  {
    icon: Palette,
    title: 'UI/UX 设计',
    subtitle: 'UI/UX Designer',
    description: '热爱设计的开发者，追求技术与美学的完美结合。熟练使用Figma、Sketch等设计工具。',
    skills: ['Figma', '设计系统', '交互设计', '视觉设计', '用户研究'],
    color: '#00ff88',
    lightColor: '#10b981'
  },
]

// Projects data
const projects = [
  {
    id: '1',
    title: 'AI-Dev-Toolkit',
    description: '面向开发者的AI工具集，整合代码生成、智能Review、自动化测试等能力',
    tags: ['TypeScript', 'Python', 'OpenAI', 'LangChain'],
    stars: 5200,
    forks: 890,
    color: '#00f5ff',
    lightColor: '#0066ff'
  },
  {
    id: '2',
    title: 'React-Pro-Admin',
    description: '企业级中后台管理系统框架，提供完整的权限管理、数据可视化解决方案',
    tags: ['React', 'TypeScript', 'Ant Design', 'Vite'],
    stars: 8200,
    forks: 1200,
    color: '#b829f7',
    lightColor: '#7c3aed'
  },
  {
    id: '3',
    title: 'Smart-Chat-Platform',
    description: '基于大模型的智能客服平台，支持多轮对话、知识库检索、意图识别',
    tags: ['Next.js', 'Python', 'LangChain', 'PostgreSQL'],
    stars: 3100,
    forks: 450,
    color: '#00ff88',
    lightColor: '#10b981'
  },
]

// Interests data
const interests = [
  { icon: BookOpen, label: '技术阅读', description: '每年阅读技术书籍20+' },
  { icon: Coffee, label: '咖啡文化', description: '探索广州精品咖啡馆' },
  { icon: Plane, label: '旅行探索', description: '用脚步丈量世界' },
  { icon: Music, label: '音乐欣赏', description: '爵士与古典音乐爱好者' },
  { icon: Camera, label: '摄影记录', description: '记录生活美好瞬间' },
  { icon: Gamepad2, label: '独立游戏', description: '策略与解谜游戏' },
  { icon: Cat, label: '猫咪陪伴', description: '两只英短的主人' },
  { icon: Globe, label: '开源贡献', description: '积极参与开源社区' },
]

// Animated counter component
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const steps = 60
          const increment = end / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [end, hasAnimated])

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Stat card with neon glow
function StatCard({ label, value, suffix, isDark, delay, color }: {
  label: string
  value: number
  suffix: string
  isDark: boolean
  delay: number
  color: string
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
      style={{ boxShadow: isDark ? `0 0 30px ${color}20` : `0 0 20px ${color}15` }}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: color }} />
      <div className="relative z-10 text-center">
        <div className="text-3xl font-bold mb-1" style={{ color }}>
          <AnimatedCounter end={value} suffix={suffix} />
        </div>
        <div className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
          {label}
        </div>
      </div>
    </motion.div>
  )
}

// Identity card
function IdentityCard({ identity, index, isDark }: {
  identity: typeof identities[0]
  index: number
  isDark: boolean
}) {
  const Icon = identity.icon
  const glowColor = isDark ? identity.color : identity.lightColor

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <TiltCard isDark={isDark} glowColor={glowColor}>
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${glowColor}, ${glowColor}80)`,
                boxShadow: `0 0 20px ${glowColor}50`
              }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                {identity.title}
              </h3>
              <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                {identity.subtitle}
              </p>
            </div>
          </div>

          <p className={cn('mb-4 leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
            {identity.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {identity.skills.map(skill => (
              <span
                key={skill}
                className={cn(
                  'px-2 py-1 text-xs rounded-full border',
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-300'
                    : 'bg-white/50 border-slate-200 text-slate-600'
                )}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

// Project card
function ProjectCard({ project, index, isDark }: {
  project: typeof projects[0]
  index: number
  isDark: boolean
}) {
  const glowColor = isDark ? project.color : project.lightColor

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <TiltCard isDark={isDark} glowColor={glowColor}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={cn('text-xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
                {project.title}
              </h3>
              <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
                {project.description}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${glowColor}, ${glowColor}80)`,
                boxShadow: `0 0 15px ${glowColor}50`
              }}
            >
              <Rocket className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <span
                key={tag}
                className={cn(
                  'px-2 py-1 text-xs rounded-md border',
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-300'
                    : 'bg-white/50 border-slate-200 text-slate-600'
                )}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className={cn('flex items-center gap-1', isDark ? 'text-slate-400' : 'text-slate-600')}>
              <Star className="w-4 h-4" style={{ color: glowColor }} />
              {project.stars.toLocaleString()}
            </span>
            <span className={cn('flex items-center gap-1', isDark ? 'text-slate-400' : 'text-slate-600')}>
              <Github className="w-4 h-4" />
              {project.forks.toLocaleString()}
            </span>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

// Interest card
function InterestCard({ interest, index, isDark }: {
  interest: typeof interests[0]
  index: number
  isDark: boolean
}) {
  const Icon = interest.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'rounded-xl p-4 border backdrop-blur-xl cursor-pointer transition-all duration-300',
        isDark
          ? 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]'
          : 'bg-white/80 border-white/50 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(0,102,255,0.15)]'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2',
        isDark ? 'bg-cyan-500/20' : 'bg-blue-500/10'
      )}>
        <Icon className={cn('w-5 h-5', isDark ? 'text-cyan-400' : 'text-blue-600')} />
      </div>
      <h4 className={cn('font-semibold text-sm text-center mb-1', isDark ? 'text-white' : 'text-slate-900')}>
        {interest.label}
      </h4>
      <p className={cn('text-xs text-center', isDark ? 'text-slate-400' : 'text-slate-500')}>
        {interest.description}
      </p>
    </motion.div>
  )
}

// Main component
export function AboutPage() {
  useBlogStore()
  const [isDark, setIsDark] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  useTransform(scrollYProgress, [0, 0.1], [1, 0])

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

  // Sample skills for radar
  const radarSkills = [
    { name: 'React', level: 98 },
    { name: 'TypeScript', level: 95 },
    { name: 'Node.js', level: 88 },
    { name: 'AI/ML', level: 85 },
    { name: 'Design', level: 82 },
    { name: 'Product', level: 80 }
  ]

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-500 overflow-x-hidden',
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    )}>
      <Navigation />

      <main ref={containerRef} className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Location badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 border backdrop-blur-xl',
                    isDark
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-600'
                  )}
                  style={{ boxShadow: isDark ? '0 0 20px rgba(0,245,255,0.2)' : '0 0 20px rgba(0,102,255,0.1)' }}
                >
                  <MapPin className="w-4 h-4" />
                  <span>中国 · 广州</span>
                </motion.div>

                {/* Title with typewriter */}
                <h1 className={cn('text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight', colors.text)}>
                  <TypeWriter
                    text="全栈开发者"
                    speed={80}
                    className={cn(
                      'bg-clip-text text-transparent bg-gradient-to-r',
                      isDark ? 'from-cyan-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'
                    )}
                  />
                  <br />
                  <span className={cn('text-3xl sm:text-4xl lg:text-5xl', colors.textMuted)}>
                    & 产品创造者
                  </span>
                </h1>

                <p className={cn('text-lg mb-8 leading-relaxed max-w-xl', colors.textMuted)}>
                  你好，我是 <span className={cn('font-semibold', colors.text)}>Levy</span>，一名来自广州的全栈开发者。
                  我热衷于用技术解决实际问题，相信好的产品源于对用户的深刻理解和对技术的极致追求。
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {['前端专家', 'AI开发者', '产品经理', '开源贡献者'].map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className={cn(
                        'px-4 py-2 text-sm rounded-full border backdrop-blur-xl',
                        isDark
                          ? 'bg-white/5 border-white/10 text-cyan-400'
                          : 'bg-white/80 border-white/50 text-blue-600'
                      )}
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className={cn(
                      'rounded-full px-8',
                      isDark
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                    )}
                    style={{ boxShadow: isDark ? '0 0 20px rgba(0,245,255,0.3)' : '0 0 20px rgba(0,102,255,0.2)' }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    联系我
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      'rounded-full px-8',
                      isDark
                        ? 'border-white/20 text-white hover:bg-white/10'
                        : 'border-slate-300 text-slate-900 hover:bg-slate-100'
                    )}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </motion.div>

              {/* Right: Avatar & Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                {/* Avatar with glow */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mb-8"
                >
                  <div
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1"
                    style={{
                      background: `linear-gradient(135deg, ${isDark ? '#00f5ff' : '#0066ff'}, ${isDark ? '#b829f7' : '#7c3aed'}, ${isDark ? '#ff0080' : '#ec4899'})`,
                      boxShadow: isDark ? '0 0 40px rgba(0,245,255,0.3)' : '0 0 40px rgba(0,102,255,0.2)'
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                        alt="Levy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${isDark ? '#00f5ff' : '#0066ff'}, ${isDark ? '#b829f7' : '#7c3aed'})`,
                      boxShadow: isDark ? '0 0 20px rgba(0,245,255,0.5)' : '0 0 20px rgba(0,102,255,0.3)'
                    }}
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {stats.map((stat, index) => (
                    <StatCard
                      key={stat.label}
                      label={stat.label}
                      value={stat.value}
                      suffix={stat.suffix}
                      isDark={isDark}
                      delay={0.6 + index * 0.1}
                      color={isDark ? '#00f5ff' : '#0066ff'}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={cn(
                'w-6 h-10 rounded-full border-2 flex justify-center pt-2',
                isDark ? 'border-cyan-500/30' : 'border-blue-500/30'
              )}
            >
              <motion.div
                animate={{ opacity: [1, 0], y: [0, 12] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={cn('w-1.5 h-1.5 rounded-full', isDark ? 'bg-cyan-400' : 'bg-blue-500')}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Bio Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className={cn(
                'inline-block px-4 py-1 rounded-full text-sm mb-4 border',
                isDark ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-purple-500/10 border-purple-500/30 text-purple-600'
              )}>
                关于我
              </span>
              <h2 className={cn('text-3xl sm:text-4xl font-bold mb-4', colors.text)}>我的故事</h2>
              <p className={cn('max-w-2xl mx-auto', colors.textMuted)}>
                从湖南长沙到广州，从算法竞赛到全栈开发，从程序员到产品经理——这是我的技术成长之路
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                'rounded-2xl p-8 border backdrop-blur-xl space-y-6',
                isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/50'
              )}
            >
              <p className={cn('leading-relaxed', colors.textMuted)}>
                我是Levy，一名扎根广州的全栈开发者和技术创业者。2016年，我从湖南长沙来到广州，进入华南理工大学计算机学院，
                开启了与代码为伴的旅程。八年来，我从一个对编程充满好奇的新生，成长为能够独立负责产品全链路的技术负责人。
              </p>
              <p className={cn('leading-relaxed', colors.textMuted)}>
                大学期间，我加入了学校的ACM程序设计竞赛队。那段日以继夜刷题、打比赛的日子，培养了我扎实的算法基础和解决问题的能力。
                更重要的是，它让我明白了一个道理：优秀的代码不仅要能运行，还要高效、优雅、易于维护。
              </p>
              <p className={cn('leading-relaxed', colors.textMuted)}>
                2020年毕业后，我加入阿里巴巴前端练习生计划，在阿里云团队实习了半年。这段经历让我深入了解了大型互联网公司的技术体系，
                学习了如何在高并发、高可用的场景下构建稳定的前端应用。
              </p>
              <p className={cn('leading-relaxed', colors.textMuted)}>
                2022年是转折性的一年。随着GPT-3.5的发布，我意识到AI将彻底改变软件开发的方式。我开始深入研究大语言模型，
                学习Prompt Engineering、RAG架构、AI Agent设计等前沿技术。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Identities Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className={cn(
                'inline-block px-4 py-1 rounded-full text-sm mb-4 border',
                isDark ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-600'
              )}>
                多重身份
              </span>
              <h2 className={cn('text-3xl sm:text-4xl font-bold mb-4', colors.text)}>我的专业领域</h2>
              <p className={cn('max-w-2xl mx-auto', colors.textMuted)}>
                跨越技术与产品的边界，用多维度视角创造更好的解决方案
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {identities.map((identity, index) => (
                <IdentityCard key={identity.title} identity={identity} index={index} isDark={isDark} />
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className={cn(
                'inline-block px-4 py-1 rounded-full text-sm mb-4 border',
                isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-600'
              )}>
                技术栈
              </span>
              <h2 className={cn('text-3xl sm:text-4xl font-bold mb-4', colors.text)}>技能图谱</h2>
              <p className={cn('max-w-2xl mx-auto', colors.textMuted)}>
                全栈技术能力覆盖，从用户界面到AI算法的完整技术栈
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Radar Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={cn(
                  'rounded-2xl p-6 border backdrop-blur-xl',
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/50'
                )}
              >
                <SkillRadarChart skills={radarSkills} isDark={isDark} />
              </motion.div>

              {/* Skill List */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {radarSkills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={cn('font-medium', colors.text)}>{skill.name}</span>
                      <span className={cn('text-sm', colors.textMuted)}>{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${isDark ? '#00f5ff' : '#0066ff'}, ${isDark ? '#b829f7' : '#7c3aed'})`,
                          boxShadow: isDark ? '0 0 10px rgba(0,245,255,0.5)' : '0 0 10px rgba(0,102,255,0.3)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className={cn(
                'inline-block px-4 py-1 rounded-full text-sm mb-4 border',
                isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
              )}>
                项目作品
              </span>
              <h2 className={cn('text-3xl sm:text-4xl font-bold mb-4', colors.text)}>精选项目</h2>
              <p className={cn('max-w-2xl mx-auto', colors.textMuted)}>
                开源项目和技术实践，用代码创造价值
              </p>
            </motion.div>

            <div className="space-y-6">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} isDark={isDark} />
              ))}
            </div>
          </div>
        </section>

        {/* Interests Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className={cn(
                'inline-block px-4 py-1 rounded-full text-sm mb-4 border',
                isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-600'
              )}>
                生活点滴
              </span>
              <h2 className={cn('text-3xl sm:text-4xl font-bold mb-4', colors.text)}>技术之外</h2>
              <p className={cn('max-w-2xl mx-auto', colors.textMuted)}>
                保持对生活的热爱，才能写出有温度的代码
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {interests.map((interest, index) => (
                <InterestCard key={interest.label} interest={interest} index={index} isDark={isDark} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className={cn(
                'inline-block px-4 py-1 rounded-full text-sm mb-4 border',
                isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-600'
              )}>
                保持联系
              </span>
              <h2 className={cn('text-3xl sm:text-4xl font-bold mb-4', colors.text)}>
                让我们一起创造
              </h2>
              <p className={cn('mb-8 max-w-2xl mx-auto', colors.textMuted)}>
                无论是技术交流、项目合作，还是只是想聊聊咖啡和猫咪，我都很期待与你的对话
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { icon: Mail, label: '发送邮件', href: 'mailto:hello@example.com', primary: true },
                  { icon: Github, label: 'GitHub', href: 'https://github.com' },
                  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
                  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
                ].map((link) => (
                  <Button
                    key={link.label}
                    size="lg"
                    variant={link.primary ? 'default' : 'outline'}
                    className={cn(
                      'rounded-full px-6',
                      link.primary
                        ? isDark
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : isDark
                          ? 'border-white/20 text-white hover:bg-white/10'
                          : 'border-slate-300 text-slate-900 hover:bg-slate-100'
                    )}
                    asChild
                  >
                    <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      <link.icon className="w-5 h-5 mr-2" />
                      {link.label}
                    </a>
                  </Button>
                ))}
              </div>

              <div className={cn('flex items-center justify-center gap-6 text-sm', colors.textMuted)}>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  广州，中国
                </span>
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  8年+ 开发经验
                </span>
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  开放合作
                </span>
              </div>
            </motion.div>
          </div>
        </section>
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
        <ChevronUp className="w-6 h-6" />
      </motion.button>

      <Footer />
    </div>
  )
}
