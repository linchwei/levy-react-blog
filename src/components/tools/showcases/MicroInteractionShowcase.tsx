import { useState } from 'react'
import { motion, AnimatePresence, type Easing } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { RotateCcw, Search, Send, Check, X, Eye, EyeOff } from 'lucide-react'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  stagger: number
}

interface MicroInteractionShowcaseProps {
  config: AnimationConfig
}

export function MicroInteractionShowcase({
  config,
}: MicroInteractionShowcaseProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  const handleSend = () => {
    if (isSent) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
      setTimeout(() => setIsSent(false), 2000)
    }, 1500)
  }

  const handleReplay = () => {
    setIsFocused(false)
    setSearchValue('')
    setIsLoading(false)
    setIsSent(false)
    setIsChecked(false)
    setShowPassword(false)
    setPassword('')
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
          <CardContent className="p-6 space-y-4">
            {/* Search Input with Focus Animation */}
            <motion.div
              className="relative"
              animate={{
                scale: isFocused ? 1.02 : 1,
              }}
              transition={{ duration: config.duration, ease: getEase() }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索..."
                className="pl-10"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <AnimatePresence>
                {searchValue && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchValue('')}
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Input with Toggle */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                <AnimatePresence mode="wait">
                  {showPassword ? (
                    <motion.div
                      key="eye"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: config.duration }}
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eyeoff"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: config.duration }}
                    >
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between">
              <span className="text-sm">启用通知</span>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Switch checked={isChecked} onCheckedChange={setIsChecked} />
              </motion.div>
            </div>

            {/* Send Button with Loading State */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full relative overflow-hidden"
                onClick={handleSend}
                disabled={isLoading || isSent}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.div>
                      发送中...
                    </motion.div>
                  ) : isSent ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                      已发送
                    </motion.div>
                  ) : (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      发送消息
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleReplay} variant="outline" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        重置演示
      </Button>
    </div>
  )
}
