/**
 * 飞机大战游戏逻辑 - 优化版本
 * 使用对象池和高效的碰撞检测
 */

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
export type PowerUpType = 'POWER' | 'BOMB' | 'LIFE'

export interface Player {
  x: number
  y: number
  width: number
  height: number
  speed: number
  power: number
}

export interface Bullet {
  id: number
  x: number
  y: number
  speed: number
  power: number
  isPlayer: boolean
  active: boolean
}

export interface Enemy {
  id: number
  x: number
  y: number
  width: number
  height: number
  speed: number
  hp: number
  maxHp: number
  score: number
  type: 'SMALL' | 'MEDIUM' | 'LARGE'
  active: boolean
}

export interface PowerUp {
  id: number
  x: number
  y: number
  type: PowerUpType
  speed: number
  active: boolean
}

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  active: boolean
}

export interface AircraftState {
  player: Player
  bullets: Bullet[]
  enemies: Enemy[]
  powerUps: PowerUp[]
  particles: Particle[]
  score: number
  lives: number
  bombs: number
  level: number
  status: GameStatus
  highScore: number
  // 对象池索引
  bulletPoolIndex: number
  enemyPoolIndex: number
  particlePoolIndex: number
}

export interface GameConfig {
  canvasWidth: number
  canvasHeight: number
  playerWidth: number
  playerHeight: number
  bulletSpeed: number
  enemySpawnRate: number
}

export const defaultConfig: GameConfig = {
  canvasWidth: 400,
  canvasHeight: 600,
  playerWidth: 50,
  playerHeight: 50,
  bulletSpeed: 8,
  enemySpawnRate: 60,
}

// 对象池大小
const POOL_SIZE = {
  bullets: 100,
  enemies: 50,
  particles: 200,
}

let idCounter = 0
function generateId(): number {
  return ++idCounter
}

// 初始化对象池
function initBulletPool(): Bullet[] {
  return Array.from({ length: POOL_SIZE.bullets }, () => ({
    id: generateId(),
    x: 0,
    y: -100,
    speed: 0,
    power: 1,
    isPlayer: true,
    active: false,
  }))
}

function initEnemyPool(): Enemy[] {
  return Array.from({ length: POOL_SIZE.enemies }, () => ({
    id: generateId(),
    x: 0,
    y: -100,
    width: 30,
    height: 30,
    speed: 0,
    hp: 1,
    maxHp: 1,
    score: 0,
    type: 'SMALL',
    active: false,
  }))
}

function initParticlePool(): Particle[] {
  return Array.from({ length: POOL_SIZE.particles }, () => ({
    id: generateId(),
    x: 0,
    y: -100,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 30,
    color: '#ff6b6b',
    active: false,
  }))
}

export function initializePlayer(config: GameConfig = defaultConfig): Player {
  return {
    x: config.canvasWidth / 2,
    y: config.canvasHeight - 100,
    width: config.playerWidth,
    height: config.playerHeight,
    speed: 5,
    power: 1,
  }
}

export function initializeGame(config: GameConfig = defaultConfig): AircraftState {
  return {
    player: initializePlayer(config),
    bullets: initBulletPool(),
    enemies: initEnemyPool(),
    powerUps: [],
    particles: initParticlePool(),
    score: 0,
    lives: 3,
    bombs: 3,
    level: 1,
    status: 'IDLE',
    highScore: parseInt(localStorage.getItem('aircraftHighScore') || '0'),
    bulletPoolIndex: 0,
    enemyPoolIndex: 0,
    particlePoolIndex: 0,
  }
}

export function movePlayer(
  state: AircraftState,
  direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN',
  config: GameConfig = defaultConfig
): AircraftState {
  if (state.status !== 'PLAYING') return state

  const player = { ...state.player }
  const speed = player.speed

  switch (direction) {
    case 'LEFT':
      player.x = Math.max(player.width / 2, player.x - speed)
      break
    case 'RIGHT':
      player.x = Math.min(config.canvasWidth - player.width / 2, player.x + speed)
      break
    case 'UP':
      player.y = Math.max(player.height / 2, player.y - speed)
      break
    case 'DOWN':
      player.y = Math.min(config.canvasHeight - player.height / 2, player.y + speed)
      break
  }

  return { ...state, player }
}

// 从对象池获取子弹
function getBulletFromPool(state: AircraftState): { bullet: Bullet; index: number } | null {
  const bullets = state.bullets
  const startIndex = state.bulletPoolIndex
  
  for (let i = 0; i < bullets.length; i++) {
    const index = (startIndex + i) % bullets.length
    if (!bullets[index].active) {
      return { bullet: bullets[index], index }
    }
  }
  return null
}

