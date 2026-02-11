/**
 * 俄罗斯方块游戏逻辑
 */

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

export interface Position {
  x: number
  y: number
}

export type TetrominoShape = number[][]

export interface Tetromino {
  type: TetrominoType
  shape: TetrominoShape
  x: number
  y: number
  color: string
}

export interface Cell {
  filled: boolean
  color?: string
  type?: TetrominoType
}

export type GameBoard = Cell[][]

export interface TetrisGameState {
  board: GameBoard
  currentPiece: Tetromino
  nextPiece: TetrominoType
  score: number
  level: number
  lines: number
  status: GameStatus
  highScore: number
}

export interface TetrisGameConfig {
  boardWidth: number
  boardHeight: number
  initialSpeed: number
  speedIncrement: number
  minSpeed: number
}

// 游戏配置
export const defaultConfig: TetrisGameConfig = {
  boardWidth: 10,
  boardHeight: 20,
  initialSpeed: 1000,
  speedIncrement: 50,
  minSpeed: 100,
}

// 方块形状定义
export const TETROMINOES: Record<TetrominoType, { shape: TetrominoShape; color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#06b6d4', // cyan
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#eab308', // yellow
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a855f7', // purple
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#22c55e', // green
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#ef4444', // red
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#3b82f6', // blue
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f97316', // orange
  },
}

// 生成随机方块类型
export function randomTetrominoType(): TetrominoType {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
  return types[Math.floor(Math.random() * types.length)]
}

// 创建新方块
export function createTetromino(type: TetrominoType, x?: number, y?: number): Tetromino {
  const tetromino = TETROMINOES[type]
  return {
    type,
    shape: tetromino.shape,
    x: x ?? Math.floor((defaultConfig.boardWidth - tetromino.shape[0].length) / 2),
    y: y ?? 0,
    color: tetromino.color,
  }
}

// 初始化游戏板
export function createBoard(width: number = defaultConfig.boardWidth, height: number = defaultConfig.boardHeight): GameBoard {
  return Array(height).fill(null).map(() =>
    Array(width).fill(null).map(() => ({ filled: false }))
  )
}

// 初始化游戏状态
export function initializeGame(config: TetrisGameConfig = defaultConfig): TetrisGameState {
  const currentType = randomTetrominoType()
  const nextType = randomTetrominoType()

  return {
    board: createBoard(config.boardWidth, config.boardHeight),
    currentPiece: createTetromino(currentType),
    nextPiece: nextType,
    score: 0,
    level: 1,
    lines: 0,
    status: 'IDLE',
    highScore: parseInt(localStorage.getItem('tetrisHighScore') || '0'),
  }
}

// 旋转方块形状
export function rotateShape(shape: TetrominoShape): TetrominoShape {
  const rows = shape.length
  const cols = shape[0].length
  const rotated: TetrominoShape = Array(cols).fill(null).map(() => Array(rows).fill(0))

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[x][rows - 1 - y] = shape[y][x]
    }
  }

  return rotated
}

// 检查方块位置是否有效
export function isValidPosition(
  piece: Tetromino,
  board: GameBoard,
  newX?: number,
  newY?: number,
  newShape?: TetrominoShape
): boolean {
  const x = newX ?? piece.x
  const y = newY ?? piece.y
  const shape = newShape ?? piece.shape

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardX = x + col
        const boardY = y + row

        // 检查边界
        if (boardX < 0 || boardX >= board[0].length || boardY >= board.length) {
          return false
        }

        // 检查碰撞（只检查已经在板子上的）
        if (boardY >= 0 && board[boardY][boardX].filled) {
          return false
        }
      }
    }
  }

  return true
}

// 锁定方块到游戏板
export function lockPiece(piece: Tetromino, board: GameBoard): GameBoard {
  const newBoard = board.map(row => [...row])

  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const boardY = piece.y + row
        const boardX = piece.x + col
        if (boardY >= 0) {
          newBoard[boardY][boardX] = {
            filled: true,
            color: piece.color,
            type: piece.type,
          }
        }
      }
    }
  }

  return newBoard
}

// 清除完整的行
export function clearLines(board: GameBoard): { newBoard: GameBoard; linesCleared: number } {
  const newBoard: GameBoard = []
  let linesCleared = 0

  for (let row = 0; row < board.length; row++) {
    if (board[row].every(cell => cell.filled)) {
      linesCleared++
    } else {
      newBoard.push([...board[row]])
    }
  }

  // 添加新的空行到顶部
  while (newBoard.length < board.length) {
    newBoard.unshift(
      Array(board[0].length).fill(null).map(() => ({ filled: false }))
    )
  }

  return { newBoard, linesCleared }
}

