import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LoadingProps } from '@/types'

interface LoadingSpinnerProps extends LoadingProps {
  fullscreen?: boolean
}

/**
 * 加载旋转器组件
 * Loading Spinner Component
 */
export function LoadingSpinner({ 
  className, 
  size = 'md', 
  text,
  fullscreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={cn('text-primary', sizeClasses[size])} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    )
  }

  return content
}

/**
 * 页面加载状态
 */
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="加载中..." />
    </div>
  )
}

/**
 * 骨架屏组件
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn('bg-muted rounded-md', className)}
    />
  )
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
