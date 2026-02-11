import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  initializeGame,
  gameStep,
  setDirection,
  startGame,
  resetGame,
  togglePause,
  setBaseSpeed,
  type Direction,
  type SnakeGameState,
  defaultConfig,
} from './snakeLogic'

interface SnakeGameProps {
  onScoreChange?: (score: number) => void
  onGameOver?: (score: number) => void
}

export function SnakeGame({ onScoreChange, onGameOver }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<SnakeGameState>(() => initializeGame())
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cellSize = 20
  const canvasWidth = defaultConfig.gridWidth * cellSize
  const canvasHeight = defaultConfig.gridHeight * cellSize

  // 绘制游戏画面
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 绘制网格
    ctx.strokeStyle = '#2d2d44'
    ctx.lineWidth = 1
    for (let i = 0; i <= defaultConfig.gridWidth; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvasHeight)
      ctx.stroke()
    }
    for (let i = 0; i <= defaultConfig.gridHeight; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvasWidth, i * cellSize)
      ctx.stroke()
    }

    // 绘制蛇
    state.snake.forEach((node, index) => {
      const x = node.x * cellSize
      const y = node.y * cellSize

      if (index === 0) {
        // 蛇头
        ctx.fillStyle = '#4ade80'
        ctx.shadowColor = '#4ade80'
        ctx.shadowBlur = 10
      } else {
        // 蛇身
        const gradient = (1 - index / state.snake.length) * 0.5 + 0.3
        ctx.fillStyle = `rgba(74, 222, 128, ${gradient})`
        ctx.shadowBlur = 0
      }

      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)

      // 绘制蛇眼
      if (index === 0) {
        ctx.fillStyle = '#1a1a2e'
        ctx.shadowBlur = 0
        const eyeSize = 3
        ctx.fillRect(x + 5, y + 5, eyeSize, eyeSize)
        ctx.fillRect(x + 12, y + 5, eyeSize, eyeSize)
      }
    })

    // 绘制食物
    const foodX = state.food.x * cellSize
    const foodY = state.food.y * cellSize

    if (state.food.type === 'SPECIAL') {
      // 特殊食物 - 金色发光
      ctx.fillStyle = '#fbbf24'
      ctx.shadowColor = '#fbbf24'
      ctx.shadowBlur = 15
    } else {
      // 普通食物 - 红色
      ctx.fillStyle = '#f87171'
      ctx.shadowColor = '#f87171'
      ctx.shadowBlur = 10
    }

    const centerX = foodX + cellSize / 2
    const centerY = foodY + cellSize / 2
    const radius = cellSize / 2 - 2

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }, [state, canvasWidth, canvasHeight])

  // 游戏循环
  useEffect(() => {
    if (state.status === 'PLAYING') {
      gameLoopRef.current = setInterval(() => {
        setState(prevState => {
          const newState = gameStep(prevState)
          if (
            newState.status === 'GAME_OVER' &&
            prevState.status !== 'GAME_OVER'
          ) {
            onGameOver?.(newState.score)
          }
          if (newState.score !== prevState.score) {
            onScoreChange?.(newState.score)
          }
          return newState
        })
      }, state.speed)
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
  }, [state.status, state.speed, onScoreChange, onGameOver])

  // 绘制画面
  useEffect(() => {
    draw()
  }, [draw])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止方向键滚动页面
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)
      ) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setState(prev => setDirection(prev, 'UP'))
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          setState(prev => setDirection(prev, 'DOWN'))
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setState(prev => setDirection(prev, 'LEFT'))
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          setState(prev => setDirection(prev, 'RIGHT'))
          break
        case ' ':
          setState(prev => togglePause(prev))
          break
        case 'r':
        case 'R':
          setState(prev => resetGame(prev))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🐍</span>
          贪吃蛇
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            最高分: {state.highScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
              className="border-2 border-border rounded-lg cursor-pointer"
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
                    <p className="text-2xl font-bold text-destructive mb-2">
                      游戏结束
                    </p>
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

        {/* 速度控制 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">游戏速度</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {state.baseSpeed <= 80
                ? '极快'
                : state.baseSpeed <= 120
                  ? '快'
                  : state.baseSpeed <= 180
                    ? '正常'
                    : '慢'}
            </span>
          </div>
          <Slider
            value={[state.baseSpeed]}
            onValueChange={([value]) =>
              setState(prev => setBaseSpeed(prev, value))
            }
            min={50}
            max={250}
            step={10}
            disabled={state.status === 'PLAYING'}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>快</span>
            <span>慢</span>
          </div>
          {state.status === 'PLAYING' && (
            <p className="text-xs text-muted-foreground text-center">
              游戏进行中无法调整速度
            </p>
          )}
        </div>

        {/* 游戏信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">当前分数</p>
              <p className="text-2xl font-bold">{state.score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">速度等级</p>
              <p className="text-2xl font-bold">
                {Math.round((250 - state.speed) / 10)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        </div>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>操作: ↑↓←→ 或 WASD 移动 | 空格 暂停 | R 重置</p>
        </div>
      </CardContent>
    </Card>
  )
}
