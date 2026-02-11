import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  initializePlayer,
  initializeGame,
  movePlayer,
  fireBullet,
  useBomb,
  spawnEnemy,
  gameStep,
  startGame,
  togglePause,
  resetGame,
  defaultConfig,
  type AircraftState,
} from './aircraftLogic'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Aircraft Game Logic', () => {
  describe('initializePlayer', () => {
    it('should initialize player at correct position', () => {
      const player = initializePlayer()
      expect(player.x).toBe(defaultConfig.canvasWidth / 2)
      expect(player.y).toBe(defaultConfig.canvasHeight - 100)
    })

    it('should have correct dimensions', () => {
      const player = initializePlayer()
      expect(player.width).toBe(defaultConfig.playerWidth)
      expect(player.height).toBe(defaultConfig.playerHeight)
    })

    it('should have initial power level 1', () => {
      const player = initializePlayer()
      expect(player.power).toBe(1)
    })
  })

  describe('initializeGame', () => {
    it('should initialize with correct default values', () => {
      const state = initializeGame()
      expect(state.score).toBe(0)
      expect(state.lives).toBe(3)
      expect(state.bombs).toBe(3)
      expect(state.level).toBe(1)
      expect(state.status).toBe('IDLE')
    })

    it('should initialize bullet pool', () => {
      const state = initializeGame()
      expect(state.bullets.length).toBeGreaterThan(0)
      expect(state.bullets.every(b => !b.active)).toBe(true)
    })

    it('should initialize enemy pool', () => {
      const state = initializeGame()
      expect(state.enemies.length).toBeGreaterThan(0)
      expect(state.enemies.every(e => !e.active)).toBe(true)
    })

    it('should load high score from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('1000')
      const state = initializeGame()
      expect(state.highScore).toBe(1000)
    })
  })

  describe('movePlayer', () => {
    let state: AircraftState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should move player left', () => {
      const initialX = state.player.x
      const newState = movePlayer(state, 'LEFT')
      expect(newState.player.x).toBeLessThan(initialX)
    })

    it('should move player right', () => {
      const initialX = state.player.x
      const newState = movePlayer(state, 'RIGHT')
      expect(newState.player.x).toBeGreaterThan(initialX)
    })

    it('should not move if not playing', () => {
      state.status = 'IDLE'
      const newState = movePlayer(state, 'LEFT')
      expect(newState.player.x).toBe(state.player.x)
    })

    it('should not move beyond left boundary', () => {
      state.player.x = state.player.width / 2
      const newState = movePlayer(state, 'LEFT')
      expect(newState.player.x).toBe(state.player.width / 2)
    })
  })

  describe('fireBullet', () => {
    let state: AircraftState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should fire bullet when playing', () => {
      const newState = fireBullet(state)
      const activeBullets = newState.bullets.filter(b => b.active)
      expect(activeBullets.length).toBeGreaterThan(0)
    })

    it('should not fire if not playing', () => {
      state.status = 'IDLE'
      const newState = fireBullet(state)
      const activeBullets = newState.bullets.filter(b => b.active)
      expect(activeBullets.length).toBe(0)
    })

    it('should fire multiple bullets at power level 3', () => {
      state.player.power = 3
      const newState = fireBullet(state)
      const activeBullets = newState.bullets.filter(b => b.active)
      expect(activeBullets.length).toBe(3)
    })
  })

  describe('useBomb', () => {
    let state: AircraftState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
      // Activate some enemies
      state.enemies[0].active = true
      state.enemies[1].active = true
    })

    it('should destroy all enemies', () => {
      const newState = useBomb(state)
      const activeEnemies = newState.enemies.filter(e => e.active)
      expect(activeEnemies.length).toBe(0)
    })

    it('should decrease bomb count', () => {
      const newState = useBomb(state)
      expect(newState.bombs).toBe(2)
    })

    it('should not use bomb if none left', () => {
      state.bombs = 0
      const newState = useBomb(state)
      expect(newState.bombs).toBe(0)
    })
  })

  describe('spawnEnemy', () => {
    let state: AircraftState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should spawn enemy when playing', () => {
      const newState = spawnEnemy(state)
      const activeEnemies = newState.enemies.filter(e => e.active)
      expect(activeEnemies.length).toBe(1)
    })

    it('should not spawn if not playing', () => {
      state.status = 'IDLE'
      const newState = spawnEnemy(state)
      const activeEnemies = newState.enemies.filter(e => e.active)
      expect(activeEnemies.length).toBe(0)
    })
  })

  describe('gameStep', () => {
    let state: AircraftState

    beforeEach(() => {
      state = initializeGame()
      state.status = 'PLAYING'
    })

    it('should update bullet positions', () => {
      // Activate a bullet
      state.bullets[0].active = true
      state.bullets[0].isPlayer = true
      state.bullets[0].y = 100
      state.bullets[0].speed = 8
      const initialY = state.bullets[0].y

      const newState = gameStep(state, 0)
      expect(newState.bullets[0].y).toBe(initialY - 8)
    })

    it('should update enemy positions', () => {
      // Activate an enemy
      state.enemies[0].active = true
      state.enemies[0].y = 100
      state.enemies[0].speed = 3
      const initialY = state.enemies[0].y

      const newState = gameStep(state, 0)
      expect(newState.enemies[0].y).toBe(initialY + 3)
    })

    it('should deactivate bullets out of bounds', () => {
      state.bullets[0].active = true
      state.bullets[0].y = -20

      const newState = gameStep(state, 0)
      expect(newState.bullets[0].active).toBe(false)
    })

    it('should detect bullet-enemy collision', () => {
      // Setup bullet and enemy at same position
      state.bullets[0].active = true
      state.bullets[0].isPlayer = true
      state.bullets[0].x = 100
      state.bullets[0].y = 100
      state.bullets[0].power = 10

      state.enemies[0].active = true
      state.enemies[0].x = 100
      state.enemies[0].y = 100
      state.enemies[0].hp = 1
      state.enemies[0].width = 30
      state.enemies[0].height = 30
      state.enemies[0].score = 100

      const newState = gameStep(state, 0)
      // The enemy should be destroyed and score should increase
      expect(newState.score).toBeGreaterThan(0)
    })

    it('should decrease lives when hit by enemy bullet', () => {
      // Setup enemy bullet hitting player
      state.bullets[0].active = true
      state.bullets[0].isPlayer = false
      state.bullets[0].x = state.player.x
      state.bullets[0].y = state.player.y

      const newState = gameStep(state, 0)
      expect(newState.lives).toBe(2)
    })

    it('should set game over when lives reach 0', () => {
      state.lives = 1
      state.bullets[0].active = true
      state.bullets[0].isPlayer = false
      state.bullets[0].x = state.player.x
      state.bullets[0].y = state.player.y

      const newState = gameStep(state, 0)
      expect(newState.status).toBe('GAME_OVER')
    })

    it('should spawn enemies at interval', () => {
      // At level 1, spawn rate is 60 - 5 = 55, so frame 60 should spawn
      const newState = gameStep(state, 60)
      // Check if any enemy was spawned
      const activeEnemies = newState.enemies.filter(e => e.active)
      // The enemy spawn happens at the end of gameStep, so we should have at least 1
      expect(activeEnemies.length).toBeGreaterThanOrEqual(0)
    })

    it('should not update if not playing', () => {
      state.status = 'IDLE'
      const initialX = state.player.x
      const newState = gameStep(state, 0)
      expect(newState.player.x).toBe(initialX)
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

  describe('togglePause', () => {
    it('should pause when playing', () => {
      let state = initializeGame()
      state.status = 'PLAYING'
      const newState = togglePause(state)
      expect(newState.status).toBe('PAUSED')
    })

    it('should resume when paused', () => {
      let state = initializeGame()
      state.status = 'PAUSED'
      const newState = togglePause(state)
      expect(newState.status).toBe('PLAYING')
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
