/**
 * 扫雷游戏逻辑
 */

export type GameStatus = 'IDLE' | 'PLAYING' | 'WON' | 'GAME_OVER'
export type CellState = 'CLOSED' | 'OPEN' | 'FLAGGED' | 'QUESTION'

export interface Cell {
  isMine: boolean
  neighborMines: number
  state: CellState
  row: number
  col: number
}

export type Board = Cell[][]

export interface MinesweeperState {
  board: Board
  status: GameStatus
  rows: number
  cols: number
  mineCount: number
  flagCount: number
  time: number
  firstClick: boolean
  bestTime: number
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface GameConfig {
  rows: number
  cols: number
  mineCount: number
}

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  EASY: { rows: 9, cols: 9, mineCount: 10 },
  MEDIUM: { rows: 16, cols: 16, mineCount: 40 },
  HARD: { rows: 16, cols: 30, mineCount: 99 },
}

/**
 * 创建空游戏板
 */
export function createBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      isMine: false,
      neighborMines: 0,
      state: 'CLOSED' as CellState,
      row,
      col,
    }))
  )
}

/**
 * 随机放置地雷（避免第一次点击位置）
 */
export function placeMines(
  board: Board,
  mineCount: number,
  safeRow: number,
  safeCol: number
): Board {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })))
  const rows = newBoard.length
  const cols = newBoard[0].length
  let placed = 0

  while (placed < mineCount) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    // 避免在第一次点击位置及其周围放置地雷
    const isSafeArea =
      Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1

    if (!newBoard[row][col].isMine && !isSafeArea) {
      newBoard[row][col].isMine = true
      placed++
    }
  }

  // 计算每个格子的周围地雷数
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].neighborMines = countNeighborMines(newBoard, row, col)
      }
    }
  }

  return newBoard
}

/**
 * 计算周围地雷数量
 */
export function countNeighborMines(board: Board, row: number, col: number): number {
  const rows = board.length
  const cols = board[0].length
  let count = 0

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const newRow = row + dr
      const newCol = col + dc
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        board[newRow][newCol].isMine
      ) {
        count++
      }
    }
  }

  return count
}

/**
 * 初始化游戏
 */
export function initializeGame(difficulty: Difficulty = 'EASY'): MinesweeperState {
  const config = DIFFICULTY_CONFIG[difficulty]
  return {
    board: createBoard(config.rows, config.cols),
    status: 'IDLE',
    rows: config.rows,
    cols: config.cols,
    mineCount: config.mineCount,
    flagCount: 0,
    time: 0,
    firstClick: true,
    bestTime: parseInt(localStorage.getItem(`minesweeperBestTime_${difficulty}`) || '0'),
  }
}

/**
 * 揭开格子
 */
export function revealCell(
  state: MinesweeperState,
  row: number,
  col: number
): MinesweeperState {
  if (state.status === 'WON' || state.status === 'GAME_OVER') {
    return state
  }

  const cell = state.board[row][col]
  if (cell.state !== 'CLOSED' && cell.state !== 'QUESTION') {
    return state
  }

  let newBoard = state.board.map(r => r.map(c => ({ ...c })))
  let newStatus: GameStatus = state.status
  let newFirstClick = state.firstClick

  // 第一次点击时放置地雷
  if (state.firstClick) {
    newBoard = placeMines(newBoard, state.mineCount, row, col)
    newFirstClick = false
    newStatus = 'PLAYING'
  }

  // 揭开当前格子
  newBoard = revealCellRecursive(newBoard, row, col)

  // 检查是否踩到地雷
  if (newBoard[row][col].isMine) {
    newStatus = 'GAME_OVER'
    // 显示所有地雷
    newBoard = revealAllMines(newBoard)
  } else {
    // 检查是否获胜
    if (checkWin(newBoard)) {
      newStatus = 'WON'
      const newBestTime = state.bestTime === 0 || state.time < state.bestTime ? state.time : state.bestTime
      localStorage.setItem(`minesweeperBestTime_${getDifficultyFromState(state)}`, newBestTime.toString())
    }
  }

  return {
    ...state,
    board: newBoard,
    status: newStatus,
    firstClick: newFirstClick,
    bestTime: newStatus === 'WON' ? Math.min(state.bestTime || Infinity, state.time) : state.bestTime,
  }
}

