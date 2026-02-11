import { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Trophy, Clock, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  flipCard,
  checkMatch,
  startGame,
  resetGame,
  updateTime,
  type MemoryGameState,
  type MemoryGameConfig,
} from './memoryLogic'

interface MemoryGameProps {
  onScoreChange?: (score: number) => void
  onGameOver?: (score: number) => void
}

export function MemoryGame({ onScoreChange, onGameOver }: MemoryGameProps) {
  const [state, setState] = useState<MemoryGameState>(() => initializeGame())
  const [isChecking, setIsChecking] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 游戏计时器
  useEffect(() => {
    if (state.status === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setState(prev => updateTime(prev, prev.time + 1))
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

  // 处理卡片点击
  const handleCardClick = useCallback((cardId: string) => {
    if (isChecking || state.status !== 'PLAYING') return

    setState(prev => {
      const newState = flipCard(prev, cardId)
      return newState
    })
  }, [isChecking, state.status])

  // 检查匹配
  useEffect(() => {
    if (state.flippedCards.length === 2) {
      setIsChecking(true)
      const timeout = setTimeout(() => {
        setState(prev => {
          const newState = checkMatch(prev)
          if (newState.score !== prev.score) {
            onScoreChange?.(newState.score)
          }
          if (newState.status === 'GAME_OVER' && prev.status !== 'GAME_OVER') {
            onGameOver?.(newState.score)
          }
          return newState
        })
        setIsChecking(false)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [state.flippedCards, onScoreChange, onGameOver])

  const handleStart = () => {
    setState(prev => startGame(prev))
  }

  const handleReset = () => {
    setState(prev => resetGame(prev))
  }

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 获取卡片样式
  const getCardStyle = (status: string) => {
    switch (status) {
      case 'MATCHED':
        return 'bg-green-500/20 border-green-500'
      case 'OPEN':
        return 'bg-purple-500/20 border-purple-500'
      default:
        return 'bg-muted hover:bg-muted/80 border-border'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🃏</span>
          记忆翻牌
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {state.gridSize.rows}x{state.gridSize.cols}
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
            <p className="text-2xl font-bold">{formatTime(state.time)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
              <Move className="w-3 h-3" />
              步数
            </p>
            <p className="text-2xl font-bold">{state.moves}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">进度</p>
            <p className="text-2xl font-bold">{state.matchedPairs}/{state.totalPairs}</p>
          </div>
        </div>

        {/* 游戏板 */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${state.gridSize.cols}, minmax(0, 1fr))`,
              }}
            >
              {state.cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{
                    scale: 1,
                    rotateY: card.status === 'CLOSED' ? 180 : 0,
                  }}
                  transition={{
                    scale: { duration: 0.3, delay: index * 0.05 },
                    rotateY: { duration: 0.3 },
                  }}
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    w-16 h-16 sm:w-20 sm:h-20 rounded-xl cursor-pointer
                    flex items-center justify-center text-3xl sm:text-4xl
                    border-2 transition-all duration-300
                    ${getCardStyle(card.status)}
                    ${card.status === 'CLOSED' ? 'hover:scale-105' : ''}
                    ${card.status === 'MATCHED' ? 'cursor-default' : ''}
                  `}
                  style={{ perspective: '1000px' }}
                >
                  <AnimatePresence mode="wait">
                    {card.status !== 'CLOSED' ? (
                      <motion.span
                        key="front"
                        initial={{ opacity: 0, rotateY: 180 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: -180 }}
                        transition={{ duration: 0.2 }}
                      >
                        {card.value}
                      </motion.span>
                    ) : (
                      <motion.div
                        key="back"
                        className="w-full h-full flex items-center justify-center"
                      >
                        <span className="text-2xl text-muted-foreground">?</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* 游戏状态覆盖层 */}
            <AnimatePresence>
              {state.status === 'IDLE' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg"
                >
                  <p className="text-lg font-medium mb-4">准备好了吗？</p>
                  <Button onClick={handleStart} size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    开始游戏
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {state.status === 'GAME_OVER' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-4xl mb-2"
                  >
                    🎉
                  </motion.div>
                  <p className="text-2xl font-bold text-green-500 mb-2">恭喜完成！</p>
                  <div className="text-center mb-4">
                    <p className="text-lg">用时: {formatTime(state.time)}</p>
                    <p className="text-lg">步数: {state.moves}</p>
                    <p className="text-lg font-bold">得分: {state.score}</p>
                  </div>
                  <Button onClick={handleStart}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    再来一局
                  </Button>
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

        {/* 难度选择 */}
        <div className="flex justify-center gap-2">
          <Button
            variant={state.gridSize.rows === 4 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setState(initializeGame({ rows: 4, cols: 4 }))}
            disabled={state.status === 'PLAYING'}
          >
            简单 (4x4)
          </Button>
          <Button
            variant={state.gridSize.rows === 6 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setState(initializeGame({ rows: 6, cols: 6 }))}
            disabled={state.status === 'PLAYING'}
          >
            中等 (6x6)
          </Button>
          <Button
            variant={state.gridSize.rows === 8 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setState(initializeGame({ rows: 8, cols: 8 }))}
            disabled={state.status === 'PLAYING'}
          >
            困难 (8x8)
          </Button>
        </div>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>点击卡片翻转，找出相同的配对</p>
          <p className="mt-1">尽量用最少的步数完成游戏</p>
        </div>
      </CardContent>
    </Card>
  )
}
