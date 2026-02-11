import { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Clock, Flag, Bomb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  revealCell,
  toggleFlag,
  quickReveal,
  updateTime,
  restartGame,
  changeDifficulty,
  type MinesweeperState,
  type Difficulty,
  DIFFICULTY_CONFIG,
} from './minesweeperLogic'

interface MinesweeperGameProps {
  onWin?: (time: number) => void
  onGameOver?: () => void
}

// 数字颜色映射
const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-500',
  2: 'text-green-500',
  3: 'text-red-500',
  4: 'text-purple-500',
  5: 'text-orange-500',
  6: 'text-cyan-500',
  7: 'text-black dark:text-white',
  8: 'text-gray-500',
}

export function MinesweeperGame({ onWin, onGameOver }: MinesweeperGameProps) {
  const [state, setState] = useState<MinesweeperState>(() => initializeGame('EASY'))
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 游戏计时器
  useEffect(() => {
    if (state.status === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setState(prev => updateTime(prev))
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [state.status])

  // 处理游戏结束
  useEffect(() => {
    if (state.status === 'WON') {
      onWin?.(state.time)
    } else if (state.status === 'GAME_OVER') {
      onGameOver?.()
    }
  }, [state.status, state.time, onWin, onGameOver])

  const handleCellClick = useCallback((row: number, col: number) => {
    setState(prev => revealCell(prev, row, col))
  }, [])

  const handleCellRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    setState(prev => toggleFlag(prev, row, col))
  }, [])

  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    setState(prev => quickReveal(prev, row, col))
  }, [])

  const handleRestart = () => {
    setState(prev => restartGame(prev))
  }

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    setState(changeDifficulty(state, newDifficulty))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCellContent = (cell: typeof state.board[0][0]) => {
    if (cell.state === 'FLAGGED') {
      return <Flag className="w-4 h-4 text-red-500" />
    }
    if (cell.state === 'QUESTION') {
      return <span className="text-sm font-bold text-muted-foreground">?</span>
    }
    if (cell.state === 'OPEN') {
      if (cell.isMine) {
        return <Bomb className="w-4 h-4 text-red-600" />
      }
      if (cell.neighborMines > 0) {
        return (
          <span className={`text-sm font-bold ${NUMBER_COLORS[cell.neighborMines]}`}>
            {cell.neighborMines}
          </span>
        )
      }
    }
    return null
  }

  const getCellStyle = (cell: typeof state.board[0][0]) => {
    if (cell.state === 'OPEN') {
      if (cell.isMine) {
        return 'bg-red-500/20 border-red-500'
      }
      return 'bg-muted/50 border-border'
    }
    return 'bg-background hover:bg-muted/80 border-border cursor-pointer'
  }

  return (
    <Card className="w-full max-w-fit mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">💣</span>
          扫雷
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bomb className="w-3 h-3" />
            {state.mineCount - state.flagCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 游戏信息 */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
              <Clock className="w-3 h-3" />
              时间
            </p>
            <p className="text-2xl font-bold font-mono">{formatTime(state.time)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">状态</p>
            <p className="text-2xl font-bold">
              {state.status === 'WON' ? '😎' : state.status === 'GAME_OVER' ? '😵' : '😊'}
            </p>
          </div>
          {state.bestTime > 0 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">最佳</p>
              <p className="text-2xl font-bold font-mono">{formatTime(state.bestTime)}</p>
            </div>
          )}
        </div>

        {/* 难度选择 */}
        <div className="flex justify-center gap-2">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
            <Button
              key={diff}
              variant={difficulty === diff ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDifficultyChange(diff)}
              disabled={state.status === 'PLAYING'}
            >
              {diff === 'EASY' ? '简单' : diff === 'MEDIUM' ? '中等' : '困难'}
            </Button>
          ))}
        </div>

        {/* 游戏板 */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            <div
              className="grid gap-0.5 p-2 bg-muted rounded-lg"
              style={{
                gridTemplateColumns: `repeat(${state.cols}, minmax(0, 1fr))`,
              }}
            >
              {state.board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={cell.state === 'OPEN' ? { scale: 0.8 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                    className={`
                      w-8 h-8 flex items-center justify-center
                      border rounded-sm text-sm font-bold
                      transition-all duration-150
                      select-none
                      ${getCellStyle(cell)}
                    `}
                  >
                    {getCellContent(cell)}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center">
          <Button onClick={handleRestart} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            新游戏
          </Button>
        </div>

        {/* 游戏结果 */}
        <AnimatePresence>
          {state.status === 'WON' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-4 bg-green-500/10 rounded-lg"
            >
              <p className="text-lg font-bold text-green-500">🎉 恭喜获胜！</p>
              <p className="text-sm text-muted-foreground">
                用时: {formatTime(state.time)}
                {state.bestTime === state.time && ' (新纪录!)'}
              </p>
            </motion.div>
          )}
          {state.status === 'GAME_OVER' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-4 bg-red-500/10 rounded-lg"
            >
              <p className="text-lg font-bold text-red-500">💥 游戏结束</p>
              <p className="text-sm text-muted-foreground">踩到地雷了，再试一次吧！</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>左键揭开 | 右键标记 | 双击快速揭开</p>
        </div>
      </CardContent>
    </Card>
  )
}