/**
 * 递归揭开格子（包括空白区域）
 */
export function revealCellRecursive(board: Board, row: number, col: number): Board {
  const newBoard = board.map(r => r.map(c => ({ ...c })))
  const cell = newBoard[row][col]

  if (cell.state !== 'CLOSED' && cell.state !== 'QUESTION') {
    return newBoard
  }

  cell.state = 'OPEN'

  // 如果周围没有地雷，递归揭开周围格子
  if (cell.neighborMines === 0 && !cell.isMine) {
    const rows = newBoard.length
    const cols = newBoard[0].length

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const newRow = row + dr
        const newCol = col + dc
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          (newBoard[newRow][newCol].state === 'CLOSED' ||
            newBoard[newRow][newCol].state === 'QUESTION')
        ) {
          return revealCellRecursive(newBoard, newRow, newCol)
        }
      }
    }
  }

  return newBoard
}

/**
 * 揭示所有地雷
 */
export function revealAllMines(board: Board): Board {
  return board.map(row =>
    row.map(cell =>
      cell.isMine ? { ...cell, state: 'OPEN' as CellState } : cell
    )
  )
}

/**
 * 标记/取消标记格子
 */
export function toggleFlag(state: MinesweeperState, row: number, col: number): MinesweeperState {
  if (state.status === 'WON' || state.status === 'GAME_OVER') {
    return state
  }

  const cell = state.board[row][col]
  if (cell.state === 'OPEN') {
    return state
  }

  const newBoard = state.board.map(r => r.map(c => ({ ...c })))
  let newFlagCount = state.flagCount

  if (cell.state === 'CLOSED') {
    newBoard[row][col].state = 'FLAGGED'
    newFlagCount++
  } else if (cell.state === 'FLAGGED') {
    newBoard[row][col].state = 'QUESTION'
    newFlagCount--
  } else if (cell.state === 'QUESTION') {
    newBoard[row][col].state = 'CLOSED'
  }

  return {
    ...state,
    board: newBoard,
    flagCount: newFlagCount,
  }
}

/**
 * 快速揭开（双击格子时）
 */
export function quickReveal(state: MinesweeperState, row: number, col: number): MinesweeperState {
  const cell = state.board[row][col]
  if (cell.state !== 'OPEN' || cell.neighborMines === 0) {
    return state
  }

  const rows = state.board.length
  const cols = state.board[0].length
  let flagCount = 0

  // 计算周围标记数量
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const newRow = row + dr
      const newCol = col + dc
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        state.board[newRow][newCol].state === 'FLAGGED'
      ) {
        flagCount++
      }
    }
  }

  // 如果标记数量等于周围地雷数，揭开周围未标记格子
  if (flagCount === cell.neighborMines) {
    let newState = { ...state }
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const newRow = row + dr
        const newCol = col + dc
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          state.board[newRow][newCol].state !== 'FLAGGED'
        ) {
          newState = revealCell(newState, newRow, newCol)
        }
      }
    }
    return newState
  }

  return state
}

/**
 * 检查是否获胜
 */
export function checkWin(board: Board): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && cell.state !== 'OPEN') {
        return false
      }
    }
  }
  return true
}

/**
 * 更新游戏时间
 */
export function updateTime(state: MinesweeperState): MinesweeperState {
  if (state.status !== 'PLAYING') {
    return state
  }
  return {
    ...state,
    time: state.time + 1,
  }
}

/**
 * 重新开始游戏
 */
export function restartGame(state: MinesweeperState): MinesweeperState {
  return initializeGame(getDifficultyFromState(state))
}

/**
 * 切换难度
 */
export function changeDifficulty(_state: MinesweeperState, difficulty: Difficulty): MinesweeperState {
  return initializeGame(difficulty)
}

/**
 * 从状态获取难度
 */
function getDifficultyFromState(state: MinesweeperState): Difficulty {
  for (const [key, config] of Object.entries(DIFFICULTY_CONFIG)) {
    if (
      config.rows === state.rows &&
      config.cols === state.cols &&
      config.mineCount === state.mineCount
    ) {
      return key as Difficulty
    }
  }
  return 'EASY'
}
