import { useState } from 'react'
import {
  motion,
  AnimatePresence,
  type Variants,
  type Easing,
} from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, X, Bell, Settings, User, Shield } from 'lucide-react'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  stagger: number
}

interface ModalTransitionShowcaseProps {
  config: AnimationConfig
}

export function ModalTransitionShowcase({
  config,
}: ModalTransitionShowcaseProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const handleReplay = () => {
    setIsOpen(false)
    setTimeout(() => setIsOpen(true), 300)
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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: config.duration * 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: config.duration * 0.3 },
    },
  }

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: config.duration,
        ease: getEase(),
        delay: config.delay,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: config.duration * 0.3 },
    },
  }

  const contentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.stagger,
        delayChildren: config.delay + config.duration * 0.5,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: config.duration * 0.5, ease: getEase() },
    },
  }

  const tabs = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'security', label: '安全', icon: Shield },
    { id: 'settings', label: '设置', icon: Settings },
  ]

  return (
    <div className="space-y-4">
      <div className="relative h-80 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex items-center justify-center p-6">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                size="lg"
                onClick={() => setIsOpen(true)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                打开设置
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"
                onClick={() => setIsOpen(false)}
              />

              {/* Modal */}
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute z-20 w-full max-w-md"
              >
                <Card className="overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">设置</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Sidebar */}
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-32 border-r p-2 space-y-1"
                      >
                        {tabs.map(tab => (
                          <motion.button
                            key={tab.id}
                            variants={itemVariants}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              activeTab === tab.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent'
                            }`}
                          >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                          </motion.button>
                        ))}
                      </motion.div>

                      {/* Content */}
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 p-4"
                      >
                        <motion.div variants={itemVariants}>
                          <h4 className="font-medium mb-2">
                            {tabs.find(t => t.id === activeTab)?.label}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            这里是{tabs.find(t => t.id === activeTab)?.label}
                            的内容区域。 动画展示了模态框的进入和退出效果。
                          </p>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="mt-4 space-y-2"
                        >
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-8 bg-accent rounded" />
                          ))}
                        </motion.div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="flex-1"
        >
          {isOpen ? '关闭' : '打开'}模态框
        </Button>
        <Button onClick={handleReplay} variant="outline" className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          重播
        </Button>
      </div>
    </div>
  )
}
