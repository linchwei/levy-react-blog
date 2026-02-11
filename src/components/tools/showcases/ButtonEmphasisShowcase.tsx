import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Heart, Star, Zap, CheckCircle2, RotateCcw } from 'lucide-react'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  stagger: number
}

interface ButtonEmphasisShowcaseProps {
  animationType: 'pulse' | 'shake' | 'bounce' | 'tada' | 'heartbeat' | 'glow'
  config: AnimationConfig
}

export function ButtonEmphasisShowcase({
  animationType,
  config,
}: ButtonEmphasisShowcaseProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleTrigger = () => {
    setIsAnimating(false)
    setTimeout(() => setIsAnimating(true), 10)
    setTimeout(() => setIsAnimating(false), config.duration * 1000 + 500)
  }

  const getAnimationProps = () => {
    const transition = {
      duration: config.duration,
      ease: config.ease as import('framer-motion').Easing,
      repeat: isAnimating ? 1 : 0,
    }

    switch (animationType) {
      case 'pulse':
        return {
          animate: isAnimating
            ? {
                scale: [1, 1.1, 1],
                transition: { ...transition, repeat: Infinity },
              }
            : undefined,
        }
      case 'shake':
        return {
          animate: isAnimating
            ? {
                x: [0, -10, 10, -10, 10, 0],
                transition,
              }
            : undefined,
        }
      case 'bounce':
        return {
          animate: isAnimating
            ? {
                y: [0, -20, 0],
                transition: { ...transition, repeat: 2 },
              }
            : undefined,
        }
      case 'tada':
        return {
          animate: isAnimating
            ? {
                scale: [1, 0.9, 1.1, 1.1, 1],
                rotate: [0, -3, 3, -3, 3, 0],
                transition,
              }
            : undefined,
        }
      case 'heartbeat':
        return {
          animate: isAnimating
            ? {
                scale: [1, 1.3, 1, 1.3, 1],
                transition: { ...transition, repeat: 1 },
              }
            : undefined,
        }
      case 'glow':
        return {
          animate: isAnimating
            ? {
                boxShadow: [
                  '0 0 0 0 rgba(59, 130, 246, 0)',
                  '0 0 20px 10px rgba(59, 130, 246, 0.5)',
                  '0 0 0 0 rgba(59, 130, 246, 0)',
                ],
                transition: { ...transition, repeat: Infinity },
              }
            : undefined,
        }
      default:
        return {}
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <div className="relative h-80 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-8">
          {/* Notification Bell with Badge */}
          <div className="flex items-center gap-4">
            <motion.div {...getAnimationProps()} className="relative">
              <Button
                variant="outline"
                size="lg"
                className="relative w-16 h-16 rounded-full"
                onClick={() => {
                  setNotificationCount(0)
                  handleTrigger()
                }}
              >
                <Bell className="w-6 h-6" />
                <AnimatePresence>
                  {notificationCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {notificationCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            <span className="text-sm text-muted-foreground">通知按钮</span>
          </div>

          {/* Like Button */}
          <div className="flex items-center gap-4">
            <motion.div {...getAnimationProps()}>
              <Button
                variant={isLiked ? 'default' : 'outline'}
                size="lg"
                className={`gap-2 ${isLiked ? 'bg-red-500 hover:bg-red-600' : ''}`}
                onClick={() => {
                  setIsLiked(!isLiked)
                  handleTrigger()
                }}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? '已点赞' : '点赞'}
              </Button>
            </motion.div>
            <span className="text-sm text-muted-foreground">点赞按钮</span>
          </div>

          {/* Subscribe Button */}
          <div className="flex items-center gap-4">
            <motion.div {...getAnimationProps()}>
              <Button
                variant={isSubscribed ? 'secondary' : 'default'}
                size="lg"
                className="gap-2"
                onClick={() => {
                  setIsSubscribed(!isSubscribed)
                  handleTrigger()
                }}
              >
                <Zap className="w-5 h-5" />
                {isSubscribed ? '已订阅' : '立即订阅'}
              </Button>
            </motion.div>
            <span className="text-sm text-muted-foreground">订阅按钮</span>
          </div>

          {/* Status Badges */}
          <div className="flex gap-3">
            <motion.div
              animate={
                isAnimating && animationType === 'pulse'
                  ? {
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: config.duration,
                        repeat: Infinity,
                      },
                    }
                  : {}
              }
            >
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                在线
              </Badge>
            </motion.div>
            <motion.div
              animate={
                isAnimating && animationType === 'glow'
                  ? {
                      boxShadow: [
                        '0 0 0 0 rgba(234, 179, 8, 0)',
                        '0 0 10px 5px rgba(234, 179, 8, 0.3)',
                        '0 0 0 0 rgba(234, 179, 8, 0)',
                      ],
                      transition: {
                        duration: config.duration,
                        repeat: Infinity,
                      },
                    }
                  : {}
              }
            >
              <Badge variant="outline" className="gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                Pro
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={handleTrigger} variant="outline" className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          触发动画
        </Button>
      </div>
    </div>
  )
}