export function fireBullet(state: AircraftState): AircraftState {
  if (state.status !== 'PLAYING') return state

  const newState = { ...state }
  const { player } = newState

  const bulletConfigs: Array<{ x: number; y: number; power: number }> = []

  if (player.power === 1) {
    bulletConfigs.push({ x: player.x, y: player.y - player.height / 2, power: 1 })
  } else if (player.power === 2) {
    bulletConfigs.push(
      { x: player.x - 15, y: player.y - player.height / 2, power: 1 },
      { x: player.x + 15, y: player.y - player.height / 2, power: 1 }
    )
  } else {
    bulletConfigs.push(
      { x: player.x, y: player.y - player.height / 2 - 10, power: 2 },
      { x: player.x - 20, y: player.y - player.height / 2, power: 1 },
      { x: player.x + 20, y: player.y - player.height / 2, power: 1 }
    )
  }

  bulletConfigs.forEach(config => {
    const poolResult = getBulletFromPool(newState)
    if (poolResult) {
      const bullet = poolResult.bullet
      bullet.x = config.x
      bullet.y = config.y
      bullet.speed = defaultConfig.bulletSpeed
      bullet.power = config.power
      bullet.isPlayer = true
      bullet.active = true
      newState.bulletPoolIndex = (poolResult.index + 1) % newState.bullets.length
    }
  })

  return newState
}

export function useBomb(state: AircraftState): AircraftState {
  if (state.status !== 'PLAYING' || state.bombs <= 0) return state

  const newState = { ...state }
  
  // 消灭所有敌人
  newState.enemies.forEach(enemy => {
    if (enemy.active) {
      createExplosionParticles(newState, enemy.x, enemy.y)
      enemy.active = false
    }
  })

  newState.score += newState.enemies.filter(e => e.active).length * 100
  newState.bombs--

  return newState
}

// 从对象池获取敌人
function getEnemyFromPool(state: AircraftState): { enemy: Enemy; index: number } | null {
  const enemies = state.enemies
  const startIndex = state.enemyPoolIndex
  
  for (let i = 0; i < enemies.length; i++) {
    const index = (startIndex + i) % enemies.length
    if (!enemies[index].active) {
      return { enemy: enemies[index], index }
    }
  }
  return null
}

export function spawnEnemy(state: AircraftState, config: GameConfig = defaultConfig): AircraftState {
  if (state.status !== 'PLAYING') return state

  const poolResult = getEnemyFromPool(state)
  if (!poolResult) return state

  const enemy = poolResult.enemy
  const types: Enemy['type'][] = ['SMALL', 'MEDIUM', 'LARGE']
  const type = types[Math.floor(Math.random() * types.length)]

  switch (type) {
    case 'SMALL':
      enemy.width = 30
      enemy.height = 30
      enemy.speed = 2 + state.level * 0.5
      enemy.hp = 1
      enemy.maxHp = 1
      enemy.score = 100
      break
    case 'MEDIUM':
      enemy.width = 40
      enemy.height = 40
      enemy.speed = 1.5 + state.level * 0.3
      enemy.hp = 3
      enemy.maxHp = 3
      enemy.score = 300
      break
    case 'LARGE':
      enemy.width = 60
      enemy.height = 60
      enemy.speed = 1 + state.level * 0.2
      enemy.hp = 10
      enemy.maxHp = 10
      enemy.score = 1000
      break
  }

  enemy.x = Math.random() * (config.canvasWidth - enemy.width) + enemy.width / 2
  enemy.y = -enemy.height
  enemy.type = type
  enemy.active = true

  return { ...state, enemyPoolIndex: (poolResult.index + 1) % state.enemies.length }
}

export function spawnPowerUp(x: number, y: number): PowerUp {
  const types: PowerUpType[] = ['POWER', 'BOMB', 'LIFE']
  const type = types[Math.floor(Math.random() * types.length)]

  return {
    id: generateId(),
    x,
    y,
    type,
    speed: 2,
    active: true,
  }
}

// 从对象池获取粒子
function getParticleFromPool(state: AircraftState): { particle: Particle; index: number } | null {
  const particles = state.particles
  const startIndex = state.particlePoolIndex
  
  for (let i = 0; i < particles.length; i++) {
    const index = (startIndex + i) % particles.length
    if (!particles[index].active) {
      return { particle: particles[index], index }
    }
  }
  return null
}

function createExplosionParticles(state: AircraftState, x: number, y: number, color: string = '#ff6b6b') {
  const count = 8
  for (let i = 0; i < count; i++) {
    const poolResult = getParticleFromPool(state)
    if (poolResult) {
      const particle = poolResult.particle
      const angle = (Math.PI * 2 * i) / count
      particle.x = x
      particle.y = y
      particle.vx = Math.cos(angle) * 3
      particle.vy = Math.sin(angle) * 3
      particle.life = 30
      particle.maxLife = 30
      particle.color = color
      particle.active = true
      state.particlePoolIndex = (poolResult.index + 1) % state.particles.length
    }
  }
}

// 简化的碰撞检测 - 使用距离检查
function checkCollision(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  const dx = Math.abs(a.x - b.x)
  const dy = Math.abs(a.y - b.y)
  return dx < (a.width + b.width) / 2 && dy < (a.height + b.height) / 2
}

