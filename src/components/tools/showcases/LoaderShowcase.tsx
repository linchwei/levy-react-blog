import { useState, useEffect } from 'react'
import { motion, type Easing } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Loader2 } from 'lucide-react'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  stagger: number
}

interface LoaderShowcaseProps {
  config: AnimationConfig
}

export function LoaderShowcase({ config }: LoaderShowcaseProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsLoading(false)
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  const handleReplay = () => {
    setProgress(0)
    setIsLoading(true)
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

  return (
    <div className="space-y-4">
      <div className="relative h-80 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-6">
                {/* Spinner */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: config.duration,
                      ease: 'linear',
                      repeat: Infinity,
                    }}
                  >
                    <Loader2 className="w-12 h-12 text-blue-500" />
                  </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loading...</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>

                {/* Skeleton Items */}
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-4 bg-slate-200 dark:bg-slate-700 rounded"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: config.duration * 2,
                        ease: getEase(),
                        repeat: Infinity,
                        delay: i * config.stagger,
                      }}
                      style={{ width: `${80 - i * 15}%` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: config.duration, ease: getEase() }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: config.delay,
                  }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <h3 className="font-semibold text-lg">加载完成!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  所有内容已准备就绪
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleReplay} variant="outline" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        重新加载
      </Button>
    </div>
  )
}
