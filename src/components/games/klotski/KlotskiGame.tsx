import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Lightbulb, Trophy, Clock, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  moveNumber,
  restartGame,
  changeDifficulty,
  updateTime,
  getHint,
  canMove,
  type KlotskiState,
} from './klotskiLogic'

interface KlotskiGameProps {
  onSolve?: (moves: number, time: number) => void
}

export function KlotskiGame({ onSolve }: KlotskiGameProps) {
  const [state, setState] = useState<KlotskiState>(() => initializeGame(4))
  const [hint, setHint] = useState<{ row: number; col: number } | null>(null)

  // 计时器
  useEffect(() => {
    if (state.status !== 'PLAYING') return

    const timer = setInterval(() => {
      setState(prev => updateTime(prev, prev.time + 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [state.status])

  // 处理完成
  useEffect(() => {
    if (state.status === 'SOLVED') {
      onSolve?.(state.moves, state.time)
    }
  }, [state.status, state.moves, state.time, onSolve])

  const handleCellClick = (row: number, col: number) => {
    if (state.status === 'SOLVED') return
    setState(prev => moveNumber(prev, row, col))
    setHint(null)
  }

  const handleRestart = () => {
    setState(prev => restartGame(prev))
    setHint(null)
  }

  const handleDifficultyChange = (size: number) => {
    setState(changeDifficulty(size))
    setHint(null)
  }

  const handleHint = () => {
    const nextMove = getHint(state.board, state.size)
    setHint(nextMove)
    // 3秒后清除提示
    setTimeout(() => setHint(null), 3000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCellStyle = (row: number, col: number) => {
    const num = state.board[row][col]
    const isEmpty = num === 0
    const isHint = hint?.row === row && hint?.col === col
    const canMoveHere = canMove(state.board, state.size, row, col)

    if (isEmpty) {
      return 'bg-muted/50'
    }

    if (isHint) {
      return 'bg-yellow-500 text-white shadow-lg ring-2 ring-yellow-300'
    }

    if (canMoveHere) {
      return 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
    }

    return 'bg-secondary text-secondary-foreground'
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          数字华容道
        </CardTitle>
        <div className="flex items-center gap-2">
          {state.bestMoves > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {state.bestMoves}步
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 游戏信息 */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              时间
            </p>
            <p className="text-xl font-bold font-mono">{formatTime(state.time)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Move className="w-4 h-4" />
              步数
            </p>
            <p className="text-xl font-bold">{state.moves}</p>
          </div>
        </div>

        {/* 难度选择 */}
        <div className="flex justify-center gap-2">
          {[3, 4, 5].map(size => (
            <Button
              key={size}
              variant={state.size === size ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDifficultyChange(size)}
              disabled={state.status === 'PLAYING'}
            >
              {size}x{size}
            </Button>
          ))}
        </div>

        {/* 游戏板 */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-2 bg-muted rounded-lg"
          >
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${state.size}, minmax(0, 1fr))`,
              }}
            >
              {state.board.map((row, rowIndex) =>
                row.map((num, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={num !== 0 ? { scale: 0 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center
                      text-xl sm:text-2xl font-bold rounded-md
                      transition-all duration-200
                      ${getCellStyle(rowIndex, colIndex)}
                      ${num !== 0 ? 'shadow-sm' : ''}
                    `}
                  >
                    {num !== 0 && num}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={handleHint} disabled={state.status === 'SOLVED'}>
            <Lightbulb className="w-4 h-4 mr-2" />
            提示
          </Button>
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重新开始
          </Button>
        </div>

        {/* 游戏结果 */}
        <AnimatePresence>
          {state.status === 'SOLVED' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <p className="text-lg font-bold text-green-600">🎉 恭喜完成！</p>
              <p className="text-sm text-muted-foreground mt-1">
                用时 {formatTime(state.time)}，{state.moves} 步
              </p>
              {(state.bestTime === state.time || state.bestMoves === state.moves) && (
                <p className="text-sm text-yellow-600 mt-1">🏆 新纪录！</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>点击数字移动，将数字按顺序排列</p>
          <p className="mt-1">空格在右下角时完成</p>
        </div>
      </CardContent>
    </Card>
  )
}
