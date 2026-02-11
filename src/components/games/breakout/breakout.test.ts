import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  initializeBall,
  initializePaddle,
  createBricks,
  initializeGame,
  movePaddle,
  checkBrickCollision,
  checkPaddleCollision,
  updateBall,
  gameStep,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  togglePause,
  defaultConfig,
  type Ball,
  type Paddle,
  type Brick,
  type BreakoutGameState,
} from './breakoutLogic'

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

describe('Breakout Game Logic', () => {
  describe('initializeBall', () => {
    it('should initialize ball with correct position', () => {
      const ball = initializeBall()
      expect(ball.x).toBe(defaultConfig.canvasWidth / 2)
      expect(ball.y).toBe(defaultConfig.canvasHeight - 100)
    })

    it('should initialize ball with correct radius', () => {
      const ball = initializeBall()
      expect(ball.radius).toBe(defaultConfig.ballRadius)
    })

    it('should initialize ball with velocity', () => {
      const ball = initializeBall()
      expect(ball.dx).not.toBe(0)
      expect(ball.dy).not.toBe(0)
    })
  })

  describe('initializePaddle', () => {
    it('should initialize paddle with correct dimensions', () => {
      const paddle = initializePaddle()
      expect(paddle.width).toBe(defaultConfig.paddleWidth)
      expect(paddle.height).toBe(defaultConfig.paddleHeight)
    })

    it('should center paddle horizontally', () => {
      const paddle = initializePaddle()
      expect(paddle.x).toBe((defaultConfig.canvasWidth - defaultConfig.paddleWidth) / 2)
    })

    it('should position paddle near bottom', () => {
      const paddle = initializePaddle()
      expect(paddle.y).toBe(defaultConfig.canvasHeight - 30)
    })
  })

  describe('createBricks', () => {
    it('should create correct number of bricks', () => {
      const bricks = createBricks()
      expect(bricks).toHaveLength(defaultConfig.brickRows * defaultConfig.brickCols)
    })

    it('should make all bricks visible initially', () => {
      const bricks = createBricks()
      bricks.forEach(brick => {
        expect(brick.visible).toBe(true)
      })
    })

    it('should assign points to bricks', () => {
      const bricks = createBricks()
      bricks.forEach(brick => {
        expect(brick.points).toBeGreaterThan(0)
      })
    })

    it('should assign colors to bricks', () => {
      const bricks = createBricks()
      bricks.forEach(brick => {
        expect(brick.color).toBeDefined()
      })
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

    it('should create ball, paddle and bricks', () => {
      const state = initializeGame()
      expect(state.ball).toBeDefined()
      expect(state.paddle).toBeDefined()
      expect(state.bricks).toHaveLength(defaultConfig.brickRows * defaultConfig.brickCols)
    })

    it('should load high score from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('1000')
      const state = initializeGame()
      expect(state.highScore).toBe(1000)
    })
  })

  describe('movePaddle', () => {
    let state: BreakoutGameState

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
      expect(newState).toEqual(state)
    })

    it('should not move paddle beyond left boundary', () => {
      state.paddle.x = 0
      const newState = movePaddle(state, 'LEFT')
      expect(newState.paddle.x).toBe(0)
    })

    it('should not move paddle beyond right boundary', () => {
      state.paddle.x = defaultConfig.canvasWidth - state.paddle.width
      const newState = movePaddle(state, 'RIGHT')
      expect(newState.paddle.x).toBe(defaultConfig.canvasWidth - state.paddle.width)
    })
  })

  describe('checkBrickCollision', () => {
    it('should return true when ball hits brick', () => {
      const ball: Ball = { x: 100, y: 100, dx: 0, dy: 0, radius: 8, speed: 5 }
      const brick: Brick = { x: 90, y: 90, width: 50, height: 20, color: '#fff', points: 10, visible: true }
      expect(checkBrickCollision(ball, brick)).toBe(true)
    })

    it('should return false when ball does not hit brick', () => {
      const ball: Ball = { x: 200, y: 200, dx: 0, dy: 0, radius: 8, speed: 5 }
      const brick: Brick = { x: 90, y: 90, width: 50, height: 20, color: '#fff', points: 10, visible: true }
      expect(checkBrickCollision(ball, brick)).toBe(false)
    })

    it('should return false for invisible brick', () => {
      const ball: Ball = { x: 100, y: 100, dx: 0, dy: 0, radius: 8, speed: 5 }
      const brick: Brick = { x: 90, y: 90, width: 50, height: 20, color: '#fff', points: 10, visible: false }
      expect(checkBrickCollision(ball, brick)).toBe(false)
    })
  })

  describe('checkPaddleCollision', () => {
    it('should return true when ball hits paddle', () => {
      const ball: Ball = { x: 400, y: 570, dx: 0, dy: 0, radius: 8, speed: 5 }
      const paddle: Paddle = { x: 350, y: 570, width: 100, height: 15, speed: 8 }
      expect(checkPaddleCollision(ball, paddle)).toBe(true)
    })

    it('should return false when ball does not hit paddle', () => {
      const ball: Ball = { x: 100, y: 100, dx: 0, dy: 0, radius: 8, speed: 5 }
      const paddle: Paddle = { x: 350, y: 570, width: 100, height: 15, speed: 8 }
      expect(checkPaddleCollision(ball, paddle)).toBe(false)
    })
  })

  describe('updateBall', () => {
    let state: BreakoutGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should update ball position', () => {
      const initialX = state.ball.x
      const initialY = state.ball.y
      const newState = updateBall(state)
      expect(newState.ball.x).not.toBe(initialX)
      expect(newState.ball.y).not.toBe(initialY)
    })

    it('should bounce off left wall', () => {
      state.ball.x = state.ball.radius
      state.ball.dx = -5
      const newState = updateBall(state)
      expect(newState.ball.dx).toBeGreaterThan(0)
    })

    it('should bounce off right wall', () => {
      state.ball.x = defaultConfig.canvasWidth - state.ball.radius
      state.ball.dx = 5
      const newState = updateBall(state)
      expect(newState.ball.dx).toBeLessThan(0)
    })

    it('should bounce off top wall', () => {
      state.ball.y = state.ball.radius
      state.ball.dy = -5
      const newState = updateBall(state)
      expect(newState.ball.dy).toBeGreaterThan(0)
    })

    it('should decrease lives when ball falls', () => {
      state.ball.y = defaultConfig.canvasHeight + 100
      state.ball.dy = 5
      const newState = updateBall(state)
      expect(newState.lives).toBe(2)
    })

    it('should reset ball position after losing life', () => {
      state.ball.y = defaultConfig.canvasHeight + 100
      state.ball.dy = 5
      const newState = updateBall(state)
      expect(newState.ball.y).toBe(defaultConfig.canvasHeight - 100)
    })

    it('should set game over when lives reach zero', () => {
      state.lives = 1
      state.ball.y = defaultConfig.canvasHeight + 100
      state.ball.dy = 5
      const newState = updateBall(state)
      expect(newState.status).toBe('GAME_OVER')
    })

    it('should increase score when hitting brick', () => {
      state.ball.x = state.bricks[0].x + state.bricks[0].width / 2
      state.ball.y = state.bricks[0].y + state.bricks[0].height + state.ball.radius
      state.ball.dy = -5
      const newState = updateBall(state)
      expect(newState.score).toBeGreaterThan(0)
    })

    it('should hide brick when hit', () => {
      state.ball.x = state.bricks[0].x + state.bricks[0].width / 2
      state.ball.y = state.bricks[0].y + state.bricks[0].height + state.ball.radius
      state.ball.dy = -5
      const newState = updateBall(state)
      expect(newState.bricks[0].visible).toBe(false)
    })

    it('should advance to next level when all bricks destroyed', () => {
      state.bricks.forEach(brick => brick.visible = false)
      const newState = updateBall(state)
      expect(newState.level).toBe(2)
    })
  })

  describe('gameStep', () => {
    let state: BreakoutGameState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should update ball position', () => {
      const initialX = state.ball.x
      const newState = gameStep(state)
      expect(newState.ball.x).not.toBe(initialX)
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
      state.lives = 0
      const newState = startGame(state)
      expect(newState.status).toBe('PLAYING')
      expect(newState.score).toBe(0)
      expect(newState.lives).toBe(3)
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
      state.lives = 1
      state.level = 5
      state.highScore = 2000

      const newState = resetGame(state)

      expect(newState.status).toBe('IDLE')
      expect(newState.score).toBe(0)
      expect(newState.lives).toBe(3)
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
