import { useState } from 'react'
import { motion, type Easing } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, CreditCard, Shield, Lock, Unlock } from 'lucide-react'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  stagger: number
}

interface Flip3DShowcaseProps {
  config: AnimationConfig
}

export function Flip3DShowcase({ config }: Flip3DShowcaseProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [key, setKey] = useState(0)

  const handleReplay = () => {
    setIsFlipped(false)
    setKey(prev => prev + 1)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
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
      <div className="relative h-80 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex items-center justify-center p-6">
        <div className="relative w-72 h-44" style={{ perspective: 1000 }}>
          <motion.div
            key={key}
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              duration: config.duration,
              ease: getEase(),
              delay: config.delay,
            }}
            onClick={handleFlip}
          >
            {/* Front */}
            <Card
              className="absolute inset-0 backface-hidden cursor-pointer overflow-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                          width: `${100 + i * 50}px`,
                          height: `${100 + i * 50}px`,
                          top: `${-20 + i * 10}%`,
                          left: `${-20 + i * 15}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <CardContent className="relative h-full flex flex-col justify-between p-5 text-white">
                  <div className="flex justify-between items-start">
                    <CreditCard className="w-10 h-10 opacity-80" />
                    <Shield className="w-8 h-8 opacity-80" />
                  </div>
                  <div>
                    <p className="text-lg tracking-widest font-mono mb-1">
                      **** **** **** 4242
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-70 uppercase">Card Holder</p>
                        <p className="font-medium">JOHN DOE</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70 uppercase">Expires</p>
                        <p className="font-medium">12/28</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Back */}
            <Card
              className="absolute inset-0 backface-hidden cursor-pointer overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
                <CardContent className="relative h-full flex flex-col justify-center items-center p-5 text-white">
                  <Lock className="w-12 h-12 mb-4 opacity-80" />
                  <p className="text-center text-sm opacity-80">
                    CVV
                  </p>
                  <p className="text-2xl font-mono tracking-widest">
                    ***
                  </p>
                  <p className="text-xs text-center mt-4 opacity-60">
                    Click to reveal front
                  </p>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-sm text-muted-foreground">
            点击卡片翻转
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFlip} variant="outline" className="flex-1">
          {isFlipped ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
          {isFlipped ? '显示正面' : '显示背面'}
        </Button>
        <Button onClick={handleReplay} variant="outline" className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
      </div>
    </div>
  )
}
