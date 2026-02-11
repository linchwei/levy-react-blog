import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  gameStep,
  movePaddle,
  startGame,
  resetGame,
  togglePause,
  type BreakoutGameState,
  defaultConfig,
} from './breakoutLogic'

interface BreakoutGameProps {
  onScoreChange?: (score: number) => void
  onGameOver?: (score: number) => void
}

export function BreakoutGame({ onScoreChange, onGameOver }: BreakoutGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<BreakoutGameState>(() => initializeGame())
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false })

  const canvasWidth = defaultConfig.canvasWidth
  const canvasHeight = defaultConfig.canvasHeight

  // 绘制游戏画面
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 绘制砖块
    state.bricks.forEach(brick => {
      if (brick.visible) {
        ctx.fillStyle = brick.color
        ctx.shadowColor = brick.color
        ctx.shadowBlur = 5
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
        ctx.shadowBlur = 0

        // 砖块边框
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        ctx.lineWidth = 2
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
      }
    })

    // 绘制挡板
    ctx.fillStyle = '#60a5fa'
    ctx.shadowColor = '#60a5fa'
    ctx.shadowBlur = 10
    ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height)
    ctx.shadowBlur = 0

    // 绘制球
    ctx.beginPath()
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#fbbf24'
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.closePath()
    ctx.shadowBlur = 0

    // 绘制生命（心形）
    for (let i = 0; i < state.lives; i++) {
      const x = 20 + i * 30
      const y = 30
      ctx.fillStyle = '#ef4444'
      ctx.font = '20px Arial'
      ctx.fillText('❤️', x, y)
    }
  }, [state, canvasWidth, canvasHeight])

  // 游戏循环
  useEffect(() => {
    if (state.status === 'PLAYING') {
      gameLoopRef.current = setInterval(() => {
        setState(prevState => {
          // 处理挡板移动
          let newState = prevState
          if (keysRef.current.left) {
            newState = movePaddle(newState, 'LEFT')
          }
          if (keysRef.current.right) {
            newState = movePaddle(newState, 'RIGHT')
          }

          newState = gameStep(newState)

          if (newState.score !== prevState.score) {
            onScoreChange?.(newState.score)
          }
          if (newState.status === 'GAME_OVER' && prevState.status !== 'GAME_OVER') {
            onGameOver?.(newState.score)
          }
          return newState
        })
      }, 1000 / 60) // 60 FPS
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [state.status, onScoreChange, onGameOver])

  // 绘制画面
  useEffect(() => {
    draw()
  }, [draw])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keysRef.current.left = true
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          keysRef.current.right = true
          break
        case ' ':
          e.preventDefault()
          setState(prev => togglePause(prev))
          break
        case 'r':
        case 'R':
          setState(prev => resetGame(prev))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keysRef.current.left = false
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          keysRef.current.right = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleStart = () => {
    setState(prev => startGame(prev))
  }

  const handleReset = () => {
    setState(prev => resetGame(prev))
  }

  const handlePauseToggle = () => {
    setState(prev => togglePause(prev))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🏓</span>
          打砖块
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            最高分: {state.highScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 游戏信息 */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">当前分数</p>
            <p className="text-2xl font-bold">{state.score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">等级</p>
            <p className="text-2xl font-bold">{state.level}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">生命</p>
            <p className="text-2xl font-bold">{state.lives}</p>
          </div>
        </div>

        {/* 游戏画布 */}
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="border-2 border-border rounded-lg max-w-full h-auto"
              style={{ imageRendering: 'pixelated' }}
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
                    <p className="text-lg font-medium mb-4">准备好了吗？</p>
                    <Button onClick={handleStart} size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      开始游戏
                    </Button>
                  </>
                )}
                {state.status === 'PAUSED' && (
                  <>
                    <p className="text-lg font-medium mb-4">游戏暂停</p>
                    <Button onClick={handlePauseToggle} size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      继续游戏
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
        <div className="flex flex-wrap items-center justify-center gap-2">
          {state.status === 'PLAYING' ? (
            <Button variant="outline" onClick={handlePauseToggle}>
              <Pause className="w-4 h-4 mr-2" />
              暂停
            </Button>
          ) : (
            <Button onClick={handleStart}>
              <Play className="w-4 h-4 mr-2" />
              {state.status === 'GAME_OVER' ? '再来一局' : '开始'}
            </Button>
          )}
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
            onMouseDown={() => (keysRef.current.left = true)}
            onMouseUp={() => (keysRef.current.left = false)}
            onTouchStart={() => (keysRef.current.left = true)}
            onTouchEnd={() => (keysRef.current.left = false)}
            disabled={state.status !== 'PLAYING'}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onMouseDown={() => (keysRef.current.right = true)}
            onMouseUp={() => (keysRef.current.right = false)}
            onTouchStart={() => (keysRef.current.right = true)}
            onTouchEnd={() => (keysRef.current.right = false)}
            disabled={state.status !== 'PLAYING'}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>操作: ←→ 或 A/D 移动挡板 | 空格 暂停 | R 重置</p>
          <p className="mt-1">目标: 消除所有砖块</p>
        </div>
      </CardContent>
    </Card>
  )
}
