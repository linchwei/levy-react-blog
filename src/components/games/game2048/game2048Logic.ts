/**
 * 2048 游戏逻辑
 */

export type GameStatus = 'IDLE' | 'PLAYING' | 'WON' | 'GAME_OVER'
export type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export type Cell2048 = number | null
export type Board2048 = Cell2048[][]

export interface Game2048State {
  board: Board2048
  score: number
  bestScore: number
  status: GameStatus
  hasWon: boolean
}

export interface Game2048Config {
  boardSize: number
  winValue: number
}

// 游戏配置
export const defaultConfig: Game2048Config = {
  boardSize: 4,
  winValue: 2048,
}

// 单元格颜色映射
export const CELL_COLORS: Record<number, string> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
  4096: '#3c3a32',
  8192: '#3c3a32',
}

// 单元格文字颜色
export const CELL_TEXT_COLORS: Record<number, string> = {
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2',
  4096: '#f9f6f2',
  8192: '#f9f6f2',
}

/**
 * 初始化游戏板
 */
export function createBoard(size: number = defaultConfig.boardSize): Board2048 {
  return Array(size).fill(null).map(() => Array(size).fill(null))
}

/**
 * 初始化游戏状态
 */
export function initializeGame(config: Game2048Config = defaultConfig): Game2048State {
  let board = createBoard(config.boardSize)
  board = addRandomTile(board)
  board = addRandomTile(board)

  return {
    board,
    score: 0,
    bestScore: parseInt(localStorage.getItem('game2048BestScore') || '0'),
    status: 'IDLE',
    hasWon: false,
  }
}

/**
 * 获取空单元格位置
 */
export function getEmptyCells(board: Board2048): { x: number; y: number }[] {
  const empty: { x: number; y: number }[] = []
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === null) {
        empty.push({ x, y })
      }
    })
  })
  return empty
}

/**
 * 添加随机数字块
 */
export function addRandomTile(board: Board2048): Board2048 {
  const emptyCells = getEmptyCells(board)
  if (emptyCells.length === 0) return board

  const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  const newBoard = board.map(row => [...row])
  // 90% 概率生成 2，10% 概率生成 4
  newBoard[y][x] = Math.random() < 0.9 ? 2 : 4
  return newBoard
}

/**
 * 滑动并合并一行（向左）
 */
export function slideRowLeft(row: Cell2048[]): { row: Cell2048[]; score: number } {
  // 过滤掉空单元格
  let filtered = row.filter(cell => cell !== null) as number[]
  let score = 0

  // 合并相邻相同数字
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2
      score += filtered[i]
      filtered[i + 1] = 0
    }
  }

  // 再次过滤掉合并产生的 0
  filtered = filtered.filter(cell => cell !== 0)

  // 补齐空位
  while (filtered.length < row.length) {
    filtered.push(null)
  }

  return { row: filtered, score }
}

/**
 * 滑动并合并一行（向右）
 */
export function slideRowRight(row: Cell2048[]): { row: Cell2048[]; score: number } {
  const reversed = [...row].reverse()
  const { row: slid, score } = slideRowLeft(reversed)
  return { row: slid.reverse(), score }
}

/**
 * 获取列
 */
export function getColumn(board: Board2048, x: number): Cell2048[] {
  return board.map(row => row[x])
}

/**
 * 设置列
 */
export function setColumn(board: Board2048, x: number, column: Cell2048[]): Board2048 {
  return board.map((row, y) => {
    const newRow = [...row]
    newRow[x] = column[y]
    return newRow
  })
}

/**
 * 移动板子
 */
