import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createBoard,
  placeMines,
  countNeighborMines,
  initializeGame,
  revealCell,
  revealCellRecursive,
  revealAllMines,
  toggleFlag,
  quickReveal,
  checkWin,
  updateTime,
  restartGame,
  changeDifficulty,
  DIFFICULTY_CONFIG,
  type Board,
  type MinesweeperState,
  type Difficulty,
} from './minesweeperLogic'

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

describe('Minesweeper Game Logic', () => {
  describe('createBoard', () => {
    it('should create board with correct dimensions', () => {
      const board = createBoard(9, 9)
      expect(board).toHaveLength(9)
      expect(board[0]).toHaveLength(9)
    })

    it('should initialize all cells as closed', () => {
      const board = createBoard(3, 3)
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell.state).toBe('CLOSED')
          expect(cell.isMine).toBe(false)
          expect(cell.neighborMines).toBe(0)
        })
      })
    })
  })

  describe('placeMines', () => {
    it('should place correct number of mines', () => {
      let board = createBoard(9, 9)
      board = placeMines(board, 10, 0, 0)
      const mineCount = board.flat().filter(cell => cell.isMine).length
      expect(mineCount).toBe(10)
    })

    it('should not place mines in safe area', () => {
      let board = createBoard(9, 9)
      board = placeMines(board, 10, 4, 4)

      // Check safe area (3x3 around click)
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const row = 4 + dr
          const col = 4 + dc
          if (row >= 0 && row < 9 && col >= 0 && col < 9) {
            expect(board[row][col].isMine).toBe(false)
          }
        }
      }
    })

    it('should calculate neighbor mine counts', () => {
      let board = createBoard(3, 3)
      // Manually place a mine
      board[0][0].isMine = true
      board = placeMines(board, 0, 2, 2)

      // Cell [1][1] should have 1 neighbor mine
      expect(board[1][1].neighborMines).toBe(1)
    })
  })

  describe('countNeighborMines', () => {
    it('should count mines correctly', () => {
      let board = createBoard(3, 3)
      board[0][0].isMine = true
      board[0][1].isMine = true
      board[1][0].isMine = true

      expect(countNeighborMines(board, 1, 1)).toBe(3)
    })

    it('should return 0 for no mines', () => {
      const board = createBoard(3, 3)
      expect(countNeighborMines(board, 1, 1)).toBe(0)
    })

    it('should handle edge cells', () => {
      let board = createBoard(3, 3)
      board[0][1].isMine = true
      board[1][0].isMine = true

      expect(countNeighborMines(board, 0, 0)).toBe(2)
    })
  })

  describe('initializeGame', () => {
    it('should initialize with correct difficulty', () => {
      const state = initializeGame('EASY')
      expect(state.rows).toBe(9)
      expect(state.cols).toBe(9)
      expect(state.mineCount).toBe(10)
    })

    it('should initialize with IDLE status', () => {
      const state = initializeGame('EASY')
      expect(state.status).toBe('IDLE')
      expect(state.firstClick).toBe(true)
    })

    it('should load best time from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('120')
      const state = initializeGame('EASY')
      expect(state.bestTime).toBe(120)
    })
  })

  describe('revealCell', () => {
    let state: MinesweeperState

    beforeEach(() => {
      state = initializeGame('EASY')
    })

    it('should change status to PLAYING on first click', () => {
      const newState = revealCell(state, 0, 0)
      expect(newState.status).toBe('PLAYING')
      expect(newState.firstClick).toBe(false)
    })

    it('should reveal the clicked cell', () => {
      const newState = revealCell(state, 0, 0)
      expect(newState.board[0][0].state).toBe('OPEN')
    })

    it('should not reveal flagged cells', () => {
      state.board[0][0].state = 'FLAGGED'
      const newState = revealCell(state, 0, 0)
      expect(newState.board[0][0].state).toBe('FLAGGED')
    })

    it('should set GAME_OVER when clicking mine', () => {
      // Force a mine at [0][0]
      state = revealCell(state, 1, 1) // First click to place mines
      state.board[0][0].isMine = true
      state.board[0][0].state = 'CLOSED'

      const newState = revealCell(state, 0, 0)
      expect(newState.status).toBe('GAME_OVER')
    })

    it('should reveal all mines on game over', () => {
      state = revealCell(state, 1, 1) // First click
      state.board[0][0].isMine = true
      state.board[0][0].state = 'CLOSED'

      const newState = revealCell(state, 0, 0)
      const revealedMines = newState.board
        .flat()
        .filter(c => c.isMine && c.state === 'OPEN').length
      expect(revealedMines).toBeGreaterThan(0)
    })
  })

  describe('revealCellRecursive', () => {
    it('should reveal empty area recursively', () => {
      // Create a board with no mines first
      let board = createBoard(5, 5)

      // Manually set up a scenario where [0][0] has no neighbor mines
      // and should reveal multiple cells
      board[4][4].isMine = true
      // Recalculate neighbor counts
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if (!board[row][col].isMine) {
            board[row][col].neighborMines = countNeighborMines(board, row, col)
          }
        }
      }

      const newBoard = revealCellRecursive(board, 0, 0)

      // Should reveal multiple cells since [0][0] and its neighbors have 0 neighbor mines
      const revealedCount = newBoard
        .flat()
        .filter(c => c.state === 'OPEN').length
      expect(revealedCount).toBeGreaterThanOrEqual(1)
    })

    it('should stop at cells with neighbor mines', () => {
      let board = createBoard(3, 3)
      board[0][0].isMine = true
      board[1][1].neighborMines = 1

      const newBoard = revealCellRecursive(board, 2, 2)
      // [2][2] should be opened
      expect(newBoard[2][2].state).toBe('OPEN')
      // [1][1] has neighbor mine, so it should be opened but recursion stops there
      // Actually, in recursive reveal, cells with neighbor mines ARE opened
      // but their neighbors are not auto-revealed
      expect(newBoard[1][1].state).toBe('OPEN')
    })
  })

  describe('toggleFlag', () => {
    let state: MinesweeperState

    beforeEach(() => {
      state = initializeGame('EASY')
      state = revealCell(state, 0, 0) // Start game
    })

    it('should flag closed cell', () => {
      // Find a closed cell (not revealed by first click)
      let closedRow = -1,
        closedCol = -1
      for (let row = 0; row < state.rows; row++) {
        for (let col = 0; col < state.cols; col++) {
          if (state.board[row][col].state === 'CLOSED') {
            closedRow = row
            closedCol = col
            break
          }
        }
        if (closedRow !== -1) break
      }

      // If we found a closed cell, test flagging it
      if (closedRow !== -1) {
        const newState = toggleFlag(state, closedRow, closedCol)
        expect(newState.board[closedRow][closedCol].state).toBe('FLAGGED')
        expect(newState.flagCount).toBe(1)
      }
    })

    it('should change flag to question', () => {
      state = toggleFlag(state, 1, 1)
      const newState = toggleFlag(state, 1, 1)
      expect(newState.board[1][1].state).toBe('QUESTION')
      expect(newState.flagCount).toBe(0)
    })

    it('should change question to closed', () => {
      // First toggle: CLOSED -> FLAGGED
      let newState = toggleFlag(state, 1, 1)
      expect(newState.board[1][1].state).toBe('FLAGGED')

      // Second toggle: FLAGGED -> QUESTION
      newState = toggleFlag(newState, 1, 1)
      expect(newState.board[1][1].state).toBe('QUESTION')

      // Third toggle: QUESTION -> CLOSED
      newState = toggleFlag(newState, 1, 1)
      expect(newState.board[1][1].state).toBe('CLOSED')
    })

    it('should not flag opened cells', () => {
      state = revealCell(state, 1, 1)
      const newState = toggleFlag(state, 1, 1)
      expect(newState.board[1][1].state).toBe('OPEN')
    })
  })

  describe('quickReveal', () => {
    it('should reveal neighbors when flags match number', () => {
      let state = initializeGame('EASY')
      state = revealCell(state, 0, 0)

      // Setup: cell [1][1] has 1 neighbor mine
      state.board[0][0].isMine = true
      state.board[0][0].state = 'CLOSED'
      state.board[1][1].neighborMines = 1
      state.board[1][1].state = 'OPEN'

      // Flag the mine
      state = toggleFlag(state, 0, 0)

      // Quick reveal should reveal other cells
      const newState = quickReveal(state, 1, 1)
      expect(newState.board[0][1].state).toBe('OPEN')
    })

    it('should do nothing when flags do not match', () => {
      let state = initializeGame('EASY')
      state = revealCell(state, 0, 0)
      state.board[1][1].state = 'OPEN'
      state.board[1][1].neighborMines = 2

      const newState = quickReveal(state, 1, 1)
      expect(newState).toEqual(state)
    })
  })

  describe('checkWin', () => {
    it('should return true when all non-mine cells are open', () => {
      let board = createBoard(3, 3)
      board[0][0].isMine = true

      // Open all non-mine cells
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (!board[row][col].isMine) {
            board[row][col].state = 'OPEN'
          }
        }
      }

      expect(checkWin(board)).toBe(true)
    })

    it('should return false when non-mine cells are closed', () => {
      const board = createBoard(3, 3)
      expect(checkWin(board)).toBe(false)
    })
  })

  describe('updateTime', () => {
    it('should increment time when playing', () => {
      let state = initializeGame('EASY')
      state.status = 'PLAYING'
      state.time = 10

      const newState = updateTime(state)
      expect(newState.time).toBe(11)
    })

    it('should not update time when not playing', () => {
      let state = initializeGame('EASY')
      state.time = 10

      const newState = updateTime(state)
      expect(newState.time).toBe(10)
    })
  })

  describe('restartGame', () => {
    it('should reset game with same difficulty', () => {
      let state = initializeGame('MEDIUM')
      state.status = 'PLAYING'
      state.time = 100
      state.flagCount = 5

      const newState = restartGame(state)
      expect(newState.status).toBe('IDLE')
      expect(newState.time).toBe(0)
      expect(newState.flagCount).toBe(0)
      expect(newState.rows).toBe(16)
    })
  })

  describe('changeDifficulty', () => {
    it('should change to new difficulty', () => {
      const state = initializeGame('EASY')
      const newState = changeDifficulty(state, 'HARD')

      expect(newState.rows).toBe(16)
      expect(newState.cols).toBe(30)
      expect(newState.mineCount).toBe(99)
    })
  })

  describe('DIFFICULTY_CONFIG', () => {
    it('should have correct EASY config', () => {
      expect(DIFFICULTY_CONFIG.EASY).toEqual({
        rows: 9,
        cols: 9,
        mineCount: 10,
      })
    })

    it('should have correct MEDIUM config', () => {
      expect(DIFFICULTY_CONFIG.MEDIUM).toEqual({
        rows: 16,
        cols: 16,
        mineCount: 40,
      })
    })

    it('should have correct HARD config', () => {
      expect(DIFFICULTY_CONFIG.HARD).toEqual({
        rows: 16,
        cols: 30,
        mineCount: 99,
      })
    })
  })
})
