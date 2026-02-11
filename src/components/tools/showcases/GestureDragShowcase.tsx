import { useState } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  type Easing,
} from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Mail, Archive, Trash2 } from 'lucide-react'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  stagger: number
}

interface GestureDragShowcaseProps {
  config: AnimationConfig
}

interface Email {
  id: number
  sender: string
  subject: string
  preview: string
}

export function GestureDragShowcase({ config }: GestureDragShowcaseProps) {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: 1,
      sender: 'GitHub',
      subject: 'New pull request',
      preview: 'Someone opened a new pull request...',
    },
    {
      id: 2,
      sender: 'Vercel',
      subject: 'Deployment successful',
      preview: 'Your deployment is now live...',
    },
    {
      id: 3,
      sender: 'Figma',
      subject: 'Comment on design',
      preview: 'John left a comment on your design...',
    },
  ])

  const handleReplay = () => {
    setEmails([
      {
        id: 1,
        sender: 'GitHub',
        subject: 'New pull request',
        preview: 'Someone opened a new pull request...',
      },
      {
        id: 2,
        sender: 'Vercel',
        subject: 'Deployment successful',
        preview: 'Your deployment is now live...',
      },
      {
        id: 3,
        sender: 'Figma',
        subject: 'Comment on design',
        preview: 'John left a comment on your design...',
      },
    ])
  }

  const removeEmail = (id: number) => {
    setEmails(emails.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="relative h-80 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden p-6">
        <div className="w-full max-w-md mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {emails.map(email => (
              <SwipeableEmailCard
                key={email.id}
                email={email}
                onRemove={() => removeEmail(email.id)}
                config={config}
              />
            ))}
          </AnimatePresence>

          {emails.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">所有邮件已处理</p>
            </motion.div>
          )}
        </div>
      </div>

      <Button onClick={handleReplay} variant="outline" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        重置演示
      </Button>
    </div>
  )
}

interface SwipeableEmailCardProps {
  email: Email
  onRemove: () => void
  config: AnimationConfig
}

function SwipeableEmailCard({
  email,
  onRemove,
  config,
}: SwipeableEmailCardProps) {
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])

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

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 100) {
      onRemove()
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{ duration: config.duration, ease: getEase() }}
      className="relative"
    >
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-4 rounded-lg overflow-hidden">
        <motion.div
          className="flex items-center gap-2 text-white font-medium"
          style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
        >
          <Trash2 className="w-5 h-5" />
          删除
        </motion.div>
        <motion.div
          className="flex items-center gap-2 text-white font-medium"
          style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
        >
          归档
          <Archive className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        whileTap={{ cursor: 'grabbing' }}
      >
        <Card className="cursor-grab active:cursor-grabbing bg-white dark:bg-slate-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {email.sender[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{email.sender}</p>
                <p className="text-sm font-medium truncate">{email.subject}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {email.preview}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
