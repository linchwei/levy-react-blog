import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateId,
  shuffleArray,
  createCards,
  initializeGame,
  flipCard,
  checkMatch,
  startGame,
  resetGame,
  updateTime,
  calculateFinalScore,
  CARD_ICONS,
  type MemoryGameState,
} from './memoryLogic'

describe('Memory Game Logic', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('shuffleArray', () => {
    it('should return array with same length', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(arr)
      expect(shuffled).toHaveLength(arr.length)
    })

    it('should contain same elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(arr)
      expect(shuffled.sort()).toEqual(arr.sort())
    })

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]
      shuffleArray(arr)
      expect(arr).toEqual(original)
    })
  })

  describe('createCards', () => {
    it('should create correct number of cards', () => {
      const cards = createCards(8)
      expect(cards).toHaveLength(16)
    })

    it('should create pairs of cards', () => {
      const cards = createCards(4)
      const values = cards.map(c => c.value)
      const valueCounts: Record<string, number> = {}
      values.forEach(v => {
        valueCounts[v] = (valueCounts[v] || 0) + 1
      })
      Object.values(valueCounts).forEach(count => {
        expect(count).toBe(2)
      })
    })

    it('should use icons from CARD_ICONS', () => {
      const cards = createCards(4)
      cards.forEach(card => {
        expect(CARD_ICONS).toContain(card.value)
      })
    })

    it('should initialize all cards as closed', () => {
      const cards = createCards(4)
      cards.forEach(card => {
        expect(card.status).toBe('CLOSED')
      })
    })

    it('should assign unique IDs', () => {
      const cards = createCards(4)
      const ids = cards.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('initializeGame', () => {
    it('should initialize with correct default values', () => {
      const state = initializeGame()
      expect(state.cards).toHaveLength(16)
      expect(state.flippedCards).toEqual([])
      expect(state.matchedPairs).toBe(0)
      expect(state.totalPairs).toBe(8)
      expect(state.moves).toBe(0)
      expect(state.score).toBe(0)
      expect(state.time).toBe(0)
      expect(state.status).toBe('IDLE')
    })

    it('should use custom grid size', () => {
      const state = initializeGame({ rows: 6, cols: 6 })
      expect(state.cards).toHaveLength(36)
      expect(state.totalPairs).toBe(18)
      expect(state.gridSize).toEqual({ rows: 6, cols: 6 })
    })
  })

  describe('flipCard', () => {
    let state: MemoryGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should flip closed card', () => {
      const cardId = state.cards[0].id
      const newState = flipCard(state, cardId)
      expect(newState.cards[0].status).toBe('OPEN')
      expect(newState.flippedCards).toContain(cardId)
    })

    it('should not flip if not playing', () => {
      state.status = 'IDLE'
      const cardId = state.cards[0].id
      const newState = flipCard(state, cardId)
      expect(newState).toEqual(state)
    })

    it('should not flip matched card', () => {
      state.cards[0].status = 'MATCHED'
      const cardId = state.cards[0].id
      const newState = flipCard(state, cardId)
      expect(newState).toEqual(state)
    })

    it('should not flip already open card', () => {
      state.cards[0].status = 'OPEN'
      const cardId = state.cards[0].id
      const newState = flipCard(state, cardId)
      expect(newState).toEqual(state)
    })

    it('should not flip more than 2 cards', () => {
      state.cards[0].status = 'OPEN'
      state.cards[1].status = 'OPEN'
      state.flippedCards = [state.cards[0].id, state.cards[1].id]
      const cardId = state.cards[2].id
      const newState = flipCard(state, cardId)
      expect(newState.cards[2].status).toBe('CLOSED')
    })

    it('should return same state for non-existent card', () => {
      const newState = flipCard(state, 'non-existent')
      expect(newState).toEqual(state)
    })
  })

  describe('checkMatch', () => {
    let state: MemoryGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
      // 设置两对相同的卡片
      state.cards[0].value = '🐶'
      state.cards[1].value = '🐶'
      state.cards[2].value = '🐱'
      state.cards[3].value = '🐱'
    })

    it('should return same state if less than 2 cards flipped', () => {
      state.flippedCards = [state.cards[0].id]
      const newState = checkMatch(state)
      expect(newState).toEqual(state)
    })

    it('should match identical cards', () => {
      state.cards[0].status = 'OPEN'
      state.cards[1].status = 'OPEN'
      state.flippedCards = [state.cards[0].id, state.cards[1].id]
      const newState = checkMatch(state)
      expect(newState.cards[0].status).toBe('MATCHED')
      expect(newState.cards[1].status).toBe('MATCHED')
      expect(newState.matchedPairs).toBe(1)
      expect(newState.score).toBeGreaterThan(0)
    })

    it('should close non-matching cards', () => {
      state.cards[0].status = 'OPEN'
      state.cards[2].status = 'OPEN'
      state.flippedCards = [state.cards[0].id, state.cards[2].id]
      const newState = checkMatch(state)
      expect(newState.cards[0].status).toBe('CLOSED')
      expect(newState.cards[2].status).toBe('CLOSED')
    })

    it('should increment moves', () => {
      state.cards[0].status = 'OPEN'
      state.cards[1].status = 'OPEN'
      state.flippedCards = [state.cards[0].id, state.cards[1].id]
      const newState = checkMatch(state)
      expect(newState.moves).toBe(1)
    })

    it('should clear flipped cards', () => {
      state.cards[0].status = 'OPEN'
      state.cards[1].status = 'OPEN'
      state.flippedCards = [state.cards[0].id, state.cards[1].id]
      const newState = checkMatch(state)
      expect(newState.flippedCards).toEqual([])
    })

    it('should set game over when all pairs matched', () => {
      // 设置只剩一对未匹配
      state.cards.forEach((card, index) => {
        if (index !== 0 && index !== 1) {
          card.status = 'MATCHED'
        }
      })
      state.matchedPairs = state.totalPairs - 1
      state.cards[0].status = 'OPEN'
      state.cards[1].status = 'OPEN'
      state.flippedCards = [state.cards[0].id, state.cards[1].id]
      const newState = checkMatch(state)
      expect(newState.status).toBe('GAME_OVER')
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
      state.moves = 10
      state.score = 1000
      const newState = startGame(state)
      expect(newState.status).toBe('PLAYING')
      expect(newState.moves).toBe(0)
      expect(newState.score).toBe(0)
    })

    it('should not change if already PLAYING', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      const newState = startGame(state)
      expect(newState.status).toBe('PLAYING')
    })
  })

  describe('resetGame', () => {
    it('should reset all game state', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      state.moves = 10
      state.score = 1000
      state.matchedPairs = 5
      state.time = 60
      const newState = resetGame(state)
      expect(newState.status).toBe('IDLE')
      expect(newState.moves).toBe(0)
      expect(newState.score).toBe(0)
      expect(newState.matchedPairs).toBe(0)
      expect(newState.time).toBe(0)
      expect(newState.flippedCards).toEqual([])
    })

    it('should create new cards', () => {
      let state = initializeGame()
      const oldCardIds = state.cards.map(c => c.id)
      const newState = resetGame(state)
      const newCardIds = newState.cards.map(c => c.id)
      expect(newCardIds).not.toEqual(oldCardIds)
    })
  })

  describe('updateTime', () => {
    it('should update time', () => {
      const state = initializeGame()
      const newState = updateTime(state, 60)
      expect(newState.time).toBe(60)
    })
  })

  describe('calculateFinalScore', () => {
    it('should calculate base score', () => {
      const score = calculateFinalScore(16, 60, 8)
      expect(score).toBeGreaterThanOrEqual(800)
    })

    it('should give bonus for fewer moves', () => {
      const scoreFewMoves = calculateFinalScore(10, 60, 8)
      const scoreManyMoves = calculateFinalScore(20, 60, 8)
      expect(scoreFewMoves).toBeGreaterThan(scoreManyMoves)
    })

    it('should give bonus for less time', () => {
      const scoreFast = calculateFinalScore(16, 30, 8)
      const scoreSlow = calculateFinalScore(16, 120, 8)
      expect(scoreFast).toBeGreaterThan(scoreSlow)
    })

    it('should not give negative bonus', () => {
      const score = calculateFinalScore(100, 1000, 8)
      expect(score).toBeGreaterThanOrEqual(800)
    })
  })
})
