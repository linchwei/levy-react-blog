import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createBoard,
  initializeGame,
  findEmptyPosition,
  getNeighbors,
  canMove,
  moveNumber,
  checkSolved,
  restartGame,
  changeDifficulty,
  updateTime,
  countInversions,
  isSolvable,
  type KlotskiState,
} from './klotskiLogic'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Klotski Game Logic', () => {
  describe('createBoard', () => {
    it('should create 3x3 board', () => {
      const board = createBoard(3)
      expect(board).toHaveLength(3)
      expect(board[0]).toHaveLength(3)
      expect(board[2][2]).toBe(0)
    })

    it('should create 4x4 board', () => {
      const board = createBoard(4)
      expect(board).toHaveLength(4)
      expect(board[3][3]).toBe(0)
    })

    it('should have correct numbers', () => {
      const board = createBoard(3)
      expect(board[0][0]).toBe(1)
      expect(board[0][1]).toBe(2)
      expect(board[0][2]).toBe(3)
      expect(board[1][0]).toBe(4)
      expect(board[2][2]).toBe(0)
    })
  })

  describe('initializeGame', () => {
    it('should initialize with correct size', () => {
      const state = initializeGame(4)
      expect(state.size).toBe(4)
      expect(state.board).toHaveLength(4)
    })

    it('should initialize with zero moves and time', () => {
      const state = initializeGame(4)
      expect(state.moves).toBe(0)
      expect(state.time).toBe(0)
    })

    it('should have IDLE status', () => {
      const state = initializeGame(4)
      expect(state.status).toBe('IDLE')
    })
  })

  describe('findEmptyPosition', () => {
    it('should find empty position in solved board', () => {
      const board = createBoard(3)
      const pos = findEmptyPosition(board, 3)
      expect(pos).toEqual({ row: 2, col: 2 })
    })

    it('should find empty position at different location', () => {
      const board = createBoard(3)
      board[0][0] = 0
      board[2][2] = 1
      const pos = findEmptyPosition(board, 3)
      expect(pos).toEqual({ row: 0, col: 0 })
    })
  })

  describe('getNeighbors', () => {
    it('should return 4 neighbors for center cell', () => {
      const neighbors = getNeighbors(1, 1, 3)
      expect(neighbors).toHaveLength(4)
    })

    it('should return 2 neighbors for corner cell', () => {
      const neighbors = getNeighbors(0, 0, 3)
      expect(neighbors).toHaveLength(2)
    })

    it('should return 3 neighbors for edge cell', () => {
      const neighbors = getNeighbors(0, 1, 3)
      expect(neighbors).toHaveLength(3)
    })
  })

  describe('canMove', () => {
    it('should allow adjacent moves', () => {
      const board = createBoard(3)
      // Empty at [2,2], can move [2,1] or [1,2]
      expect(canMove(board, 3, 2, 1)).toBe(true)
      expect(canMove(board, 3, 1, 2)).toBe(true)
    })

    it('should not allow non-adjacent moves', () => {
      const board = createBoard(3)
      expect(canMove(board, 3, 0, 0)).toBe(false)
      expect(canMove(board, 3, 1, 1)).toBe(false)
    })
  })

  describe('moveNumber', () => {
    let state: KlotskiState

    beforeEach(() => {
      // Use a solved board for predictable tests
      state = {
        board: createBoard(3),
        size: 3,
        moves: 0,
        time: 0,
        status: 'IDLE',
        bestTime: 0,
        bestMoves: 0,
      }
    })

    it('should move number to empty space', () => {
      // In solved 3x3, empty is at [2,2], can move [2,1] (number 8)
      const newState = moveNumber(state, 2, 1)
      expect(newState.board[2][2]).toBe(8)
      expect(newState.board[2][1]).toBe(0)
      expect(newState.moves).toBe(1)
    })

    it('should not move if not adjacent to empty', () => {
      const newState = moveNumber(state, 0, 0)
      expect(newState.board[0][0]).toBe(1)
      expect(newState.moves).toBe(0)
    })

    it('should change status to PLAYING after first move', () => {
      const newState = moveNumber(state, 2, 1)
      expect(newState.status).toBe('PLAYING')
    })

    it('should detect solved state', () => {
      // Create a nearly solved board
      const board = createBoard(3)
      // Swap last two numbers
      board[2][1] = 0
      board[2][2] = 8
      state.board = board
      state.status = 'PLAYING'

      const newState = moveNumber(state, 2, 2)
      expect(newState.status).toBe('SOLVED')
    })
  })

  describe('checkSolved', () => {
    it('should return true for solved board', () => {
      const board = createBoard(3)
      expect(checkSolved(board, 3)).toBe(true)
    })

    it('should return false for unsolved board', () => {
      const board = createBoard(3)
      board[0][0] = 2
      board[0][1] = 1
      expect(checkSolved(board, 3)).toBe(false)
    })
  })

  describe('restartGame', () => {
    it('should reset moves and time', () => {
      let state = initializeGame(3)
      state = moveNumber(state, 2, 1)
      state = updateTime(state, 10)

      const newState = restartGame(state)
      expect(newState.moves).toBe(0)
      expect(newState.time).toBe(0)
      expect(newState.status).toBe('IDLE')
    })

    it('should keep same size', () => {
      const state = initializeGame(4)
      const newState = restartGame(state)
      expect(newState.size).toBe(4)
    })
  })

  describe('changeDifficulty', () => {
    it('should change board size', () => {
      const state = changeDifficulty(5)
      expect(state.size).toBe(5)
      expect(state.board).toHaveLength(5)
    })

    it('should reset game state', () => {
      const state = changeDifficulty(5)
      expect(state.moves).toBe(0)
      expect(state.time).toBe(0)
    })
  })

  describe('updateTime', () => {
    it('should update time when playing', () => {
      let state = initializeGame(3)
      state.status = 'PLAYING'
      const newState = updateTime(state, 10)
      expect(newState.time).toBe(10)
    })

    it('should not update time when not playing', () => {
      let state = initializeGame(3)
      state.status = 'IDLE'
      const newState = updateTime(state, 10)
      expect(newState.time).toBe(0)
    })
  })

  describe('countInversions', () => {
    it('should return 0 for solved board', () => {
      const board = createBoard(3)
      expect(countInversions(board, 3)).toBe(0)
    })

    it('should count inversions correctly', () => {
      const board = [
        [2, 1, 3],
        [4, 5, 6],
        [7, 8, 0],
      ]
      // One inversion: 2 > 1
      expect(countInversions(board, 3)).toBe(1)
    })
  })

  describe('isSolvable', () => {
    it('should return true for solved board', () => {
      const board = createBoard(3)
      expect(isSolvable(board, 3)).toBe(true)
    })

    it('should return false for unsolvable 3x3', () => {
      const board = [
        [1, 2, 3],
        [4, 5, 6],
        [8, 7, 0],
      ]
      // One inversion: 8 > 7 (odd), 3x3 needs even inversions
      expect(isSolvable(board, 3)).toBe(false)
    })
  })
})
