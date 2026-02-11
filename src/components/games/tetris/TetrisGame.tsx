import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Trophy, ChevronDown, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  gameStep,
  movePiece,
  rotatePiece,
  hardDrop,
  startGame,
  resetGame,
  togglePause,
  TETROMINOES,
  type TetrisGameState,
  defaultConfig,
  calculateSpeed,
} from './tetrisLogic'

interface TetrisGameProps {
  onScoreChange?: (score: number) => void
  onGameOver?: (score: number) => void
}

export function TetrisGame({ onScoreChange, onGameOver }: TetrisGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nextPieceRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<TetrisGameState>(() => initializeGame())
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cellSize = 25
  const canvasWidth = defaultConfig.boardWidth * cellSize
  const canvasHeight = defaultConfig.boardHeight * cellSize

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
    for (let i = 0; i <= defaultConfig.boardWidth; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvasHeight)
      ctx.stroke()
    }
    for (let i = 0; i <= defaultConfig.boardHeight; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvasWidth, i * cellSize)
      ctx.stroke()
    }

    // 绘制已锁定的方块
    state.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.filled && cell.color) {
          ctx.fillStyle = cell.color
          ctx.shadowColor = cell.color
          ctx.shadowBlur = 5
          ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2)
          ctx.shadowBlur = 0
        }
      })
    })

    // 绘制当前方块
    state.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardX = state.currentPiece.x + x
          const boardY = state.currentPiece.y + y
          if (boardY >= 0) {
            ctx.fillStyle = state.currentPiece.color
            ctx.shadowColor = state.currentPiece.color
            ctx.shadowBlur = 8
            ctx.fillRect(boardX * cellSize + 1, boardY * cellSize + 1, cellSize - 2, cellSize - 2)
            ctx.shadowBlur = 0
          }
        }
      })
    })
  }, [state, canvasWidth, canvasHeight])

  // 绘制下一个方块
  const drawNextPiece = useCallback(() => {
    const canvas = nextPieceRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, 100, 100)

    const nextTetromino = TETROMINOES[state.nextPiece]
    const shape = nextTetromino.shape
    const color = nextTetromino.color

    const blockSize = 20
    const offsetX = (100 - shape[0].length * blockSize) / 2
    const offsetY = (100 - shape.length * blockSize) / 2

    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillStyle = color
          ctx.shadowColor = color
          ctx.shadowBlur = 5
          ctx.fillRect(
            offsetX + x * blockSize,
            offsetY + y * blockSize,
            blockSize - 2,
            blockSize - 2
          )
          ctx.shadowBlur = 0
        }
      })
    })
  }, [state.nextPiece])

  // 游戏循环
  useEffect(() => {
    if (state.status === 'PLAYING') {
      const speed = calculateSpeed(state.level)
      gameLoopRef.current = setInterval(() => {
        setState(prevState => {
          const newState = gameStep(prevState)
          if (newState.status === 'GAME_OVER' && prevState.status !== 'GAME_OVER') {
            onGameOver?.(newState.score)
          }
          if (newState.score !== prevState.score) {
            onScoreChange?.(newState.score)
          }
          return newState
        })
      }, speed)
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
  }, [state.status, state.level, onScoreChange, onGameOver])

  // 绘制画面
  useEffect(() => {
    draw()
    drawNextPiece()
  }, [draw, drawNextPiece])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止方向键滚动页面
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setState(prev => movePiece(prev, -1, 0))
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          setState(prev => movePiece(prev, 1, 0))
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          setState(prev => movePiece(prev, 0, 1))
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
          setState(prev => rotatePiece(prev))
          break
        case ' ':
          setState(prev => hardDrop(prev))
          break
        case 'p':
        case 'P':
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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧱</span>
          俄罗斯方块
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            最高分: {state.highScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
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
                className="border-2 border-border rounded-lg"
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

          {/* 侧边信息面板 */}
          <div className="flex flex-row md:flex-col gap-4 justify-center">
            {/* 下一个方块 */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">下一个</p>
              <canvas
                ref={nextPieceRef}
                width={100}
                height={100}
                className="border-2 border-border rounded-lg"
              />
            </div>

            {/* 游戏信息 */}
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">分数</p>
                <p className="text-2xl font-bold">{state.score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">等级</p>
                <p className="text-2xl font-bold">{state.level}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">行数</p>
                <p className="text-2xl font-bold">{state.lines}</p>
              </div>
            </div>
          </div>
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
        <div className="flex flex-col items-center gap-2 md:hidden">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setState(prev => rotatePiece(prev))}
              disabled={state.status !== 'PLAYING'}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setState(prev => hardDrop(prev))}
              disabled={state.status !== 'PLAYING'}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setState(prev => movePiece(prev, -1, 0))}
              disabled={state.status !== 'PLAYING'}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setState(prev => movePiece(prev, 0, 1))}
              disabled={state.status !== 'PLAYING'}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setState(prev => movePiece(prev, 1, 0))}
              disabled={state.status !== 'PLAYING'}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>操作: ←→ 移动 | ↑ 旋转 | ↓ 加速 | 空格 硬降 | P 暂停 | R 重置</p>
        </div>
      </CardContent>
    </Card>
  )
}
