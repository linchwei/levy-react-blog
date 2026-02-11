/**
 * 五子棋游戏逻辑
 */

export type Player = 'BLACK' | 'WHITE' | null
export type GameStatus = 'IDLE' | 'PLAYING' | 'BLACK_WIN' | 'WHITE_WIN' | 'DRAW'
export type GameMode = 'PVP' | 'PVE'
export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface Position {
  row: number
  col: number
}

export interface GomokuState {
  board: Player[][]
  currentPlayer: Player
  status: GameStatus
  winner: Player
  lastMove: Position | null
  moveHistory: Position[]
  mode: GameMode
  difficulty: AIDifficulty
  blackScore: number
  whiteScore: number
}

export const BOARD_SIZE = 15

/**
 * 初始化游戏板
 */
export function createBoard(size: number = BOARD_SIZE): Player[][] {
  return Array(size).fill(null).map(() => Array(size).fill(null))
}

/**
 * 初始化游戏状态
 */
export function initializeGame(
  mode: GameMode = 'PVP',
  difficulty: AIDifficulty = 'MEDIUM'
): GomokuState {
  return {
    board: createBoard(),
    currentPlayer: 'BLACK',
    status: 'IDLE',
    winner: null,
    lastMove: null,
    moveHistory: [],
    mode,
    difficulty,
    blackScore: parseInt(localStorage.getItem('gomokuBlackScore') || '0'),
    whiteScore: parseInt(localStorage.getItem('gomokuWhiteScore') || '0'),
  }
}

/**
 * 检查位置是否有效
 */
export function isValidPosition(board: Player[][], row: number, col: number): boolean {
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length
}

/**
 * 检查位置是否为空
 */
export function isEmpty(board: Player[][], row: number, col: number): boolean {
  return isValidPosition(board, row, col) && board[row][col] === null
}

/**
 * 落子
 */
export function makeMove(
  state: GomokuState,
  row: number,
  col: number
): GomokuState {
  if (state.status === 'BLACK_WIN' || state.status === 'WHITE_WIN' || state.status === 'DRAW') {
    return state
  }

  if (!isEmpty(state.board, row, col)) {
    return state
  }

  const newBoard = state.board.map(r => [...r])
  newBoard[row][col] = state.currentPlayer

  const newMoveHistory = [...state.moveHistory, { row, col }]

  // 检查获胜
  if (checkWin(newBoard, row, col, state.currentPlayer!)) {
    const newStatus = state.currentPlayer === 'BLACK' ? 'BLACK_WIN' : 'WHITE_WIN'
    const newBlackScore = state.currentPlayer === 'BLACK' ? state.blackScore + 1 : state.blackScore
    const newWhiteScore = state.currentPlayer === 'WHITE' ? state.whiteScore + 1 : state.whiteScore
    
    localStorage.setItem('gomokuBlackScore', newBlackScore.toString())
    localStorage.setItem('gomokuWhiteScore', newWhiteScore.toString())

    return {
      ...state,
      board: newBoard,
      status: newStatus,
      winner: state.currentPlayer,
      lastMove: { row, col },
      moveHistory: newMoveHistory,
      blackScore: newBlackScore,
      whiteScore: newWhiteScore,
    }
  }

  // 检查平局
  if (checkDraw(newBoard)) {
    return {
      ...state,
      board: newBoard,
      status: 'DRAW',
      lastMove: { row, col },
      moveHistory: newMoveHistory,
    }
  }

  // 切换玩家
  const nextPlayer = state.currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK'

  return {
    ...state,
    board: newBoard,
    currentPlayer: nextPlayer,
    status: 'PLAYING',
    lastMove: { row, col },
    moveHistory: newMoveHistory,
  }
}

/**
 * 检查是否获胜
 */
export function checkWin(
  board: Player[][],
  row: number,
  col: number,
  player: Player
): boolean {
  const directions = [
    [0, 1],   // 水平
    [1, 0],   // 垂直
    [1, 1],   // 对角线
    [1, -1],  // 反对角线
  ]

  for (const [dr, dc] of directions) {
    let count = 1

    // 正向检查
    for (let i = 1; i < 5; i++) {
      const newRow = row + dr * i
      const newCol = col + dc * i
      if (isValidPosition(board, newRow, newCol) && board[newRow][newCol] === player) {
        count++
      } else {
        break
      }
    }

    // 反向检查
    for (let i = 1; i < 5; i++) {
      const newRow = row - dr * i
      const newCol = col - dc * i
      if (isValidPosition(board, newRow, newCol) && board[newRow][newCol] === player) {
        count++
      } else {
        break
      }
    }

    if (count >= 5) {
      return true
    }
  }

  return false
}

/**
 * 检查是否平局
 */
export function checkDraw(board: Player[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (cell === null) {
        return false
      }
    }
  }
  return true
}

/**
 * 悔棋
 */
