import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  movePaddle,
  gameStep,
  startGame,
  resetGame,
  defaultConfig,
  type PinballState,
} from './pinballLogic'

interface PinballGameProps {
  onScoreChange?: (score: number) => void
  onGameOver?: (score: number) => void
}

export function PinballGame({ onScoreChange, onGameOver }: PinballGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<PinballState>(() => initializeGame())
  const rafRef = useRef<number | null>(null)
  const keysRef = useRef<Record<string, boolean>>({})

  const canvasWidth = defaultConfig.canvasWidth
  const canvasHeight = defaultConfig.canvasHeight

  // 绘制游戏
  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 绘制砖块
    state.bricks.forEach(brick => {
      ctx.fillStyle = brick.color
      ctx.fillRect(
        brick.x - brick.width / 2,
        brick.y - brick.height / 2,
        brick.width,
        brick.height
      )
      // 高光
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillRect(
        brick.x - brick.width / 2,
        brick.y - brick.height / 2,
        brick.width,
        3
      )
    })

    // 绘制挡板
    ctx.fillStyle = '#60a5fa'
    ctx.fillRect(
      state.paddle.x - state.paddle.width / 2,
      state.paddle.y - state.paddle.height / 2,
      state.paddle.width,
      state.paddle.height
    )

    // 绘制球
    ctx.beginPath()
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    ctx.stroke()

    // 绘制粒子
    state.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife
      ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba')
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4)
    })
  }

  // 游戏循环
  useEffect(() => {
    if (state.status !== 'PLAYING') {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      draw()
      return
    }

    let lastTime = 0
    const frameInterval = 1000 / 60

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastTime >= frameInterval) {
        lastTime = timestamp

        setState(prev => {
          let newState = prev

          // 处理挡板移动
          if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
            newState = movePaddle(newState, 'LEFT')
          }
          if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
            newState = movePaddle(newState, 'RIGHT')
          }

          newState = gameStep(newState)

          if (newState.score !== prev.score) {
            onScoreChange?.(newState.score)
          }
          if (newState.status === 'GAME_OVER' && prev.status !== 'GAME_OVER') {
            onGameOver?.(newState.score)
          }

          return newState
        })
      }

      rafRef.current = requestAnimationFrame(gameLoop)
    }

    rafRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [state.status, onScoreChange, onGameOver])

  // 绘制
  useEffect(() => {
    draw()
  }, [state])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
      if (e.key === ' ' && state.status === 'IDLE') {
        e.preventDefault()
        setState(prev => startGame(prev))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [state.status])

  const handleStart = () => setState(prev => startGame(prev))
  const handleReset = () => setState(prev => resetGame(prev))

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🏓</span>
          弹球
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">最高分: {state.highScore}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 游戏信息 */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">分数</p>
            <p className="text-xl font-bold">{state.score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">生命</p>
            <p className="text-xl font-bold">{'❤️'.repeat(state.lives)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">关卡</p>
            <p className="text-xl font-bold">{state.level}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">砖块</p>
            <p className="text-xl font-bold">{state.bricks.length}</p>
          </div>
        </div>

        {/* 游戏画布 */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="border-2 border-border rounded-lg"
            />

            {/* 游戏状态覆盖层 */}
            {state.status !== 'PLAYING' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg"
              >
                {state.status === 'IDLE' && (
                  <>
                    <p className="text-lg font-medium mb-4">点击开始或使用空格键</p>
                    <Button onClick={handleStart} size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      开始游戏
                    </Button>
                  </>
                )}
                {state.status === 'GAME_OVER' && (
                  <>
                    <p className="text-2xl font-bold text-destructive mb-2">游戏结束</p>
                    <p className="text-lg mb-4">最终得分: {state.score}</p>
                    <Button onClick={handleStart} size="lg">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      再来一局
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap justify-center gap-2">
          {state.status === 'IDLE' ? (
            <Button onClick={handleStart}>
              <Play className="w-4 h-4 mr-2" />
              开始
            </Button>
          ) : state.status === 'GAME_OVER' ? (
            <Button onClick={handleStart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              再来一局
            </Button>
          ) : null}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
        </div>

        {/* 虚拟按键（移动端） */}
        <div className="flex justify-center gap-4 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onTouchStart={() => keysRef.current['ArrowLeft'] = true}
            onTouchEnd={() => keysRef.current['ArrowLeft'] = false}
            disabled={state.status !== 'PLAYING'}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onTouchStart={() => keysRef.current['ArrowRight'] = true}
            onTouchEnd={() => keysRef.current['ArrowRight'] = false}
            disabled={state.status !== 'PLAYING'}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>左右方向键或AD键移动挡板</p>
          <p className="mt-1">空格键开始游戏</p>
        </div>
      </CardContent>
    </Card>
  )
}