export function moveBoard(
  board: Board2048,
  direction: MoveDirection
): { newBoard: Board2048; score: number; moved: boolean } {
  let newBoard = createBoard(board.length)
  let totalScore = 0
  let moved = false

  if (direction === 'LEFT') {
    for (let y = 0; y < board.length; y++) {
      const { row, score } = slideRowLeft(board[y])
      newBoard[y] = row
      totalScore += score
      if (JSON.stringify(row) !== JSON.stringify(board[y])) {
        moved = true
      }
    }
  } else if (direction === 'RIGHT') {
    for (let y = 0; y < board.length; y++) {
      const { row, score } = slideRowRight(board[y])
      newBoard[y] = row
      totalScore += score
      if (JSON.stringify(row) !== JSON.stringify(board[y])) {
        moved = true
      }
    }
  } else if (direction === 'UP') {
    for (let x = 0; x < board[0].length; x++) {
      const column = getColumn(board, x)
      const { row: slidColumn, score } = slideRowLeft(column)
      newBoard = setColumn(newBoard, x, slidColumn)
      totalScore += score
      if (JSON.stringify(slidColumn) !== JSON.stringify(column)) {
        moved = true
      }
    }
  } else if (direction === 'DOWN') {
    for (let x = 0; x < board[0].length; x++) {
      const column = getColumn(board, x)
      const { row: slidColumn, score } = slideRowRight(column)
      newBoard = setColumn(newBoard, x, slidColumn)
      totalScore += score
      if (JSON.stringify(slidColumn) !== JSON.stringify(column)) {
        moved = true
      }
    }
  }

  return { newBoard, score: totalScore, moved }
}

/**
 * 检查是否还有有效移动
 */
export function hasValidMoves(board: Board2048): boolean {
  // 检查是否有空单元格
  if (getEmptyCells(board).length > 0) return true

  // 检查是否有相邻相同数字
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const current = board[y][x]
      if (current === null) continue

      // 检查右边
      if (x < board[y].length - 1 && board[y][x + 1] === current) return true
      // 检查下边
      if (y < board.length - 1 && board[y + 1][x] === current) return true
    }
  }

  return false
}

/**
 * 检查是否获胜
 */
export function checkWin(board: Board2048, winValue: number = defaultConfig.winValue): boolean {
  return board.some(row => row.some(cell => cell === winValue))
}

/**
 * 执行移动
 */
export function makeMove(
  state: Game2048State,
  direction: MoveDirection,
  config: Game2048Config = defaultConfig
): Game2048State {
  if (state.status !== 'PLAYING' && state.status !== 'IDLE') {
    return state
  }

  const { newBoard, score, moved } = moveBoard(state.board, direction)

  if (!moved) {
    return state
  }

  // 添加新数字块
  const boardWithNewTile = addRandomTile(newBoard)
  const newScore = state.score + score
  const newBestScore = Math.max(newScore, state.bestScore)

  // 检查是否获胜（如果还没赢过）
  const hasWon = !state.hasWon && checkWin(boardWithNewTile, config.winValue)
  if (hasWon) {
    localStorage.setItem('game2048BestScore', newBestScore.toString())
    return {
      ...state,
      board: boardWithNewTile,
      score: newScore,
      bestScore: newBestScore,
      status: 'WON',
      hasWon: true,
    }
  }

  // 检查是否游戏结束
  if (!hasValidMoves(boardWithNewTile)) {
    localStorage.setItem('game2048BestScore', newBestScore.toString())
    return {
      ...state,
      board: boardWithNewTile,
      score: newScore,
      bestScore: newBestScore,
      status: 'GAME_OVER',
    }
  }

  return {
    ...state,
    board: boardWithNewTile,
    score: newScore,
    bestScore: newBestScore,
    status: 'PLAYING',
  }
}

/**
 * 开始游戏
 */
export function startGame(state: Game2048State): Game2048State {
  if (state.status === 'PLAYING') {
    return state
  }

  if (state.status === 'GAME_OVER' || state.status === 'WON') {
    return {
      ...initializeGame(),
      status: 'PLAYING',
      bestScore: state.bestScore,
    }
  }

  return {
    ...state,
    status: 'PLAYING',
  }
}

/**
 * 重置游戏
 */
export function resetGame(state: Game2048State): Game2048State {
  return {
    ...initializeGame(),
    bestScore: state.bestScore,
  }
}

/**
 * 继续游戏（获胜后）
 */
export function continueGame(state: Game2048State): Game2048State {
  if (state.status !== 'WON') {
    return state
  }

  return {
    ...state,
    status: 'PLAYING',
  }
}
