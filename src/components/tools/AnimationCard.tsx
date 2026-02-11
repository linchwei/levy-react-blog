import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Check, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CodeBlock } from './CodeBlock'
import type { CSSAnimation } from '@/data/cssAnimations'

interface AnimationCardProps {
  animation: CSSAnimation
  duration: string
  timing: string
}

export function AnimationCard({
  animation,
  duration,
  timing,
}: AnimationCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)

  // 生成完整的 CSS 代码
  const generateFullCSS = () => {
    const className = animation.className.match(/\.(\w+)/)?.[1] || animation.id
    return `${animation.keyframes}

.${className} {
  animation: ${className} ${duration} ${timing}${animation.category === 'emphasis' || animation.category === 'special' ? ' infinite' : ''};
  ${animation.className.includes('transform-origin') ? 'transform-origin: center;' : ''}
  ${animation.className.includes('backface-visibility') ? 'backface-visibility: visible;' : ''}
}`
  }

  // 播放动画
  const handlePlay = () => {
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 10)
    setTimeout(() => setIsPlaying(false), 2000)
  }

  // 复制代码
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateFullCSS())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 获取动画样式
  const getAnimationStyle = () => {
    const className = animation.className.match(/\.(\w+)/)?.[1] || animation.id
    return {
      animation: isPlaying
        ? `${className} ${duration} ${timing}${animation.category === 'emphasis' || animation.category === 'special' ? ' infinite' : ''}`
        : 'none',
    }
  }

  // 获取分类颜色
  const getCategoryColor = () => {
    switch (animation.category) {
      case 'entrance':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'emphasis':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'exit':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'special':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    }
  }

  // 获取分类名称
  const getCategoryName = () => {
    switch (animation.category) {
      case 'entrance':
        return '入场'
      case 'emphasis':
        return '强调'
      case 'exit':
        return '退出'
      case 'special':
        return '特殊'
      default:
        return '其他'
    }
  }

  return (
    <>
      <Card className="group overflow-hidden bg-linear-to-br from-card/50 to-card border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-4">
          {/* Preview Area */}
          <div
            className="relative h-32 rounded-lg bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handlePlay}
          >
            {/* Animated Element */}
            <motion.div
              className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center"
              style={getAnimationStyle()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 text-white" />
            </motion.div>

            {/* Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 dark:bg-white/5">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                点击预览
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{animation.name}</h3>
              <Badge
                variant="outline"
                className={`text-xs ${getCategoryColor()}`}
              >
                {getCategoryName()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {animation.description}
            </p>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={handlePlay}
              >
                <Play className="w-3 h-3 mr-1" />
                预览
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={() => setShowCode(true)}
              >
                <Code2 className="w-3 h-3 mr-1" />
                代码
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={handleCopy}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: copied ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Dialog */}
      <Dialog open={showCode} onOpenChange={setShowCode}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {animation.name}
              <Badge variant="outline" className={getCategoryColor()}>
                {getCategoryName()}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {animation.description}
            </p>
            <CodeBlock
              code={generateFullCSS()}
              filename={`${animation.id}.css`}
            />
            <div className="flex gap-2">
              <Button onClick={handleCopy} className="flex-1">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    复制 CSS 代码
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowCode(false)}>
                关闭
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inject Keyframes Style */}
      <style>{`
        @keyframes ${animation.className.match(/\.(\w+)/)?.[1] || animation.id} {
          ${animation.keyframes.replace(/@keyframes\s+\w+\s*\{/, '').replace(/\}$/, '')}
        }
      `}</style>
    </>
  )
}
