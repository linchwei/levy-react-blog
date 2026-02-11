/**
 * 数字华容道游戏逻辑
 */

export type GameStatus = 'IDLE' | 'PLAYING' | 'SOLVED'

export interface KlotskiState {
  board: number[][]
  size: number
  moves: number
  time: number
  status: GameStatus
  bestTime: number
  bestMoves: number
}

/**
 * 创建初始有序板
 */
export function createBoard(size: number): number[][] {
  const board: number[][] = []
  let num = 1
  for (let row = 0; row < size; row++) {
    board[row] = []
    for (let col = 0; col < size; col++) {
      board[row][col] = num
      num++
    }
  }
  // 最后一个位置是0（空格）
  board[size - 1][size - 1] = 0
  return board
}

/**
 * 初始化游戏
 */
export function initializeGame(size: number = 4): KlotskiState {
  const board = createBoard(size)
  const shuffledBoard = shuffleBoard(board, size)

  return {
    board: shuffledBoard,
    size,
    moves: 0,
    time: 0,
    status: 'IDLE',
    bestTime: parseInt(localStorage.getItem(`klotskiBestTime_${size}`) || '0'),
    bestMoves: parseInt(localStorage.getItem(`klotskiBestMoves_${size}`) || '0'),
  }
}

/**
 * 打乱板子（通过随机移动确保可解）
 */
export function shuffleBoard(board: number[][], size: number): number[][] {
  const newBoard = board.map(row => [...row])
  let moves = 0
  const totalShuffleMoves = size * 25 // 足够多的移动次数

  while (moves < totalShuffleMoves) {
    const emptyPos = findEmptyPosition(newBoard, size)
    const neighbors = getNeighbors(emptyPos.row, emptyPos.col, size)
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]

    // 交换空格和邻居
    newBoard[emptyPos.row][emptyPos.col] = newBoard[randomNeighbor.row][randomNeighbor.col]
    newBoard[randomNeighbor.row][randomNeighbor.col] = 0
    moves++
  }

  return newBoard
}

/**
 * 找到空格位置
 */
export function findEmptyPosition(board: number[][], size: number): { row: number; col: number } {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        return { row, col }
      }
    }
  }
  return { row: size - 1, col: size - 1 }
}

/**
 * 获取相邻位置
 */
export function getNeighbors(row: number, col: number, size: number): { row: number; col: number }[] {
  const neighbors: { row: number; col: number }[] = []
  const directions = [
    [-1, 0], // 上
    [1, 0],  // 下
    [0, -1], // 左
    [0, 1],  // 右
  ]

  for (const [dr, dc] of directions) {
    const newRow = row + dr
    const newCol = col + dc
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      neighbors.push({ row: newRow, col: newCol })
    }
  }

  return neighbors
}

/**
 * 检查是否可以移动
 */
export function canMove(board: number[][], size: number, row: number, col: number): boolean {
  const emptyPos = findEmptyPosition(board, size)
  const rowDiff = Math.abs(row - emptyPos.row)
  const colDiff = Math.abs(col - emptyPos.col)
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
}

/**
 * 移动数字
 */
export function moveNumber(state: KlotskiState, row: number, col: number): KlotskiState {
  if (state.status !== 'PLAYING' && state.status !== 'IDLE') {
    return state
  }

  if (!canMove(state.board, state.size, row, col)) {
    return state
  }

  const newBoard = state.board.map(r => [...r])
  const emptyPos = findEmptyPosition(newBoard, state.size)

  // 交换点击的数字和空格
  newBoard[emptyPos.row][emptyPos.col] = newBoard[row][col]
  newBoard[row][col] = 0

  const newMoves = state.moves + 1
  const isSolved = checkSolved(newBoard, state.size)

  let newBestTime = state.bestTime
  let newBestMoves = state.bestMoves

  if (isSolved) {
    if (state.bestTime === 0 || state.time < state.bestTime) {
      newBestTime = state.time
      localStorage.setItem(`klotskiBestTime_${state.size}`, newBestTime.toString())
    }
    if (state.bestMoves === 0 || newMoves < state.bestMoves) {
      newBestMoves = newMoves
      localStorage.setItem(`klotskiBestMoves_${state.size}`, newBestMoves.toString())
    }
  }

  return {
    ...state,
    board: newBoard,
    moves: newMoves,
    status: isSolved ? 'SOLVED' : 'PLAYING',
    bestTime: newBestTime,
    bestMoves: newBestMoves,
  }
}

/**
 * 检查是否完成
 */
export function checkSolved(board: number[][], size: number): boolean {
  let expectedNum = 1
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (row === size - 1 && col === size - 1) {
        return board[row][col] === 0
      }
      if (board[row][col] !== expectedNum) {
        return false
      }
      expectedNum++
    }
  }
  return true
}

/**
 * 重新开始游戏
 */
export function restartGame(state: KlotskiState): KlotskiState {
  return initializeGame(state.size)
}

/**
 * 改变难度
 */
export function changeDifficulty(size: number): KlotskiState {
  return initializeGame(size)
}

/**
 * 更新时间
 */
export function updateTime(state: KlotskiState, time: number): KlotskiState {
  if (state.status !== 'PLAYING') return state
  return { ...state, time }
}

/**
 * 获取提示（下一步移动）
 */
export function getHint(board: number[][], size: number): { row: number; col: number } | null {
  // 简单的启发式：找到应该移动的数字
  // 这里可以实现更复杂的算法如 A* 搜索
  const emptyPos = findEmptyPosition(board, size)
  const neighbors = getNeighbors(emptyPos.row, emptyPos.col, size)

  // 优先移动距离正确位置最近的数字
  let bestMove: { row: number; col: number } | null = null
  let minDistance = Infinity

  for (const neighbor of neighbors) {
    const num = board[neighbor.row][neighbor.col]
    if (num === 0) continue

    const targetRow = Math.floor((num - 1) / size)
    const targetCol = (num - 1) % size
    const distance = Math.abs(neighbor.row - targetRow) + Math.abs(neighbor.col - targetCol)

    if (distance < minDistance) {
      minDistance = distance
      bestMove = neighbor
    }
  }

  return bestMove
}

/**
 * 计算逆序数（用于判断是否有解）
 */
export function countInversions(board: number[][], size: number): number {
  const flat: number[] = []
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] !== 0) {
        flat.push(board[row][col])
      }
    }
  }

  let inversions = 0
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) {
        inversions++
      }
    }
  }

  return inversions
}

/**
 * 检查板子是否有解
 */
export function isSolvable(board: number[][], size: number): boolean {
  const inversions = countInversions(board, size)

  if (size % 2 === 1) {
    // 奇数大小：逆序数为偶数则有解
    return inversions % 2 === 0
  } else {
    // 偶数大小：需要考虑空格所在行
    const emptyPos = findEmptyPosition(board, size)
    const emptyRowFromBottom = size - emptyPos.row
    return (inversions + emptyRowFromBottom) % 2 === 1
  }
}