// 计算分数
export function calculateScore(linesCleared: number, level: number): number {
  const lineScores = [0, 100, 300, 600, 1000]
  return (lineScores[linesCleared] || 0) * level
}

// 计算游戏速度
export function calculateSpeed(level: number, config: TetrisGameConfig = defaultConfig): number {
  const speed = config.initialSpeed - (level - 1) * config.speedIncrement
  return Math.max(speed, config.minSpeed)
}

// 移动方块
export function movePiece(
  state: TetrisGameState,
  dx: number,
  dy: number
): TetrisGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  const newX = state.currentPiece.x + dx
  const newY = state.currentPiece.y + dy

  if (isValidPosition(state.currentPiece, state.board, newX, newY)) {
    return {
      ...state,
      currentPiece: { ...state.currentPiece, x: newX, y: newY },
    }
  }

  // 如果向下移动失败，锁定方块
  if (dy > 0) {
    return lockCurrentPiece(state)
  }

  return state
}

// 旋转方块
export function rotatePiece(state: TetrisGameState): TetrisGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  const rotatedShape = rotateShape(state.currentPiece.shape)

  // 尝试旋转
  if (isValidPosition(state.currentPiece, state.board, undefined, undefined, rotatedShape)) {
    return {
      ...state,
      currentPiece: { ...state.currentPiece, shape: rotatedShape },
    }
  }

  // 尝试墙踢（左右移动）
  const kicks = [-1, 1, -2, 2]
  for (const kick of kicks) {
    if (isValidPosition(state.currentPiece, state.board, state.currentPiece.x + kick, undefined, rotatedShape)) {
      return {
        ...state,
        currentPiece: {
          ...state.currentPiece,
          x: state.currentPiece.x + kick,
          shape: rotatedShape,
        },
      }
    }
  }

  return state
}

// 硬降（直接落到底部）
export function hardDrop(state: TetrisGameState): TetrisGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  let newY = state.currentPiece.y
  while (isValidPosition(state.currentPiece, state.board, state.currentPiece.x, newY + 1)) {
    newY++
  }

  return lockCurrentPiece({
    ...state,
    currentPiece: { ...state.currentPiece, y: newY },
  })
}

// 锁定当前方块
export function lockCurrentPiece(state: TetrisGameState): TetrisGameState {
  const newBoard = lockPiece(state.currentPiece, state.board)
  const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

  const newScore = state.score + calculateScore(linesCleared, state.level)
  const newLines = state.lines + linesCleared
  const newLevel = Math.floor(newLines / 10) + 1

  // 创建新方块
  const newPiece = createTetromino(state.nextPiece)
  const nextType = randomTetrominoType()

  // 检查游戏结束
  if (!isValidPosition(newPiece, clearedBoard)) {
    const newHighScore = Math.max(newScore, state.highScore)
    localStorage.setItem('tetrisHighScore', newHighScore.toString())
    return {
      ...state,
      board: clearedBoard,
      score: newScore,
      lines: newLines,
      level: newLevel,
      status: 'GAME_OVER',
      highScore: newHighScore,
    }
  }

  return {
    ...state,
    board: clearedBoard,
    currentPiece: newPiece,
    nextPiece: nextType,
    score: newScore,
    lines: newLines,
    level: newLevel,
  }
}

// 游戏步进（自动下落）
export function gameStep(state: TetrisGameState): TetrisGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  return movePiece(state, 0, 1)
}

// 开始游戏
export function startGame(state: TetrisGameState): TetrisGameState {
  if (state.status === 'PLAYING') {
    return state
  }

  if (state.status === 'GAME_OVER') {
    return {
      ...initializeGame(),
      status: 'PLAYING',
      highScore: state.highScore,
    }
  }

  return {
    ...state,
    status: 'PLAYING',
  }
}

// 暂停游戏
export function pauseGame(state: TetrisGameState): TetrisGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  return {
    ...state,
    status: 'PAUSED',
  }
}

// 继续游戏
export function resumeGame(state: TetrisGameState): TetrisGameState {
  if (state.status !== 'PAUSED') {
    return state
  }

  return {
    ...state,
    status: 'PLAYING',
  }
}

// 重置游戏
export function resetGame(state: TetrisGameState): TetrisGameState {
  return {
    ...initializeGame(),
    highScore: state.highScore,
  }
}

// 切换暂停/继续
export function togglePause(state: TetrisGameState): TetrisGameState {
  if (state.status === 'PLAYING') {
    return pauseGame(state)
  } else if (state.status === 'PAUSED') {
    return resumeGame(state)
  }
  return state
}
