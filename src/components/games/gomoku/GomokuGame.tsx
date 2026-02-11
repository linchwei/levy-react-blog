import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Undo2, User, Bot, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  makeMove,
  undoMove,
  restartGame,
  changeMode,
  changeDifficulty,
  getAIMove,
  BOARD_SIZE,
  type GomokuState,
  type GameMode,
  type AIDifficulty,
  type Player,
} from './gomokuLogic'

interface GomokuGameProps {
  onWin?: (winner: Player) => void
}

export function GomokuGame({ onWin }: GomokuGameProps) {
  const [state, setState] = useState<GomokuState>(() => initializeGame())
  const [isAIThinking, setIsAIThinking] = useState(false)

  // AI 落子
  useEffect(() => {
    if (state.mode === 'PVE' && state.currentPlayer === 'WHITE' && state.status === 'PLAYING') {
      setIsAIThinking(true)
      const timer = setTimeout(() => {
        const aiMove = getAIMove(state)
        if (aiMove) {
          setState(prev => makeMove(prev, aiMove.row, aiMove.col))
        }
        setIsAIThinking(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [state.currentPlayer, state.status, state.mode])

  // 处理获胜
  useEffect(() => {
    if (state.status === 'BLACK_WIN' || state.status === 'WHITE_WIN') {
      onWin?.(state.winner)
    }
  }, [state.status, state.winner, onWin])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isAIThinking) return
    if (state.mode === 'PVE' && state.currentPlayer === 'WHITE') return

    setState(prev => makeMove(prev, row, col))
  }, [isAIThinking, state.mode, state.currentPlayer])

  const handleUndo = () => {
    // 人机模式下悔棋两次（撤销AI和玩家的 move）
    if (state.mode === 'PVE' && state.moveHistory.length >= 2) {
      setState(prev => undoMove(undoMove(prev)))
    } else {
      setState(prev => undoMove(prev))
    }
  }

  const handleRestart = () => {
    setState(prev => restartGame(prev))
  }

  const handleModeChange = (mode: GameMode) => {
    setState(prev => changeMode(prev, mode))
  }

  const handleDifficultyChange = (difficulty: AIDifficulty) => {
    setState(prev => changeDifficulty(prev, difficulty))
  }

  const getCellContent = (player: Player) => {
    if (player === 'BLACK') {
      return <div className="w-6 h-6 rounded-full bg-black border-2 border-gray-600" />
    }
    if (player === 'WHITE') {
      return <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
    }
    return null
  }

  const getStatusText = () => {
    switch (state.status) {
      case 'BLACK_WIN':
        return '⚫ 黑方获胜！'
      case 'WHITE_WIN':
        return '⚪ 白方获胜！'
      case 'DRAW':
        return '🤝 平局！'
      default:
        return state.currentPlayer === 'BLACK' ? '⚫ 黑方回合' : '⚪ 白方回合'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">⚫⚪</span>
          五子棋
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {state.blackScore}:{state.whiteScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 游戏信息 */}
        <div className="flex justify-center items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">状态</p>
            <p className={`text-lg font-bold ${
              state.status === 'BLACK_WIN' ? 'text-black dark:text-white' :
              state.status === 'WHITE_WIN' ? 'text-gray-500' :
              state.currentPlayer === 'BLACK' ? 'text-black dark:text-white' : 'text-gray-500'
            }`}>
              {getStatusText()}
            </p>
          </div>
          {isAIThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              AI思考中...
            </motion.div>
          )}
        </div>

        {/* 模式选择 */}
        <div className="flex justify-center gap-2">
          <Button
            variant={state.mode === 'PVP' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('PVP')}
            disabled={state.status === 'PLAYING'}
          >
            <User className="w-4 h-4 mr-1" />
            人人对战
          </Button>
          <Button
            variant={state.mode === 'PVE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('PVE')}
            disabled={state.status === 'PLAYING'}
          >
            <Bot className="w-4 h-4 mr-1" />
            人机对战
          </Button>
        </div>

        {/* AI难度选择 */}
        {state.mode === 'PVE' && (
          <div className="flex justify-center gap-2">
            {(['EASY', 'MEDIUM', 'HARD'] as AIDifficulty[]).map((diff) => (
              <Button
                key={diff}
                variant={state.difficulty === diff ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDifficultyChange(diff)}
                disabled={state.status === 'PLAYING'}
              >
                {diff === 'EASY' ? '简单' : diff === 'MEDIUM' ? '中等' : '困难'}
              </Button>
            ))}
          </div>
        )}

        {/* 游戏板 */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-block p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg"
          >
            <div
              className="grid gap-0.5"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {state.board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={cell ? { scale: 0 } : false}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center
                      bg-amber-200 dark:bg-amber-800/50
                      cursor-pointer hover:bg-amber-300 dark:hover:bg-amber-700/50
                      transition-colors relative
                    `}
                  >
                    {getCellContent(cell)}
                    {state.lastMove?.row === rowIndex && state.lastMove?.col === colIndex && (
                      <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 border-2 border-red-500 rounded-sm"
                      />
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={handleUndo}
            disabled={state.moveHistory.length === 0 || state.status === 'BLACK_WIN' || state.status === 'WHITE_WIN'}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            悔棋
          </Button>
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            新游戏
          </Button>
        </div>

        {/* 游戏结果 */}
        <AnimatePresence>
          {(state.status === 'BLACK_WIN' || state.status === 'WHITE_WIN' || state.status === 'DRAW') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center p-4 bg-muted rounded-lg"
            >
              <p className="text-lg font-bold">
                {state.status === 'BLACK_WIN' && '🎉 黑方获胜！'}
                {state.status === 'WHITE_WIN' && '🎉 白方获胜！'}
                {state.status === 'DRAW' && '🤝 平局！'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                总比分: ⚫ {state.blackScore} : {state.whiteScore} ⚪
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>{state.mode === 'PVE' ? '你是黑方，AI是白方' : '黑方先手，轮流落子'}</p>
          <p className="mt-1">五子连珠即可获胜</p>
        </div>
      </CardContent>
    </Card>
  )
}
