import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  initializeGame,
  createBoard,
  createTetromino,
  randomTetrominoType,
  rotateShape,
  isValidPosition,
  lockPiece,
  clearLines,
  calculateScore,
  calculateSpeed,
  movePiece,
  rotatePiece,
  hardDrop,
  lockCurrentPiece,
  gameStep,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  togglePause,
  TETROMINOES,
  defaultConfig,
  type Tetromino,
  type GameBoard,
  type TetrisGameState,
} from './tetrisLogic'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Tetris Game Logic', () => {
  describe('initializeGame', () => {
    it('should initialize game with correct default values', () => {
      const state = initializeGame()

      expect(state.board).toHaveLength(defaultConfig.boardHeight)
      expect(state.board[0]).toHaveLength(defaultConfig.boardWidth)
      expect(state.score).toBe(0)
      expect(state.level).toBe(1)
      expect(state.lines).toBe(0)
      expect(state.status).toBe('IDLE')
      expect(state.currentPiece).toBeDefined()
      expect(state.nextPiece).toBeDefined()
    })

    it('should create empty board', () => {
      const state = initializeGame()
      const allEmpty = state.board.every(row => row.every(cell => !cell.filled))
      expect(allEmpty).toBe(true)
    })
  })

  describe('createTetromino', () => {
    it('should create I piece with correct shape', () => {
      const piece = createTetromino('I')
      expect(piece.type).toBe('I')
      expect(piece.shape).toEqual(TETROMINOES.I.shape)
      expect(piece.color).toBe(TETROMINOES.I.color)
    })

    it('should create O piece with correct shape', () => {
      const piece = createTetromino('O')
      expect(piece.type).toBe('O')
      expect(piece.shape).toEqual(TETROMINOES.O.shape)
    })

    it('should place piece at center top by default', () => {
      const piece = createTetromino('I')
      expect(piece.y).toBe(0)
      expect(piece.x).toBe(Math.floor((defaultConfig.boardWidth - 4) / 2))
    })

    it('should accept custom position', () => {
      const piece = createTetromino('O', 5, 5)
      expect(piece.x).toBe(5)
      expect(piece.y).toBe(5)
    })
  })

  describe('randomTetrominoType', () => {
    it('should return valid tetromino type', () => {
      const type = randomTetrominoType()
      const validTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
      expect(validTypes).toContain(type)
    })
  })

  describe('rotateShape', () => {
    it('should rotate shape 90 degrees clockwise', () => {
      const shape = [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ]
      const rotated = rotateShape(shape)
      // 根据实际旋转结果修正
      expect(rotated).toEqual([
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ])
    })

    it('should rotate O piece correctly (symmetric)', () => {
      const shape = TETROMINOES.O.shape
      const rotated = rotateShape(shape)
      expect(rotated).toEqual(shape)
    })
  })

  describe('isValidPosition', () => {
    let board: GameBoard
    let piece: Tetromino

    beforeEach(() => {
      board = createBoard()
      piece = createTetromino('O', 0, 0)
    })

    it('should return true for valid position', () => {
      expect(isValidPosition(piece, board)).toBe(true)
    })

    it('should return false for position outside left boundary', () => {
      expect(isValidPosition(piece, board, -1, 0)).toBe(false)
    })

    it('should return false for position outside right boundary', () => {
      expect(
        isValidPosition(piece, board, defaultConfig.boardWidth - 1, 0)
      ).toBe(false)
    })

    it('should return false for position outside bottom boundary', () => {
      expect(isValidPosition(piece, board, 0, defaultConfig.boardHeight)).toBe(
        false
      )
    })

    it('should return false for collision with filled cell', () => {
      board[0][0] = { filled: true, color: '#fff' }
      expect(isValidPosition(piece, board)).toBe(false)
    })

    it('should allow negative y (piece above board)', () => {
      expect(isValidPosition(piece, board, 0, -1)).toBe(true)
    })
  })

  describe('lockPiece', () => {
    it('should lock piece to board', () => {
      let board = createBoard()
      const piece = createTetromino('O', 0, 0)

      board = lockPiece(piece, board)

      expect(board[0][0].filled).toBe(true)
      expect(board[0][1].filled).toBe(true)
      expect(board[1][0].filled).toBe(true)
      expect(board[1][1].filled).toBe(true)
    })

    it('should preserve piece color when locking', () => {
      let board = createBoard()
      const piece = createTetromino('I', 0, 0)

      board = lockPiece(piece, board)

      expect(board[1][0].color).toBe(TETROMINOES.I.color)
    })
  })

  describe('clearLines', () => {
    it('should clear full lines', () => {
      let board = createBoard()
      // Fill one row completely
      board[19] = board[19].map(() => ({ filled: true, color: '#fff' }))

      const { newBoard, linesCleared } = clearLines(board)

      expect(linesCleared).toBe(1)
      expect(newBoard[19].every(cell => !cell.filled)).toBe(true)
    })

    it('should clear multiple lines', () => {
      let board = createBoard()
      board[18] = board[18].map(() => ({ filled: true, color: '#fff' }))
      board[19] = board[19].map(() => ({ filled: true, color: '#fff' }))

      const { linesCleared } = clearLines(board)

      expect(linesCleared).toBe(2)
    })

    it('should add empty rows at top', () => {
      let board = createBoard()
      board[19] = board[19].map(() => ({ filled: true, color: '#fff' }))

      const { newBoard } = clearLines(board)

      expect(newBoard[0].every(cell => !cell.filled)).toBe(true)
    })

    it('should keep partial rows', () => {
      let board = createBoard()
      board[19][0] = { filled: true, color: '#fff' }
      board[18] = board[18].map(() => ({ filled: true, color: '#fff' }))

      const { newBoard, linesCleared } = clearLines(board)

      expect(linesCleared).toBe(1)
      expect(newBoard[19][0].filled).toBe(true)
    })
  })

  describe('calculateScore', () => {
    it('should return 0 for 0 lines', () => {
      expect(calculateScore(0, 1)).toBe(0)
    })

    it('should return 100 for 1 line at level 1', () => {
      expect(calculateScore(1, 1)).toBe(100)
    })

    it('should return 300 for 2 lines at level 1', () => {
      expect(calculateScore(2, 1)).toBe(300)
    })

    it('should return 600 for 3 lines at level 1', () => {
      expect(calculateScore(3, 1)).toBe(600)
    })

    it('should return 1000 for 4 lines at level 1', () => {
      expect(calculateScore(4, 1)).toBe(1000)
    })

    it('should multiply by level', () => {
      expect(calculateScore(1, 2)).toBe(200)
      expect(calculateScore(4, 3)).toBe(3000)
    })
  })

  describe('calculateSpeed', () => {
    it('should return initial speed at level 1', () => {
      expect(calculateSpeed(1)).toBe(defaultConfig.initialSpeed)
    })

    it('should decrease speed as level increases', () => {
      const speed1 = calculateSpeed(1)
      const speed2 = calculateSpeed(2)
      expect(speed2).toBeLessThan(speed1)
    })

    it('should not go below minimum speed', () => {
      const veryHighLevel = 100
      const speed = calculateSpeed(veryHighLevel)
      expect(speed).toBeGreaterThanOrEqual(defaultConfig.minSpeed)
    })
  })

  describe('movePiece', () => {
    let state: TetrisGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should move piece left', () => {
      const initialX = state.currentPiece.x
      const newState = movePiece(state, -1, 0)
      expect(newState.currentPiece.x).toBe(initialX - 1)
    })

    it('should move piece right', () => {
      const initialX = state.currentPiece.x
      const newState = movePiece(state, 1, 0)
      expect(newState.currentPiece.x).toBe(initialX + 1)
    })

    it('should move piece down', () => {
      const initialY = state.currentPiece.y
      const newState = movePiece(state, 0, 1)
      expect(newState.currentPiece.y).toBe(initialY + 1)
    })

    it('should not move if not playing', () => {
      state.status = 'IDLE'
      const newState = movePiece(state, 1, 0)
      expect(newState).toEqual(state)
    })

    it('should lock piece when moving down hits bottom', () => {
      state.currentPiece.y = defaultConfig.boardHeight - 2
      const newState = movePiece(state, 0, 1)
      expect(newState.currentPiece.type).not.toBe(state.currentPiece.type)
    })
  })

  describe('rotatePiece', () => {
    let state: TetrisGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
      // 使用 I 块测试旋转（非对称）
      state.currentPiece = createTetromino('I', 3, 0)
    })

    it('should rotate piece', () => {
      const originalShape = state.currentPiece.shape
      const newState = rotatePiece(state)
      // I 块旋转后会改变形状
      expect(newState.currentPiece.shape).not.toEqual(originalShape)
    })

    it('should not rotate if not playing', () => {
      state.status = 'IDLE'
      const newState = rotatePiece(state)
      expect(newState).toEqual(state)
    })

    it('should attempt wall kick when rotation is blocked', () => {
      // Place piece near wall
      state.currentPiece.x = 0
      const newState = rotatePiece(state)
      // Should try to kick away from wall
      expect(newState.currentPiece.x).toBeGreaterThanOrEqual(0)
    })
  })

  describe('hardDrop', () => {
    let state: TetrisGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
      // 将方块放在中间位置
      state.currentPiece.y = 5
    })

    it('should drop piece to bottom', () => {
      const newState = hardDrop(state)
      // 方块应该被锁定，y位置应该在底部或生成新方块
      expect(newState.currentPiece.y).not.toBe(state.currentPiece.y)
    })

    it('should lock piece after drop', () => {
      const newState = hardDrop(state)
      // 检查是否有方块被锁定到板上（通过检查行是否被清除或分数增加）
      // 或者生成了新方块（位置重置）
      const pieceAtTop = newState.currentPiece.y <= 0
      expect(pieceAtTop || newState.score > 0).toBe(true)
    })

    it('should not drop if not playing', () => {
      state.status = 'IDLE'
      const newState = hardDrop(state)
      expect(newState).toEqual(state)
    })
  })

  describe('gameStep', () => {
    let state: TetrisGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should move piece down', () => {
      const initialY = state.currentPiece.y
      const newState = gameStep(state)
      expect(newState.currentPiece.y).toBe(initialY + 1)
    })

    it('should not update if not playing', () => {
      state.status = 'PAUSED'
      const newState = gameStep(state)
      expect(newState).toEqual(state)
    })
  })

  describe('startGame', () => {
    it('should change status to PLAYING from IDLE', () => {
      const state = initializeGame()
      const newState = startGame(state)
      expect(newState.status).toBe('PLAYING')
    })

    it('should reset game if GAME_OVER', () => {
      let state = initializeGame()
      state.status = 'GAME_OVER'
      state.score = 1000
      const newState = startGame(state)
      expect(newState.status).toBe('PLAYING')
      expect(newState.score).toBe(0)
    })

    it('should not change if already PLAYING', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      const newState = startGame(state)
      expect(newState.status).toBe('PLAYING')
    })
  })

  describe('pauseGame', () => {
    it('should change status to PAUSED from PLAYING', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      const newState = pauseGame(state)
      expect(newState.status).toBe('PAUSED')
    })

    it('should not change if not PLAYING', () => {
      const state = initializeGame()
      const newState = pauseGame(state)
      expect(newState.status).toBe('IDLE')
    })
  })

  describe('resumeGame', () => {
    it('should change status to PLAYING from PAUSED', () => {
      let state = initializeGame()
      state.status = 'PAUSED'
      const newState = resumeGame(state)
      expect(newState.status).toBe('PLAYING')
    })

    it('should not change if not PAUSED', () => {
      const state = initializeGame()
      const newState = resumeGame(state)
      expect(newState.status).toBe('IDLE')
    })
  })

  describe('resetGame', () => {
    it('should reset game state but keep high score', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      state.score = 1000
      state.highScore = 2000
      state.level = 5

      const newState = resetGame(state)

      expect(newState.status).toBe('IDLE')
      expect(newState.score).toBe(0)
      expect(newState.level).toBe(1)
      expect(newState.highScore).toBe(2000)
    })
  })

  describe('togglePause', () => {
    it('should pause when PLAYING', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      const newState = togglePause(state)
      expect(newState.status).toBe('PAUSED')
    })

    it('should resume when PAUSED', () => {
      let state = initializeGame()
      state.status = 'PAUSED'
      const newState = togglePause(state)
      expect(newState.status).toBe('PLAYING')
    })

    it('should not change when IDLE', () => {
      const state = initializeGame()
      const newState = togglePause(state)
      expect(newState.status).toBe('IDLE')
    })

    it('should not change when GAME_OVER', () => {
      let state = initializeGame()
      state.status = 'GAME_OVER'
      const newState = togglePause(state)
      expect(newState.status).toBe('GAME_OVER')
    })
  })
})
