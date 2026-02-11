import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { TodoList } from '@/components/TodoList'
import { AddTodo } from '@/components/AddTodo'
import { TodoStats } from '@/components/TodoStats'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { CheckCircle2, Sparkles, Target, Zap } from 'lucide-react'

// Floating particles background
function FloatingParticles() {
  const particles = [
    { color: 'bg-purple-500', size: 'w-4 h-4', x: '10%', y: '20%', delay: 0 },
    { color: 'bg-blue-500', size: 'w-3 h-3', x: '80%', y: '30%', delay: 1 },
    { color: 'bg-cyan-500', size: 'w-2 h-2', x: '70%', y: '70%', delay: 2 },
    { color: 'bg-pink-500', size: 'w-3 h-3', x: '20%', y: '60%', delay: 0.5 },
    { color: 'bg-yellow-500', size: 'w-2 h-2', x: '50%', y: '10%', delay: 1.5 },
    { color: 'bg-green-500', size: 'w-4 h-4', x: '90%', y: '80%', delay: 2.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${particle.color} ${particle.size} blur-sm opacity-20`}
          style={{ left: particle.x, top: particle.y }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6 + i,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Animated grid background
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  )
}

// Hero Section
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  })
  const y = useTransform(smoothProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0])

  return (
    <motion.section
      ref={containerRef}
      style={{ y, opacity }}
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
      <AnimatedGrid />
      <FloatingParticles />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-sm font-medium text-purple-400">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            高效管理你的时间
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
        >
          <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            待办事项
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          清晰规划每一天，高效完成每一项任务。
          <br className="hidden sm:block" />
          让待办事项成为你提升生产力的得力助手。
        </motion.p>

        {/* Feature icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {[
            { icon: CheckCircle2, label: '任务追踪' },
            { icon: Target, label: '优先级管理' },
            { icon: Zap, label: '高效完成' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -3, scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50"
            >
              <item.icon className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

// Main Page Component
export function TodoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <HeroSection />

        <section className="relative pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <TodoStats />
            </motion.div>

            {/* Add Todo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <AddTodo />
            </motion.div>

            {/* Todo List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <TodoList />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