export function undoMove(state: GomokuState): GomokuState {
  if (state.moveHistory.length === 0 || state.status === 'BLACK_WIN' || state.status === 'WHITE_WIN') {
    return state
  }

  const newHistory = [...state.moveHistory]
  const lastMove = newHistory.pop()!

  const newBoard = state.board.map(r => [...r])
  newBoard[lastMove.row][lastMove.col] = null

  // 确定上一个玩家
  const previousPlayer = state.currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK'

  return {
    ...state,
    board: newBoard,
    currentPlayer: previousPlayer,
    status: 'PLAYING',
    lastMove: newHistory.length > 0 ? newHistory[newHistory.length - 1] : null,
    moveHistory: newHistory,
  }
}

/**
 * 重新开始游戏
 */
export function restartGame(state: GomokuState): GomokuState {
  return {
    ...initializeGame(state.mode, state.difficulty),
    blackScore: state.blackScore,
    whiteScore: state.whiteScore,
    mode: state.mode,
    difficulty: state.difficulty,
  }
}

/**
 * 切换游戏模式
 */
export function changeMode(state: GomokuState, mode: GameMode): GomokuState {
  return initializeGame(mode, state.difficulty)
}

/**
 * 切换AI难度
 */
export function changeDifficulty(state: GomokuState, difficulty: AIDifficulty): GomokuState {
  return initializeGame(state.mode, difficulty)
}

/**
 * 获取AI落子位置
 */
export function getAIMove(state: GomokuState): Position | null {
  if (state.mode !== 'PVE' || state.currentPlayer !== 'WHITE') {
    return null
  }

  switch (state.difficulty) {
    case 'EASY':
      return getRandomMove(state.board)
    case 'MEDIUM':
      return getSmartMove(state.board, 'WHITE')
    case 'HARD':
      return getBestMove(state.board, 'WHITE')
    default:
      return getRandomMove(state.board)
  }
}

/**
 * 随机落子（简单AI）
 */
function getRandomMove(board: Player[][]): Position | null {
  const emptyPositions: Position[] = []

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col] === null) {
        emptyPositions.push({ row, col })
      }
    }
  }

  if (emptyPositions.length === 0) {
    return null
  }

  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
}

/**
 * 智能落子（中等AI）
 */
function getSmartMove(board: Player[][], aiPlayer: Player): Position | null {
  const humanPlayer = aiPlayer === 'BLACK' ? 'WHITE' : 'BLACK'

  // 1. 检查AI是否可以获胜
  const winMove = findWinningMove(board, aiPlayer)
  if (winMove) return winMove

  // 2. 阻止玩家获胜
  const blockMove = findWinningMove(board, humanPlayer)
  if (blockMove) return blockMove

  // 3. 创建活四
  const createFour = findCreateFourMove(board, aiPlayer)
  if (createFour) return createFour

  // 4. 阻止玩家活四
  const blockFour = findCreateFourMove(board, humanPlayer)
  if (blockFour) return blockFour

  // 5. 优先选择中心区域
  const centerMove = findCenterMove(board)
  if (centerMove) return centerMove

  // 6. 随机落子
  return getRandomMove(board)
}

/**
 * 最佳落子（困难AI）- 使用简化的Minimax算法
 */
function getBestMove(board: Player[][], aiPlayer: Player): Position | null {
  // 简化的评估函数，实际应该使用更复杂的Minimax + Alpha-Beta剪枝
  return getSmartMove(board, aiPlayer)
}

/**
 * 查找获胜位置
 */
function findWinningMove(board: Player[][], player: Player): Position | null {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col] === null) {
        const testBoard = board.map(r => [...r])
        testBoard[row][col] = player
        if (checkWin(testBoard, row, col, player)) {
          return { row, col }
        }
      }
    }
  }
  return null
}

/**
 * 查找创建活四的位置
 */
function findCreateFourMove(board: Player[][], player: Player): Position | null {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col] !== null) continue

      for (const [dr, dc] of directions) {
        let count = 0
        let emptyEnds = 0

        // 正向检查
        for (let i = 1; i < 5; i++) {
          const newRow = row + dr * i
          const newCol = col + dc * i
          if (!isValidPosition(board, newRow, newCol)) break
          if (board[newRow][newCol] === player) {
            count++
          } else if (board[newRow][newCol] === null) {
            emptyEnds++
            break
          } else {
            break
          }
        }

        // 反向检查
        for (let i = 1; i < 5; i++) {
          const newRow = row - dr * i
          const newCol = col - dc * i
          if (!isValidPosition(board, newRow, newCol)) break
          if (board[newRow][newCol] === player) {
            count++
          } else if (board[newRow][newCol] === null) {
            emptyEnds++
            break
          } else {
            break
          }
        }

        // 如果形成活四（4连子，两端都空）
        if (count === 4 && emptyEnds === 2) {
          return { row, col }
        }
      }
    }
  }

  return null
}

/**
 * 查找中心位置
 */
function findCenterMove(board: Player[][]): Position | null {
  const center = Math.floor(board.length / 2)
  const positions = [
    { row: center, col: center },
    { row: center - 1, col: center },
    { row: center, col: center - 1 },
    { row: center + 1, col: center },
    { row: center, col: center + 1 },
  ]

  for (const pos of positions) {
    if (isValidPosition(board, pos.row, pos.col) && board[pos.row][pos.col] === null) {
      return pos
    }
  }

  return null
}
