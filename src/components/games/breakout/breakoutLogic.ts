/**
 * 打砖块游戏逻辑
 */

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'

export interface Position {
  x: number
  y: number
}

export interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
  speed: number
}

export interface Paddle {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export interface Brick {
  x: number
  y: number
  width: number
  height: number
  color: string
  points: number
  visible: boolean
}

export interface BreakoutGameState {
  ball: Ball
  paddle: Paddle
  bricks: Brick[]
  score: number
  lives: number
  level: number
  status: GameStatus
  highScore: number
}

export interface BreakoutGameConfig {
  canvasWidth: number
  canvasHeight: number
  ballRadius: number
  paddleWidth: number
  paddleHeight: number
  brickRows: number
  brickCols: number
  brickPadding: number
  brickOffsetTop: number
  brickOffsetLeft: number
}

// 游戏配置
export const defaultConfig: BreakoutGameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  ballRadius: 8,
  paddleWidth: 100,
  paddleHeight: 15,
  brickRows: 5,
  brickCols: 8,
  brickPadding: 10,
  brickOffsetTop: 60,
  brickOffsetLeft: 35,
}

// 砖块颜色配置
const BRICK_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']
const BRICK_POINTS = [50, 40, 30, 20, 10]

/**
 * 初始化球
 */
export function initializeBall(config: BreakoutGameConfig = defaultConfig): Ball {
  return {
    x: config.canvasWidth / 2,
    y: config.canvasHeight - 100,
    dx: 4,
    dy: -4,
    radius: config.ballRadius,
    speed: 5,
  }
}

/**
 * 初始化挡板
 */
export function initializePaddle(config: BreakoutGameConfig = defaultConfig): Paddle {
  return {
    x: (config.canvasWidth - config.paddleWidth) / 2,
    y: config.canvasHeight - 30,
    width: config.paddleWidth,
    height: config.paddleHeight,
    speed: 8,
  }
}

/**
 * 创建砖块
 */
export function createBricks(
  level: number = 1,
  config: BreakoutGameConfig = defaultConfig
): Brick[] {
  const bricks: Brick[] = []
  const brickWidth =
    (config.canvasWidth - 2 * config.brickOffsetLeft - (config.brickCols - 1) * config.brickPadding) /
    config.brickCols
  const brickHeight = 20

  for (let row = 0; row < config.brickRows; row++) {
    for (let col = 0; col < config.brickCols; col++) {
      bricks.push({
        x: config.brickOffsetLeft + col * (brickWidth + config.brickPadding),
        y: config.brickOffsetTop + row * (brickHeight + config.brickPadding),
        width: brickWidth,
        height: brickHeight,
        color: BRICK_COLORS[row] || '#3b82f6',
        points: BRICK_POINTS[row] || 10,
        visible: true,
      })
    }
  }

  return bricks
}

/**
 * 初始化游戏状态
 */
export function initializeGame(config: BreakoutGameConfig = defaultConfig): BreakoutGameState {
  return {
    ball: initializeBall(config),
    paddle: initializePaddle(config),
    bricks: createBricks(1, config),
    score: 0,
    lives: 3,
    level: 1,
    status: 'IDLE',
    highScore: parseInt(localStorage.getItem('breakoutHighScore') || '0'),
  }
}

/**
 * 移动挡板
 */
export function movePaddle(
  state: BreakoutGameState,
  direction: 'LEFT' | 'RIGHT',
  config: BreakoutGameConfig = defaultConfig
): BreakoutGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  const newX =
    direction === 'LEFT'
      ? state.paddle.x - state.paddle.speed
      : state.paddle.x + state.paddle.speed

  // 限制挡板在画布内
  const clampedX = Math.max(0, Math.min(newX, config.canvasWidth - state.paddle.width))

  return {
    ...state,
    paddle: { ...state.paddle, x: clampedX },
  }
}

/**
 * 检查球与砖块碰撞
 */
export function checkBrickCollision(ball: Ball, brick: Brick): boolean {
  if (!brick.visible) return false

  return (
    ball.x + ball.radius > brick.x &&
    ball.x - ball.radius < brick.x + brick.width &&
    ball.y + ball.radius > brick.y &&
    ball.y - ball.radius < brick.y + brick.height
  )
}

