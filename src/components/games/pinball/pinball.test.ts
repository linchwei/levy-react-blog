import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  initializeBall,
  initializePaddle,
  createBricks,
  initializeGame,
  movePaddle,
  launchBall,
  createParticles,
  checkCircleRectCollision,
  gameStep,
  startGame,
  resetGame,
  defaultConfig,
  type PinballState,
} from './pinballLogic'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Pinball Game Logic', () => {
  describe('initializeBall', () => {
    it('should initialize ball at correct position', () => {
      const ball = initializeBall()
      expect(ball.x).toBe(defaultConfig.canvasWidth / 2)
      expect(ball.y).toBe(defaultConfig.canvasHeight - 50)
    })

    it('should have correct radius', () => {
      const ball = initializeBall()
      expect(ball.radius).toBe(defaultConfig.ballRadius)
    })

    it('should have initial velocity', () => {
      const ball = initializeBall()
      expect(ball.vx).toBe(3)
      expect(ball.vy).toBe(-3)
    })
  })

  describe('initializePaddle', () => {
    it('should initialize paddle at correct position', () => {
      const paddle = initializePaddle()
      expect(paddle.x).toBe(defaultConfig.canvasWidth / 2)
      expect(paddle.y).toBe(defaultConfig.canvasHeight - 30)
    })

    it('should have correct dimensions', () => {
      const paddle = initializePaddle()
      expect(paddle.width).toBe(defaultConfig.paddleWidth)
      expect(paddle.height).toBe(defaultConfig.paddleHeight)
    })
  })

  describe('createBricks', () => {
    it('should create correct number of bricks for level 1', () => {
      const bricks = createBricks(1)
      expect(bricks).toHaveLength(defaultConfig.brickRows * defaultConfig.brickCols)
    })

    it('should create more bricks for higher levels', () => {
      const bricks1 = createBricks(1)
      const bricks2 = createBricks(2)
      expect(bricks2.length).toBeGreaterThan(bricks1.length)
    })

    it('should assign points based on row', () => {
      const bricks = createBricks(1)
      const topBrick = bricks[0]
      const bottomBrick = bricks[bricks.length - 1]
      expect(topBrick.points).toBeGreaterThanOrEqual(bottomBrick.points)
    })
  })

  describe('initializeGame', () => {
    it('should initialize with correct default values', () => {
      const state = initializeGame()
      expect(state.score).toBe(0)
      expect(state.lives).toBe(3)
      expect(state.level).toBe(1)
      expect(state.status).toBe('IDLE')
    })

    it('should initialize empty particles', () => {
      const state = initializeGame()
      expect(state.particles).toEqual([])
    })

    it('should load high score from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('1000')
      const state = initializeGame()
      expect(state.highScore).toBe(1000)
    })
  })

  describe('movePaddle', () => {
    let state: PinballState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should move paddle left', () => {
      const initialX = state.paddle.x
      const newState = movePaddle(state, 'LEFT')
      expect(newState.paddle.x).toBeLessThan(initialX)
    })

    it('should move paddle right', () => {
      const initialX = state.paddle.x
      const newState = movePaddle(state, 'RIGHT')
      expect(newState.paddle.x).toBeGreaterThan(initialX)
    })

    it('should not move if not playing', () => {
      state.status = 'IDLE'
      const newState = movePaddle(state, 'LEFT')
      expect(newState.paddle.x).toBe(state.paddle.x)
    })

    it('should not move beyond left boundary', () => {
      state.paddle.x = state.paddle.width / 2
      const newState = movePaddle(state, 'LEFT')
      expect(newState.paddle.x).toBe(state.paddle.width / 2)
    })

    it('should not move beyond right boundary', () => {
      state.paddle.x = defaultConfig.canvasWidth - state.paddle.width / 2
      const newState = movePaddle(state, 'RIGHT')
      expect(newState.paddle.x).toBe(defaultConfig.canvasWidth - state.paddle.width / 2)
    })
  })

  describe('launchBall', () => {
    it('should change status to PLAYING from IDLE', () => {
      const state = initializeGame()
      const newState = launchBall(state)
      expect(newState.status).toBe('PLAYING')
    })

    it('should not change status if not IDLE', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      const newState = launchBall(state)
      expect(newState.status).toBe('PLAYING')
    })
  })

  describe('createParticles', () => {
    it('should create particles', () => {
      const particles = createParticles(100, 100, '#ff0000')
      expect(particles.length).toBeGreaterThan(0)
    })

    it('should set particles at given position', () => {
      const particles = createParticles(100, 100, '#ff0000')
      expect(particles[0].x).toBe(100)
      expect(particles[0].y).toBe(100)
    })

    it('should use given color', () => {
      const particles = createParticles(100, 100, '#ff0000')
      expect(particles[0].color).toBe('#ff0000')
    })
  })

  describe('checkCircleRectCollision', () => {
    it('should detect collision when circle overlaps rect', () => {
      const circle = { x: 100, y: 100, radius: 10 }
      const rect = { x: 100, y: 100, width: 50, height: 20 }
      expect(checkCircleRectCollision(circle, rect)).toBe(true)
    })

    it('should not detect collision when far apart', () => {
      const circle = { x: 10, y: 10, radius: 5 }
      const rect = { x: 100, y: 100, width: 50, height: 20 }
      expect(checkCircleRectCollision(circle, rect)).toBe(false)
    })

    it('should detect collision at edge', () => {
      const circle = { x: 75, y: 100, radius: 10 }
      const rect = { x: 100, y: 100, width: 50, height: 20 }
      expect(checkCircleRectCollision(circle, rect)).toBe(true)
    })
  })

  describe('gameStep', () => {
    let state: PinballState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should update ball position', () => {
      const initialX = state.ball.x
      const initialY = state.ball.y
      const newState = gameStep(state)
      expect(newState.ball.x).not.toBe(initialX)
      expect(newState.ball.y).not.toBe(initialY)
    })

    it('should bounce off left wall', () => {
      state.ball.x = state.ball.radius
      state.ball.vx = -3
      const newState = gameStep(state)
      expect(newState.ball.vx).toBeGreaterThan(0)
    })

    it('should bounce off right wall', () => {
      state.ball.x = defaultConfig.canvasWidth - state.ball.radius
      state.ball.vx = 3
      const newState = gameStep(state)
      expect(newState.ball.vx).toBeLessThan(0)
    })

    it('should bounce off top wall', () => {
      state.ball.y = state.ball.radius
      state.ball.vy = -3
      const newState = gameStep(state)
      expect(newState.ball.vy).toBeGreaterThan(0)
    })

    it('should remove hit bricks', () => {
      // Position ball to hit first brick
      state.ball.x = state.bricks[0].x
      state.ball.y = state.bricks[0].y
      const initialBrickCount = state.bricks.length
      const newState = gameStep(state)
      expect(newState.bricks.length).toBeLessThan(initialBrickCount)
    })

    it('should add score when hitting brick', () => {
      state.ball.x = state.bricks[0].x
      state.ball.y = state.bricks[0].y
      const newState = gameStep(state)
      expect(newState.score).toBeGreaterThan(0)
    })

    it('should decrease lives when ball falls', () => {
      state.ball.y = defaultConfig.canvasHeight + 10
      state.ball.vy = 3
      const newState = gameStep(state)
      expect(newState.lives).toBe(2)
    })

    it('should create particles when hitting brick', () => {
      state.ball.x = state.bricks[0].x
      state.ball.y = state.bricks[0].y
      const newState = gameStep(state)
      expect(newState.particles.length).toBeGreaterThan(0)
    })

    it('should not update if not playing', () => {
      state.status = 'IDLE'
      const initialX = state.ball.x
      const newState = gameStep(state)
      expect(newState.ball.x).toBe(initialX)
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

    it('should preserve high score', () => {
      let state = initializeGame()
      state.highScore = 5000
      state.status = 'GAME_OVER'
      const newState = startGame(state)
      expect(newState.highScore).toBe(5000)
    })
  })

  describe('resetGame', () => {
    it('should reset all game state', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      state.score = 1000
      state.lives = 1
      state.level = 5
      state.highScore = 5000

      const newState = resetGame(state)

      expect(newState.status).toBe('IDLE')
      expect(newState.score).toBe(0)
      expect(newState.lives).toBe(3)
      expect(newState.level).toBe(1)
      expect(newState.highScore).toBe(5000)
    })
  })
})
