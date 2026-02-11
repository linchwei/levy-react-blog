import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateId,
  initializeGame,
  generateFood,
  isValidDirection,
  getNextPosition,
  checkCollision,
  checkEatFood,
  calculateSpeed,
  gameStep,
  setDirection,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  togglePause,
  defaultConfig,
  type SnakeGameState,
} from './snakeLogic'

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

describe('Snake Game Logic', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('initializeGame', () => {
    it('should initialize game with correct default values', () => {
      const state = initializeGame()

      expect(state.snake).toHaveLength(3)
      expect(state.direction).toBe('RIGHT')
      expect(state.nextDirection).toBe('RIGHT')
      expect(state.status).toBe('IDLE')
      expect(state.score).toBe(0)
      expect(state.speed).toBe(defaultConfig.initialSpeed)
      expect(state.baseSpeed).toBe(defaultConfig.initialSpeed)
      expect(state.food).toBeDefined()
    })

    it('should place snake at center of grid', () => {
      const state = initializeGame()
      const centerX = Math.floor(defaultConfig.gridWidth / 2)
      const centerY = Math.floor(defaultConfig.gridHeight / 2)

      expect(state.snake[0].x).toBe(centerX)
      expect(state.snake[0].y).toBe(centerY)
    })

    it('should initialize snake horizontally', () => {
      const state = initializeGame()
      const head = state.snake[0]

      expect(state.snake[1].x).toBe(head.x - 1)
      expect(state.snake[1].y).toBe(head.y)
      expect(state.snake[2].x).toBe(head.x - 2)
      expect(state.snake[2].y).toBe(head.y)
    })
  })

  describe('generateFood', () => {
    it('should generate food outside snake body', () => {
      const snake = [
        { x: 10, y: 10, id: '1' },
        { x: 9, y: 10, id: '2' },
        { x: 8, y: 10, id: '3' },
      ]
      const food = generateFood(snake)

      const isOnSnake = snake.some(
        node => node.x === food.x && node.y === food.y
      )
      expect(isOnSnake).toBe(false)
    })

    it('should generate food within grid bounds', () => {
      const snake = [{ x: 0, y: 0, id: '1' }]
      const food = generateFood(snake)

      expect(food.x).toBeGreaterThanOrEqual(0)
      expect(food.x).toBeLessThan(defaultConfig.gridWidth)
      expect(food.y).toBeGreaterThanOrEqual(0)
      expect(food.y).toBeLessThan(defaultConfig.gridHeight)
    })

    it('should have correct food properties', () => {
      const snake = [{ x: 0, y: 0, id: '1' }]
      const food = generateFood(snake)

      expect(food.id).toBeDefined()
      expect(['NORMAL', 'SPECIAL']).toContain(food.type)
      expect(food.value).toBeGreaterThan(0)
    })
  })

  describe('isValidDirection', () => {
    it('should allow perpendicular directions', () => {
      expect(isValidDirection('UP', 'LEFT')).toBe(true)
      expect(isValidDirection('UP', 'RIGHT')).toBe(true)
      expect(isValidDirection('DOWN', 'LEFT')).toBe(true)
      expect(isValidDirection('DOWN', 'RIGHT')).toBe(true)
      expect(isValidDirection('LEFT', 'UP')).toBe(true)
      expect(isValidDirection('LEFT', 'DOWN')).toBe(true)
      expect(isValidDirection('RIGHT', 'UP')).toBe(true)
      expect(isValidDirection('RIGHT', 'DOWN')).toBe(true)
    })

    it('should not allow opposite directions', () => {
      expect(isValidDirection('UP', 'DOWN')).toBe(false)
      expect(isValidDirection('DOWN', 'UP')).toBe(false)
      expect(isValidDirection('LEFT', 'RIGHT')).toBe(false)
      expect(isValidDirection('RIGHT', 'LEFT')).toBe(false)
    })

    it('should allow same direction', () => {
      expect(isValidDirection('UP', 'UP')).toBe(true)
      expect(isValidDirection('DOWN', 'DOWN')).toBe(true)
      expect(isValidDirection('LEFT', 'LEFT')).toBe(true)
      expect(isValidDirection('RIGHT', 'RIGHT')).toBe(true)
    })
  })

  describe('getNextPosition', () => {
    it('should calculate correct next position for each direction', () => {
      const head = { x: 5, y: 5 }

      expect(getNextPosition(head, 'UP')).toEqual({ x: 5, y: 4 })
      expect(getNextPosition(head, 'DOWN')).toEqual({ x: 5, y: 6 })
      expect(getNextPosition(head, 'LEFT')).toEqual({ x: 4, y: 5 })
      expect(getNextPosition(head, 'RIGHT')).toEqual({ x: 6, y: 5 })
    })
  })

  describe('checkCollision', () => {
    it('should detect wall collision', () => {
      const snake = [{ x: 5, y: 5, id: '1' }]

      expect(checkCollision({ x: -1, y: 5 }, snake)).toBe(true)
      expect(checkCollision({ x: defaultConfig.gridWidth, y: 5 }, snake)).toBe(
        true
      )
      expect(checkCollision({ x: 5, y: -1 }, snake)).toBe(true)
      expect(checkCollision({ x: 5, y: defaultConfig.gridHeight }, snake)).toBe(
        true
      )
    })

    it('should detect self collision', () => {
      const snake = [
        { x: 5, y: 5, id: '1' },
        { x: 4, y: 5, id: '2' },
        { x: 3, y: 5, id: '3' },
      ]

      // 撞到身体（非尾巴）应该检测到碰撞
      expect(checkCollision({ x: 4, y: 5 }, snake)).toBe(true)
      // 撞到尾巴不应该检测到碰撞（因为尾巴会移动）
      expect(checkCollision({ x: 3, y: 5 }, snake)).toBe(false)
    })

    it('should not detect collision with tail', () => {
      const snake = [
        { x: 5, y: 5, id: '1' },
        { x: 4, y: 5, id: '2' },
        { x: 3, y: 5, id: '3' },
      ]

      // Tail will move, so no collision
      expect(checkCollision({ x: 3, y: 5 }, snake)).toBe(false)
    })

    it('should not detect collision with empty space', () => {
      const snake = [{ x: 5, y: 5, id: '1' }]

      expect(checkCollision({ x: 10, y: 10 }, snake)).toBe(false)
    })
  })

  describe('checkEatFood', () => {
    it('should return true when head is on food', () => {
      const head = { x: 5, y: 5 }
      const food = { x: 5, y: 5, id: '1', type: 'NORMAL' as const, value: 10 }

      expect(checkEatFood(head, food)).toBe(true)
    })

    it('should return false when head is not on food', () => {
      const head = { x: 5, y: 5 }
      const food = { x: 10, y: 10, id: '1', type: 'NORMAL' as const, value: 10 }

      expect(checkEatFood(head, food)).toBe(false)
    })
  })

  describe('calculateSpeed', () => {
    it('should increase speed as score increases', () => {
      const baseSpeed = 150
      const initialSpeed = calculateSpeed(0, baseSpeed)
      const fasterSpeed = calculateSpeed(100, baseSpeed)

      expect(fasterSpeed).toBeLessThan(initialSpeed)
    })

    it('should not exceed max speed', () => {
      const baseSpeed = 150
      const veryHighScore = 10000
      const speed = calculateSpeed(veryHighScore, baseSpeed)

      expect(speed).toBeGreaterThanOrEqual(defaultConfig.maxSpeed)
    })

    it('should calculate correct speed increments', () => {
      const baseSpeed = 150
      const speed50 = calculateSpeed(50, baseSpeed)
      const speed100 = calculateSpeed(100, baseSpeed)

      expect(speed50 - speed100).toBe(defaultConfig.speedIncrement)
    })
  })

  describe('gameStep', () => {
    let initialState: SnakeGameState

    beforeEach(() => {
      initialState = initializeGame()
      initialState.status = 'PLAYING'
    })

    it('should not update state if not playing', () => {
      initialState.status = 'PAUSED'
      const newState = gameStep(initialState)

      expect(newState).toEqual(initialState)
    })

    it('should move snake in current direction', () => {
      const oldHead = initialState.snake[0]
      const newState = gameStep(initialState)
      const newHead = newState.snake[0]

      expect(newHead.x).toBe(oldHead.x + 1)
      expect(newHead.y).toBe(oldHead.y)
    })

    it('should maintain snake length when not eating', () => {
      const oldLength = initialState.snake.length
      const newState = gameStep(initialState)

      expect(newState.snake.length).toBe(oldLength)
    })

    it('should end game on collision', () => {
      // Put snake near wall
      initialState.snake = [
        { x: defaultConfig.gridWidth - 1, y: 5, id: '1' },
        { x: defaultConfig.gridWidth - 2, y: 5, id: '2' },
        { x: defaultConfig.gridWidth - 3, y: 5, id: '3' },
      ]
      initialState.direction = 'RIGHT'
      initialState.nextDirection = 'RIGHT'

      const newState = gameStep(initialState)

      expect(newState.status).toBe('GAME_OVER')
    })

    it('should update score when eating food', () => {
      // Place food directly in front of snake
      const head = initialState.snake[0]
      initialState.food = {
        x: head.x + 1,
        y: head.y,
        id: 'food',
        type: 'NORMAL',
        value: 10,
      }

      const newState = gameStep(initialState)

      expect(newState.score).toBe(10)
      expect(newState.snake.length).toBe(initialState.snake.length + 1)
    })

    it('should generate new food after eating', () => {
      const head = initialState.snake[0]
      initialState.food = {
        x: head.x + 1,
        y: head.y,
        id: 'food',
        type: 'NORMAL',
        value: 10,
      }

      const newState = gameStep(initialState)

      expect(newState.food.id).not.toBe('food')
    })
  })

  describe('setDirection', () => {
    let state: SnakeGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should update next direction if valid', () => {
      const newState = setDirection(state, 'UP')

      expect(newState.nextDirection).toBe('UP')
    })

    it('should not update direction if invalid', () => {
      state.direction = 'RIGHT'
      const newState = setDirection(state, 'LEFT')

      expect(newState.nextDirection).toBe('RIGHT')
    })

    it('should not update direction if not playing', () => {
      state.status = 'IDLE'
      const newState = setDirection(state, 'UP')

      expect(newState.nextDirection).toBe('RIGHT')
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
      state.score = 100
      state.snake = [{ x: 0, y: 0, id: '1' }]

      const newState = startGame(state)

      expect(newState.status).toBe('PLAYING')
      expect(newState.score).toBe(0)
      expect(newState.snake.length).toBe(3)
    })

    it('should not change state if already PLAYING', () => {
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

    it('should not change state if not PLAYING', () => {
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

    it('should not change state if not PAUSED', () => {
      const state = initializeGame()
      const newState = resumeGame(state)

      expect(newState.status).toBe('IDLE')
    })
  })

  describe('resetGame', () => {
    it('should reset game state but keep high score', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      state.score = 100
      state.highScore = 200
      state.snake = [{ x: 0, y: 0, id: '1' }]

      const newState = resetGame(state)

      expect(newState.status).toBe('IDLE')
      expect(newState.score).toBe(0)
      expect(newState.highScore).toBe(200)
      expect(newState.snake.length).toBe(3)
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
