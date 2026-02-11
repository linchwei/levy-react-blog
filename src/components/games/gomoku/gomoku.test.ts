import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createBoard,
  initializeGame,
  isValidPosition,
  isEmpty,
  makeMove,
  checkWin,
  checkDraw,
  undoMove,
  restartGame,
  changeMode,
  changeDifficulty,
  getAIMove,
  BOARD_SIZE,
  type GomokuState,
} from './gomokuLogic'

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

describe('Gomoku Game Logic', () => {
  describe('createBoard', () => {
    it('should create board with default size', () => {
      const board = createBoard()
      expect(board).toHaveLength(BOARD_SIZE)
      expect(board[0]).toHaveLength(BOARD_SIZE)
    })

    it('should create board with custom size', () => {
      const board = createBoard(10)
      expect(board).toHaveLength(10)
      expect(board[0]).toHaveLength(10)
    })

    it('should initialize all cells as null', () => {
      const board = createBoard(5)
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeNull()
        })
      })
    })
  })

  describe('initializeGame', () => {
    it('should initialize with correct default values', () => {
      const state = initializeGame()
      expect(state.board).toHaveLength(BOARD_SIZE)
      expect(state.currentPlayer).toBe('BLACK')
      expect(state.status).toBe('IDLE')
      expect(state.winner).toBeNull()
      expect(state.mode).toBe('PVP')
      expect(state.moveHistory).toEqual([])
    })

    it('should initialize with PVE mode', () => {
      const state = initializeGame('PVE', 'HARD')
      expect(state.mode).toBe('PVE')
      expect(state.difficulty).toBe('HARD')
    })

    it('should load scores from localStorage', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'gomokuBlackScore') return '5'
        if (key === 'gomokuWhiteScore') return '3'
        return null
      })
      const state = initializeGame()
      expect(state.blackScore).toBe(5)
      expect(state.whiteScore).toBe(3)
    })
  })

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      const board = createBoard(5)
      expect(isValidPosition(board, 0, 0)).toBe(true)
      expect(isValidPosition(board, 4, 4)).toBe(true)
      expect(isValidPosition(board, 2, 3)).toBe(true)
    })

    it('should return false for invalid positions', () => {
      const board = createBoard(5)
      expect(isValidPosition(board, -1, 0)).toBe(false)
      expect(isValidPosition(board, 0, -1)).toBe(false)
      expect(isValidPosition(board, 5, 0)).toBe(false)
      expect(isValidPosition(board, 0, 5)).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty cells', () => {
      const board = createBoard(5)
      expect(isEmpty(board, 0, 0)).toBe(true)
    })

    it('should return false for occupied cells', () => {
      const board = createBoard(5)
      board[0][0] = 'BLACK'
      expect(isEmpty(board, 0, 0)).toBe(false)
    })

    it('should return false for invalid positions', () => {
      const board = createBoard(5)
      expect(isEmpty(board, -1, 0)).toBe(false)
      expect(isEmpty(board, 5, 5)).toBe(false)
    })
  })

  describe('makeMove', () => {
    let state: GomokuState

    beforeEach(() => {
      state = initializeGame()
    })

    it('should place stone on empty cell', () => {
      const newState = makeMove(state, 7, 7)
      expect(newState.board[7][7]).toBe('BLACK')
    })

    it('should switch player after move', () => {
      const newState = makeMove(state, 7, 7)
      expect(newState.currentPlayer).toBe('WHITE')
    })

    it('should not allow move on occupied cell', () => {
      state.board[7][7] = 'BLACK'
      const newState = makeMove(state, 7, 7)
      expect(newState).toEqual(state)
    })

    it('should add move to history', () => {
      const newState = makeMove(state, 7, 7)
      expect(newState.moveHistory).toHaveLength(1)
      expect(newState.moveHistory[0]).toEqual({ row: 7, col: 7 })
    })

    it('should detect horizontal win', () => {
      // Create horizontal line of 5 black stones
      for (let col = 0; col < 4; col++) {
        state.board[7][col] = 'BLACK'
      }
      state.currentPlayer = 'BLACK'

      const newState = makeMove(state, 7, 4)
      expect(newState.status).toBe('BLACK_WIN')
      expect(newState.winner).toBe('BLACK')
    })

    it('should detect vertical win', () => {
      // Create vertical line of 5 black stones
      for (let row = 0; row < 4; row++) {
        state.board[row][7] = 'BLACK'
      }
      state.currentPlayer = 'BLACK'

      const newState = makeMove(state, 4, 7)
      expect(newState.status).toBe('BLACK_WIN')
    })

    it('should detect diagonal win', () => {
      // Create diagonal line of 5 black stones
      for (let i = 0; i < 4; i++) {
        state.board[i][i] = 'BLACK'
      }
      state.currentPlayer = 'BLACK'

      const newState = makeMove(state, 4, 4)
      expect(newState.status).toBe('BLACK_WIN')
    })

    it('should detect anti-diagonal win', () => {
      // Create anti-diagonal line of 5 black stones
      for (let i = 0; i < 4; i++) {
        state.board[i][8 - i] = 'BLACK'
      }
      state.currentPlayer = 'BLACK'

      const newState = makeMove(state, 4, 4)
      expect(newState.status).toBe('BLACK_WIN')
    })

    it('should detect draw', () => {
      // Use a small 3x3 board for draw test to avoid 5-in-a-row
      const smallState = initializeGame()
      smallState.board = createBoard(3)

      // Fill the 3x3 board
      smallState.board[0][0] = 'BLACK'
      smallState.board[0][1] = 'WHITE'
      smallState.board[0][2] = 'BLACK'
      smallState.board[1][0] = 'WHITE'
      smallState.board[1][1] = 'BLACK'
      smallState.board[1][2] = 'WHITE'
      smallState.board[2][0] = 'WHITE'
      smallState.board[2][1] = 'BLACK'
      // Leave [2][2] empty
      smallState.currentPlayer = 'WHITE'

      const newState = makeMove(smallState, 2, 2)
      expect(newState.status).toBe('DRAW')
    })

    it('should update score on win', () => {
      // Reset localStorage mock for this test
      localStorageMock.getItem.mockReturnValue('0')
      state = initializeGame() // Re-initialize to get fresh state with score 0

      for (let col = 0; col < 4; col++) {
        state.board[7][col] = 'BLACK'
      }
      state.currentPlayer = 'BLACK'

      const newState = makeMove(state, 7, 4)
      expect(newState.blackScore).toBe(1)
    })
  })

  describe('checkWin', () => {
    it('should return false for no win', () => {
      const board = createBoard(5)
      expect(checkWin(board, 2, 2, 'BLACK')).toBe(false)
    })

    it('should detect 5 in a row', () => {
      const board = createBoard(5)
      for (let col = 0; col < 5; col++) {
        board[2][col] = 'BLACK'
      }
      expect(checkWin(board, 2, 2, 'BLACK')).toBe(true)
    })

    it('should not detect win with less than 5', () => {
      const board = createBoard(5)
      for (let col = 0; col < 4; col++) {
        board[2][col] = 'BLACK'
      }
      expect(checkWin(board, 2, 2, 'BLACK')).toBe(false)
    })
  })

  describe('checkDraw', () => {
    it('should return false when empty cells exist', () => {
      const board = createBoard(3)
      expect(checkDraw(board)).toBe(false)
    })

    it('should return true when board is full', () => {
      const board = createBoard(3)
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          board[row][col] = 'BLACK'
        }
      }
      expect(checkDraw(board)).toBe(true)
    })
  })

  describe('undoMove', () => {
    it('should undo last move', () => {
      let state = initializeGame()
      state = makeMove(state, 7, 7)

      const newState = undoMove(state)
      expect(newState.board[7][7]).toBeNull()
      expect(newState.moveHistory).toHaveLength(0)
    })

    it('should switch back to previous player', () => {
      let state = initializeGame()
      state = makeMove(state, 7, 7) // BLACK moves

      const newState = undoMove(state)
      expect(newState.currentPlayer).toBe('BLACK')
    })

    it('should not undo if no moves', () => {
      const state = initializeGame()
      const newState = undoMove(state)
      expect(newState).toEqual(state)
    })

    it('should not undo after game over', () => {
      let state = initializeGame()
      for (let col = 0; col < 5; col++) {
        state.board[7][col] = 'BLACK'
      }
      state.status = 'BLACK_WIN'

      const newState = undoMove(state)
      expect(newState).toEqual(state)
    })
  })

  describe('restartGame', () => {
    it('should reset board', () => {
      let state = initializeGame()
      state = makeMove(state, 7, 7)
      state.status = 'PLAYING'

      const newState = restartGame(state)
      expect(newState.board[7][7]).toBeNull()
      expect(newState.status).toBe('IDLE')
      expect(newState.currentPlayer).toBe('BLACK')
    })

    it('should preserve scores', () => {
      let state = initializeGame()
      state.blackScore = 5
      state.whiteScore = 3

      const newState = restartGame(state)
      expect(newState.blackScore).toBe(5)
      expect(newState.whiteScore).toBe(3)
    })
  })

  describe('changeMode', () => {
    it('should change to PVE mode', () => {
      const state = initializeGame('PVP')
      const newState = changeMode(state, 'PVE')
      expect(newState.mode).toBe('PVE')
    })

    it('should reset game', () => {
      let state = initializeGame('PVP')
      state = makeMove(state, 7, 7)

      const newState = changeMode(state, 'PVE')
      expect(newState.board[7][7]).toBeNull()
      expect(newState.moveHistory).toHaveLength(0)
    })
  })

  describe('changeDifficulty', () => {
    it('should change difficulty', () => {
      const state = initializeGame('PVE', 'EASY')
      const newState = changeDifficulty(state, 'HARD')
      expect(newState.difficulty).toBe('HARD')
    })

    it('should reset game', () => {
      let state = initializeGame('PVE', 'EASY')
      state = makeMove(state, 7, 7)

      const newState = changeDifficulty(state, 'HARD')
      expect(newState.board[7][7]).toBeNull()
    })
  })

  describe('getAIMove', () => {
    it('should return null in PVP mode', () => {
      const state = initializeGame('PVP')
      expect(getAIMove(state)).toBeNull()
    })

    it('should return null when not AI turn', () => {
      const state = initializeGame('PVE')
      state.currentPlayer = 'BLACK' // Human's turn
      expect(getAIMove(state)).toBeNull()
    })

    it('should return a valid move in PVE mode', () => {
      const state = initializeGame('PVE', 'EASY')
      state.currentPlayer = 'WHITE' // AI's turn
      state.status = 'PLAYING'

      const move = getAIMove(state)
      expect(move).not.toBeNull()
      expect(move?.row).toBeGreaterThanOrEqual(0)
      expect(move?.row).toBeLessThan(BOARD_SIZE)
      expect(move?.col).toBeGreaterThanOrEqual(0)
      expect(move?.col).toBeLessThan(BOARD_SIZE)
    })

    it('should return null when board is full', () => {
      const state = initializeGame('PVE', 'EASY')
      state.currentPlayer = 'WHITE'
      // Fill the board
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          state.board[row][col] = 'BLACK'
        }
      }

      expect(getAIMove(state)).toBeNull()
    })
  })
})
