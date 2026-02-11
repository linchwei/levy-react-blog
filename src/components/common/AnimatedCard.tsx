import { memo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ANIMATION_DURATION, SPRING_CONFIG } from '@/constants'
import type { AnimatedCardProps } from '@/types'

interface AnimatedCardComponentProps extends AnimatedCardProps {
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'none'
  clickEffect?: boolean
}

/**
 * 动画卡片组件
 * Animated Card Component
 * 
 * 提供多种动画效果的卡片容器
 */
export const AnimatedCard = memo(function AnimatedCard({
  children,
  className,
  delay = 0,
  duration = ANIMATION_DURATION.normal,
  hoverScale = 1.02,
  hoverEffect = 'lift',
  clickEffect = true,
}: AnimatedCardComponentProps) {
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -5, scale: hoverScale }
      case 'scale':
        return { scale: hoverScale }
      case 'glow':
        return { 
          scale: hoverScale,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }
      case 'none':
        return {}
      default:
        return { y: -5, scale: hoverScale }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration,
        delay,
        ...SPRING_CONFIG.default,
      }}
      whileHover={getHoverAnimation()}
      whileTap={clickEffect ? { scale: 0.98 } : undefined}
      className={cn('h-full', className)}
    >
      <Card className="h-full overflow-hidden">
        {children}
      </Card>
    </motion.div>
  )
})

/**
 * 交错动画容器
 * Stagger Animation Container
 */
export const StaggerContainer = memo(function StaggerContainer({
  children,
  className,
  staggerDelay = 0.05,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
})

/**
 * 交错动画子项
 */
export const StaggerItem = memo(function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: SPRING_CONFIG.default,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
})

/**
 * 淡入动画包装器
 */
export const FadeIn = memo(function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 20 }
      case 'down': return { y: -20 }
      case 'left': return { x: 20 }
      case 'right': return { x: -20 }
      case 'none': return {}
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: ANIMATION_DURATION.normal,
        delay,
        ...SPRING_CONFIG.default,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
})
