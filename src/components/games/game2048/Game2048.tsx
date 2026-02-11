import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Trophy, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  makeMove,
  startGame,
  resetGame,
  continueGame,
  CELL_COLORS,
  CELL_TEXT_COLORS,
  type Game2048State,
  type MoveDirection,
} from './game2048Logic'

interface Game2048Props {
  onScoreChange?: (score: number) => void
  onGameOver?: (score: number) => void
  onWin?: (score: number) => void
}

export function Game2048({ onScoreChange, onGameOver, onWin }: Game2048Props) {
  const [state, setState] = useState<Game2048State>(() => initializeGame())

  // 处理移动
  const handleMove = useCallback((direction: MoveDirection) => {
    setState(prevState => {
      const newState = makeMove(prevState, direction)
      if (newState.score !== prevState.score) {
        onScoreChange?.(newState.score)
      }
      if (newState.status === 'GAME_OVER' && prevState.status !== 'GAME_OVER') {
        onGameOver?.(newState.score)
      }
      if (newState.status === 'WON' && prevState.status !== 'WON') {
        onWin?.(newState.score)
      }
      return newState
    })
  }, [onScoreChange, onGameOver, onWin])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止方向键滚动页面
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove('UP')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove('DOWN')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove('LEFT')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove('RIGHT')
          break
        case 'r':
        case 'R':
          setState(prev => resetGame(prev))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleMove])

  const handleStart = () => {
    setState(prev => startGame(prev))
  }

  const handleReset = () => {
    setState(prev => resetGame(prev))
  }

  const handleContinue = () => {
    setState(prev => continueGame(prev))
  }

  // 获取单元格样式
  const getCellStyle = (value: number | null) => {
    if (value === null) {
      return {
        backgroundColor: 'rgba(238, 228, 218, 0.35)',
        color: 'transparent',
      }
    }
    return {
      backgroundColor: CELL_COLORS[value] || '#3c3a32',
      color: CELL_TEXT_COLORS[value] || '#f9f6f2',
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔢</span>
          2048
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            最佳: {state.bestScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 分数显示 */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">当前分数</p>
            <p className="text-3xl font-bold">{state.score}</p>
          </div>
        </div>

        {/* 游戏板 */}
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-[#bbada0] p-2 rounded-lg"
          >
            <div className="grid grid-cols-4 gap-2">
              {state.board.map((row, y) =>
                row.map((cell, x) => (
                  <motion.div
                    key={`${y}-${x}`}
                    initial={cell !== null ? { scale: 0 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold transition-all duration-150"
                    style={getCellStyle(cell)}
                  >
                    {cell !== null && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        {cell}
                      </motion.span>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* 游戏状态覆盖层 */}
            <AnimatePresence>
              {state.status !== 'PLAYING' && state.status !== 'IDLE' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg m-2"
                >
                  {state.status === 'WON' && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="text-4xl mb-2"
                      >
                        🎉
                      </motion.div>
                      <p className="text-2xl font-bold text-yellow-500 mb-2">你赢了！</p>
                      <p className="text-lg mb-4">得分: {state.score}</p>
                      <div className="flex gap-2">
                        <Button onClick={handleContinue} variant="outline">
                          继续挑战
                        </Button>
                        <Button onClick={handleStart}>
                          新游戏
                        </Button>
                      </div>
                    </>
                  )}
                  {state.status === 'GAME_OVER' && (
                    <>
                      <p className="text-2xl font-bold text-destructive mb-2">游戏结束</p>
                      <p className="text-lg mb-4">最终得分: {state.score}</p>
                      <Button onClick={handleStart}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        再来一局
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {state.status === 'IDLE' && (
            <Button onClick={handleStart} size="lg">
              <Play className="w-4 h-4 mr-2" />
              开始游戏
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            新游戏
          </Button>
        </div>

        {/* 虚拟方向键（移动端） */}
        <div className="flex flex-col items-center gap-1 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMove('UP')}
            disabled={state.status !== 'PLAYING'}
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleMove('LEFT')}
              disabled={state.status !== 'PLAYING'}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleMove('DOWN')}
              disabled={state.status !== 'PLAYING'}
            >
              <ChevronDown className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleMove('RIGHT')}
              disabled={state.status !== 'PLAYING'}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>操作: ↑↓←→ 或 WASD 滑动 | R 新游戏</p>
          <p className="mt-1">目标: 合并数字得到 2048</p>
        </div>
      </CardContent>
    </Card>
  )
}
