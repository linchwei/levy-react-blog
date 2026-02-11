/**
 * 弹球游戏逻辑
 */

export type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER'

export interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

export interface Brick {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  points: number
}

export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
}

export interface PinballState {
  ball: Ball
  paddle: Paddle
  bricks: Brick[]
  particles: Particle[]
  score: number
  lives: number
  level: number
  status: GameStatus
  highScore: number
}

export interface GameConfig {
  canvasWidth: number
  canvasHeight: number
  ballRadius: number
  paddleWidth: number
  paddleHeight: number
  brickRows: number
  brickCols: number
}

export const defaultConfig: GameConfig = {
  canvasWidth: 400,
  canvasHeight: 500,
  ballRadius: 6,
  paddleWidth: 80,
  paddleHeight: 10,
  brickRows: 5,
  brickCols: 8,
}

const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function initializeBall(config: GameConfig = defaultConfig): Ball {
  return {
    x: config.canvasWidth / 2,
    y: config.canvasHeight - 50,
    vx: 3,
    vy: -3,
    radius: config.ballRadius,
  }
}

export function initializePaddle(config: GameConfig = defaultConfig): Paddle {
  return {
    x: config.canvasWidth / 2,
    y: config.canvasHeight - 30,
    width: config.paddleWidth,
    height: config.paddleHeight,
  }
}

export function createBricks(level: number, config: GameConfig = defaultConfig): Brick[] {
  const bricks: Brick[] = []
  const brickWidth = (config.canvasWidth - 20) / config.brickCols
  const brickHeight = 20
  const rows = Math.min(config.brickRows + level - 1, 8)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < config.brickCols; col++) {
      bricks.push({
        id: generateId(),
        x: 10 + col * brickWidth + brickWidth / 2,
        y: 50 + row * (brickHeight + 5) + brickHeight / 2,
        width: brickWidth - 4,
        height: brickHeight,
        color: colors[row % colors.length],
        points: (rows - row) * 10,
      })
    }
  }

  return bricks
}

export function initializeGame(config: GameConfig = defaultConfig): PinballState {
  return {
    ball: initializeBall(config),
    paddle: initializePaddle(config),
    bricks: createBricks(1, config),
    particles: [],
    score: 0,
    lives: 3,
    level: 1,
    status: 'IDLE',
    highScore: parseInt(localStorage.getItem('pinballHighScore') || '0'),
  }
}

export function movePaddle(
  state: PinballState,
  direction: 'LEFT' | 'RIGHT',
  config: GameConfig = defaultConfig
): PinballState {
  if (state.status !== 'PLAYING') return state

  const paddle = { ...state.paddle }
  const speed = 8

  if (direction === 'LEFT') {
    paddle.x = Math.max(paddle.width / 2, paddle.x - speed)
  } else {
    paddle.x = Math.min(config.canvasWidth - paddle.width / 2, paddle.x + speed)
  }

  return { ...state, paddle }
}

export function launchBall(state: PinballState): PinballState {
  if (state.status !== 'IDLE') return state
  return { ...state, status: 'PLAYING' }
}

export function createParticles(x: number, y: number, color: string): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6
    particles.push({
      id: generateId(),
      x,
      y,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2,
      life: 20,
      maxLife: 20,
      color,
    })
  }
  return particles
}

export function checkCircleRectCollision(
  circle: { x: number; y: number; radius: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  const closestX = Math.max(rect.x - rect.width / 2, Math.min(circle.x, rect.x + rect.width / 2))
  const closestY = Math.max(rect.y - rect.height / 2, Math.min(circle.y, rect.y + rect.height / 2))
  const distanceX = circle.x - closestX
  const distanceY = circle.y - closestY
  return distanceX * distanceX + distanceY * distanceY < circle.radius * circle.radius
}

export function gameStep(state: PinballState, config: GameConfig = defaultConfig): PinballState {
  if (state.status !== 'PLAYING') return state

  let newState = { ...state }
  let ball = { ...newState.ball }

  // 更新球位置
  ball.x += ball.vx
  ball.y += ball.vy

  // 墙壁碰撞
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= config.canvasWidth) {
    ball.vx = -ball.vx
    ball.x = Math.max(ball.radius, Math.min(config.canvasWidth - ball.radius, ball.x))
  }
  if (ball.y - ball.radius <= 0) {
    ball.vy = -ball.vy
    ball.y = ball.radius
  }

  // 挡板碰撞
  if (
    checkCircleRectCollision(ball, newState.paddle) &&
    ball.vy > 0 &&
    ball.y < newState.paddle.y
  ) {
    ball.vy = -Math.abs(ball.vy)
    // 根据击中位置调整水平速度
    const hitPos = (ball.x - newState.paddle.x) / (newState.paddle.width / 2)
    ball.vx = hitPos * 4
  }

  // 砖块碰撞
  const remainingBricks: Brick[] = []
  let newParticles = [...newState.particles]
  let newScore = newState.score

  for (const brick of newState.bricks) {
    if (checkCircleRectCollision(ball, brick)) {
      ball.vy = -ball.vy
      newScore += brick.points
      newParticles.push(...createParticles(brick.x, brick.y, brick.color))
    } else {
      remainingBricks.push(brick)
    }
  }

  newState.bricks = remainingBricks
  newState.particles = newParticles
  newState.score = newScore

  // 更新粒子
  newState.particles = newState.particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      life: p.life - 1,
    }))
    .filter(p => p.life > 0)

  // 球掉落
  if (ball.y > config.canvasHeight) {
    newState.lives--
    if (newState.lives <= 0) {
      newState.status = 'GAME_OVER'
      const newHighScore = Math.max(newState.score, newState.highScore)
      localStorage.setItem('pinballHighScore', newHighScore.toString())
      newState.highScore = newHighScore
    } else {
      ball = initializeBall(config)
    }
  }

  // 过关
  if (newState.bricks.length === 0) {
    newState.level++
    newState.bricks = createBricks(newState.level, config)
    ball = initializeBall(config)
    newState.status = 'IDLE'
  }

  newState.ball = ball
  return newState
}

export function startGame(state: PinballState): PinballState {
  if (state.status === 'GAME_OVER') {
    return {
      ...initializeGame(),
      status: 'PLAYING',
      highScore: state.highScore,
    }
  }
  return { ...state, status: 'PLAYING' }
}

export function resetGame(state: PinballState): PinballState {
  return {
    ...initializeGame(),
    highScore: state.highScore,
  }
}