/**
 * 检查球与挡板碰撞
 */
export function checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
  return (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  )
}

/**
 * 更新球位置
 */
export function updateBall(
  state: BreakoutGameState,
  config: BreakoutGameConfig = defaultConfig
): BreakoutGameState {
  const { ball, paddle, bricks, score, lives } = state

  let newBall = { ...ball }
  let newBricks = [...bricks]
  let newScore = score
  let newLives = lives

  // 更新球位置
  newBall.x += newBall.dx
  newBall.y += newBall.dy

  // 左右墙壁碰撞
  if (newBall.x + newBall.radius > config.canvasWidth || newBall.x - newBall.radius < 0) {
    newBall.dx = -newBall.dx
  }

  // 顶部墙壁碰撞
  if (newBall.y - newBall.radius < 0) {
    newBall.dy = -newBall.dy
  }

  // 底部掉落
  if (newBall.y + newBall.radius > config.canvasHeight) {
    newLives--
    if (newLives <= 0) {
      const newHighScore = Math.max(score, state.highScore)
      localStorage.setItem('breakoutHighScore', newHighScore.toString())
      return {
        ...state,
        lives: 0,
        status: 'GAME_OVER',
        highScore: newHighScore,
      }
    }
    // 重置球位置
    newBall = initializeBall(config)
  }

  // 挡板碰撞
  if (checkPaddleCollision(newBall, paddle)) {
    // 根据击中挡板的位置改变反弹角度
    const hitPoint = (newBall.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2)
    const angle = hitPoint * (Math.PI / 3) // 最大60度角
    const speed = Math.sqrt(newBall.dx * newBall.dx + newBall.dy * newBall.dy)
    newBall.dx = speed * Math.sin(angle)
    newBall.dy = -Math.abs(speed * Math.cos(angle))
  }

  // 砖块碰撞
  for (let i = 0; i < newBricks.length; i++) {
    if (checkBrickCollision(newBall, newBricks[i])) {
      newBricks[i] = { ...newBricks[i], visible: false }
      newScore += newBricks[i].points
      newBall.dy = -newBall.dy
      break // 每帧只处理一个砖块碰撞
    }
  }

  // 检查是否过关
  const remainingBricks = newBricks.filter(b => b.visible).length
  if (remainingBricks === 0) {
    // 进入下一关
    const newLevel = state.level + 1
    return {
      ...state,
      ball: initializeBall(config),
      paddle: initializePaddle(config),
      bricks: createBricks(newLevel, config),
      score: newScore,
      level: newLevel,
    }
  }

  return {
    ...state,
    ball: newBall,
    bricks: newBricks,
    score: newScore,
    lives: newLives,
  }
}

/**
 * 游戏步进
 */
export function gameStep(state: BreakoutGameState): BreakoutGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  return updateBall(state)
}

/**
 * 开始游戏
 */
export function startGame(state: BreakoutGameState): BreakoutGameState {
  if (state.status === 'PLAYING') {
    return state
  }

  if (state.status === 'GAME_OVER') {
    return {
      ...initializeGame(),
      status: 'PLAYING',
      highScore: state.highScore,
    }
  }

  return {
    ...state,
    status: 'PLAYING',
  }
}

/**
 * 暂停游戏
 */
export function pauseGame(state: BreakoutGameState): BreakoutGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  return {
    ...state,
    status: 'PAUSED',
  }
}

/**
 * 继续游戏
 */
export function resumeGame(state: BreakoutGameState): BreakoutGameState {
  if (state.status !== 'PAUSED') {
    return state
  }

  return {
    ...state,
    status: 'PLAYING',
  }
}

/**
 * 重置游戏
 */
export function resetGame(state: BreakoutGameState): BreakoutGameState {
  return {
    ...initializeGame(),
    highScore: state.highScore,
  }
}

/**
 * 切换暂停/继续
 */
export function togglePause(state: BreakoutGameState): BreakoutGameState {
  if (state.status === 'PLAYING') {
    return pauseGame(state)
  } else if (state.status === 'PAUSED') {
    return resumeGame(state)
  }
  return state
}
