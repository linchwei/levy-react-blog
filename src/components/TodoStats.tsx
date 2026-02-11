import { useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useTodoStats, useCompletionRate } from '@/stores/todoStore'
import { CheckCircle2, Circle, ListTodo, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SPRING_CONFIG, ANIMATION_DURATION } from '@/constants'
import { useAnimatedCounter } from '@/hooks'

// ============================================
// 统计项配置
// ============================================
const STAT_CONFIG = [
  {
    key: 'total',
    title: '总任务',
    icon: ListTodo,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    key: 'active',
    title: '进行中',
    icon: Circle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    gradient: 'from-yellow-500/10 to-orange-500/10',
  },
  {
    key: 'completed',
    title: '已完成',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    gradient: 'from-green-500/10 to-emerald-500/10',
  },
  {
    key: 'rate',
    title: '完成率',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    gradient: 'from-purple-500/10 to-pink-500/10',
    isPercentage: true,
  },
] as const

interface StatCardProps {
  config: (typeof STAT_CONFIG)[number]
  value: number
  index: number
  isInView: boolean
}

/**
 * 3D 倾斜卡片组件
 */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={ref}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * 统计卡片组件
 */
function StatCard({
  config,
  value,
  index,
  isInView,
}: StatCardProps) {
  const count = useAnimatedCounter(value, 2000, isInView)
  const displayValue =
    'isPercentage' in config && config.isPercentage ? `${count}%` : count

  return (
    <TiltCard>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{
          duration: ANIMATION_DURATION.slow,
          delay: index * 0.1,
          ...SPRING_CONFIG.gentle,
        }}
      >
        <Card className="relative overflow-hidden group cursor-default">
          {/* Background gradient */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
              config.gradient
            )}
          />

          <CardContent className="relative p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={cn('p-3 rounded-xl shadow-lg', config.bgColor)}
                >
                  <config.icon className={cn('h-6 w-6', config.color)} />
                </motion.div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {config.title}
                  </p>
                  <motion.p
                    className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      delay: index * 0.1 + 0.2,
                      ...SPRING_CONFIG.gentle,
                    }}
                  >
                    {displayValue}
                  </motion.p>
                </div>
              </div>

              {/* Decorative element */}
              <motion.div
                className={cn(
                  'w-16 h-16 rounded-full opacity-20',
                  config.bgColor
                )}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TiltCard>
  )
}

/**
 * Todo 统计组件
 */
export function TodoStats() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  const stats = useTodoStats()
  const completionRate = useCompletionRate()

  // 使用 useMemo 缓存统计值
  const statValues = useMemo(
    () => ({
      total: stats.total,
      active: stats.active,
      completed: stats.completed,
      rate: completionRate,
    }),
    [stats, completionRate]
  )

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STAT_CONFIG.map((config, index) => (
        <StatCard
          key={config.key}
          config={config}
          value={statValues[config.key as keyof typeof statValues]}
          index={index}
          isInView={isInView}
        />
      ))}
    </div>
  )
}