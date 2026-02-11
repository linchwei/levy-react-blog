import { useState } from 'react'
import { motion, AnimatePresence, type Variants, type Easing } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RotateCcw, Heart, MessageCircle, Share2 } from 'lucide-react'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  stagger: number
}

interface CardEntranceShowcaseProps {
  animationType: 'fade' | 'slide' | 'scale' | 'flip' | 'rotate'
  config: AnimationConfig
}

export function CardEntranceShowcase({ animationType, config }: CardEntranceShowcaseProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [key, setKey] = useState(0)

  const handleReplay = () => {
    setIsVisible(false)
    setTimeout(() => {
      setKey(prev => prev + 1)
      setIsVisible(true)
    }, 100)
  }

  const getEase = (): Easing => {
    const easeMap: Record<string, Easing> = {
      linear: 'linear' as const,
      easeIn: 'easeIn' as const,
      easeOut: 'easeOut' as const,
      easeInOut: 'easeInOut' as const,
      circIn: 'circIn' as const,
      circOut: 'circOut' as const,
      backIn: 'backIn' as const,
      backOut: 'backOut' as const,
      elastic: [0.68, -0.55, 0.265, 1.55] as Easing,
      bounce: [0.175, 0.885, 0.32, 1.275] as Easing,
    }
    return easeMap[config.ease] || ('easeOut' as Easing)
  }

  const getVariants = (): Variants => {
    const baseTransition = {
      duration: config.duration,
      delay: config.delay,
      ease: getEase(),
    }

    switch (animationType) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition },
        }
      case 'slide':
        return {
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0, transition: baseTransition },
        }
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1, transition: baseTransition },
        }
      case 'flip':
        return {
          hidden: { opacity: 0, rotateY: -90 },
          visible: { opacity: 1, rotateY: 0, transition: baseTransition },
        }
      case 'rotate':
        return {
          hidden: { opacity: 0, rotate: -180, scale: 0.5 },
          visible: { opacity: 1, rotate: 0, scale: 1, transition: baseTransition },
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition },
        }
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.stagger,
        delayChildren: config.delay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.duration * 0.5,
        ease: getEase(),
      },
    },
  }

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <div className="relative h-80 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={key}
              variants={getVariants()}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full max-w-sm"
              style={{ perspective: 1000 }}
            >
              <Card className="overflow-hidden shadow-xl">
                {/* Card Header with Image */}
                <div className="relative h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute -bottom-6 left-4"
                  >
                    <motion.div variants={itemVariants}>
                      <Avatar className="w-16 h-16 border-4 border-white dark:border-slate-800">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </motion.div>
                  <Badge className="absolute top-3 right-3 bg-white/20 text-white backdrop-blur-sm">
                    Featured
                  </Badge>
                </div>

                <CardContent className="pt-8 pb-4">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.h3 variants={itemVariants} className="font-bold text-lg">
                      John Doe
                    </motion.h3>
                    <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
                      Frontend Developer
                    </motion.p>
                    <motion.p variants={itemVariants} className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                      Passionate about creating beautiful and interactive user experiences with modern web technologies.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="w-4 h-4 mr-2" />
                        Like
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comment
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={handleReplay} variant="outline" className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          重播动画
        </Button>
      </div>
    </div>
  )
}