export function gameStep(
  state: AircraftState,
  frameCount: number,
  config: GameConfig = defaultConfig
): AircraftState {
  if (state.status !== 'PLAYING') return state

  const newState = { ...state }

  // 更新子弹位置
  newState.bullets.forEach(bullet => {
    if (bullet.active) {
      bullet.y = bullet.isPlayer ? bullet.y - bullet.speed : bullet.y + bullet.speed
      if (bullet.y < -10 || bullet.y > config.canvasHeight + 10) {
        bullet.active = false
      }
    }
  })

  // 更新敌人位置
  newState.enemies.forEach(enemy => {
    if (enemy.active) {
      enemy.y += enemy.speed
      if (enemy.y > config.canvasHeight + 100) {
        enemy.active = false
      }
      // 敌人发射子弹
      if (Math.random() < 0.005 * state.level) {
        const poolResult = getBulletFromPool(newState)
        if (poolResult) {
          const bullet = poolResult.bullet
          bullet.x = enemy.x
          bullet.y = enemy.y + enemy.height / 2
          bullet.speed = 4
          bullet.power = 1
          bullet.isPlayer = false
          bullet.active = true
          newState.bulletPoolIndex = (poolResult.index + 1) % newState.bullets.length
        }
      }
    }
  })

  // 更新道具位置
  newState.powerUps = newState.powerUps
    .map(p => ({ ...p, y: p.y + p.speed }))
    .filter(p => p.y < config.canvasHeight + 50 && p.active)

  // 更新粒子
  newState.particles.forEach(particle => {
    if (particle.active) {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life--
      if (particle.life <= 0) {
        particle.active = false
      }
    }
  })

  // 碰撞检测 - 玩家子弹击中敌人
  const playerBullets = newState.bullets.filter(b => b.active && b.isPlayer)
  const activeEnemies = newState.enemies.filter(e => e.active)

  for (const bullet of playerBullets) {
    for (const enemy of activeEnemies) {
      if (checkCollision(
        { x: bullet.x, y: bullet.y, width: 4, height: 10 },
        enemy
      )) {
        bullet.active = false
        enemy.hp -= bullet.power
        if (enemy.hp <= 0) {
          enemy.active = false
          newState.score += enemy.score
          createExplosionParticles(newState, enemy.x, enemy.y)
          if (Math.random() < 0.15) {
            newState.powerUps.push(spawnPowerUp(enemy.x, enemy.y))
          }
        }
        break
      }
    }
  }

  // 敌人子弹击中玩家
  const enemyBullets = newState.bullets.filter(b => b.active && !b.isPlayer)
  for (const bullet of enemyBullets) {
    if (checkCollision(
      { x: bullet.x, y: bullet.y, width: 4, height: 10 },
      newState.player
    )) {
      bullet.active = false
      newState.lives--
      createExplosionParticles(newState, newState.player.x, newState.player.y, '#4dabf7')
      if (newState.lives <= 0) {
        newState.status = 'GAME_OVER'
        const newHighScore = Math.max(newState.score, newState.highScore)
        localStorage.setItem('aircraftHighScore', newHighScore.toString())
        newState.highScore = newHighScore
      } else {
        newState.player = initializePlayer(config)
      }
      break
    }
  }

  // 敌人撞击玩家
  for (const enemy of activeEnemies) {
    if (checkCollision(enemy, newState.player)) {
      enemy.active = false
      newState.lives--
      createExplosionParticles(newState, newState.player.x, newState.player.y, '#4dabf7')
      if (newState.lives <= 0) {
        newState.status = 'GAME_OVER'
        const newHighScore = Math.max(newState.score, newState.highScore)
        localStorage.setItem('aircraftHighScore', newHighScore.toString())
        newState.highScore = newHighScore
      } else {
        newState.player = initializePlayer(config)
      }
      break
    }
  }

  // 玩家拾取道具
  newState.powerUps = newState.powerUps.filter(powerUp => {
    if (checkCollision(
      { x: powerUp.x, y: powerUp.y, width: 20, height: 20 },
      newState.player
    )) {
      switch (powerUp.type) {
        case 'POWER':
          newState.player.power = Math.min(3, newState.player.power + 1)
          break
        case 'BOMB':
          newState.bombs = Math.min(5, newState.bombs + 1)
          break
        case 'LIFE':
          newState.lives = Math.min(5, newState.lives + 1)
          break
      }
      return false
    }
    return true
  })

  // 生成敌人
  if (frameCount % Math.max(30, defaultConfig.enemySpawnRate - state.level * 5) === 0) {
    return spawnEnemy(newState, config)
  }

  // 升级
  const newLevel = Math.floor(newState.score / 5000) + 1
  if (newLevel > newState.level) {
    newState.level = newLevel
  }

  return newState
}

export function startGame(state: AircraftState): AircraftState {
  if (state.status === 'GAME_OVER') {
    return {
      ...initializeGame(),
      status: 'PLAYING',
      highScore: state.highScore,
    }
  }
  return { ...state, status: 'PLAYING' }
}

export function togglePause(state: AircraftState): AircraftState {
  if (state.status === 'PLAYING') return { ...state, status: 'PAUSED' }
  if (state.status === 'PAUSED') return { ...state, status: 'PLAYING' }
  return state
}

export function resetGame(state: AircraftState): AircraftState {
  return {
    ...initializeGame(),
    highScore: state.highScore,
  }
}
