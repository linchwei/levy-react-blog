/**
 * 贪吃蛇游戏逻辑
 */

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'

export interface Position {
  x: number
  y: number
}

export interface SnakeNode extends Position {
  id: string
}

export type FoodType = 'NORMAL' | 'SPECIAL'

export interface Food extends Position {
  id: string
  type: FoodType
  value: number
}

export interface SnakeGameState {
  snake: SnakeNode[]
  food: Food
  direction: Direction
  nextDirection: Direction
  status: GameStatus
  score: number
  highScore: number
  speed: number
  baseSpeed: number // 用户设置的基础速度
}

export interface SnakeGameConfig {
  gridWidth: number
  gridHeight: number
  initialSpeed: number
  speedIncrement: number
  maxSpeed: number
}

export const defaultConfig: SnakeGameConfig = {
  gridWidth: 20,
  gridHeight: 20,
  initialSpeed: 150,
  speedIncrement: 5,
  maxSpeed: 50,
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * 初始化游戏状态
 */
export function initializeGame(
  config: SnakeGameConfig = defaultConfig
): SnakeGameState {
  const centerX = Math.floor(config.gridWidth / 2)
  const centerY = Math.floor(config.gridHeight / 2)

  const initialSnake: SnakeNode[] = [
    { x: centerX, y: centerY, id: generateId() },
    { x: centerX - 1, y: centerY, id: generateId() },
    { x: centerX - 2, y: centerY, id: generateId() },
  ]

  return {
    snake: initialSnake,
    food: generateFood(initialSnake, config),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    status: 'IDLE',
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    speed: config.initialSpeed,
    baseSpeed: config.initialSpeed,
  }
}

/**
 * 生成食物
 */
export function generateFood(
  snake: SnakeNode[],
  config: SnakeGameConfig = defaultConfig
): Food {
  const occupiedPositions = new Set(snake.map(node => `${node.x},${node.y}`))
  let x: number, y: number

  do {
    x = Math.floor(Math.random() * config.gridWidth)
    y = Math.floor(Math.random() * config.gridHeight)
  } while (occupiedPositions.has(`${x},${y}`))

  // 10% 概率生成特殊食物
  const isSpecial = Math.random() < 0.1

  return {
    x,
    y,
    id: generateId(),
    type: isSpecial ? 'SPECIAL' : 'NORMAL',
    value: isSpecial ? 20 : 10,
  }
}

/**
 * 检查方向是否有效（不能反向移动）
 */
export function isValidDirection(current: Direction, next: Direction): boolean {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  }
  return opposites[current] !== next
}

/**
 * 获取下一个位置
 */
export function getNextPosition(
  head: Position,
  direction: Direction
): Position {
  const moves: Record<Direction, Position> = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
  }

  const move = moves[direction]
  return {
    x: head.x + move.x,
    y: head.y + move.y,
  }
}

/**
 * 检查碰撞
 */
export function checkCollision(
  position: Position,
  snake: SnakeNode[],
  config: SnakeGameConfig = defaultConfig
): boolean {
  // 撞墙
  if (
    position.x < 0 ||
    position.x >= config.gridWidth ||
    position.y < 0 ||
    position.y >= config.gridHeight
  ) {
    return true
  }

  // 撞自己（排除尾巴，因为尾巴会移动）
  const bodyWithoutTail = snake.slice(0, -1)
  return bodyWithoutTail.some(
    node => node.x === position.x && node.y === position.y
  )
}

/**
 * 检查是否吃到食物
 */
export function checkEatFood(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y
}

/**
 * 计算新速度（基于用户设置的基础速度）
 */
export function calculateSpeed(
  score: number,
  baseSpeed: number,
  config: SnakeGameConfig = defaultConfig
): number {
  const speedDecrease = Math.floor(score / 50) * config.speedIncrement
  const newSpeed = baseSpeed - speedDecrease
  return Math.max(newSpeed, config.maxSpeed)
}

/**
 * 设置基础速度
 */
export function setBaseSpeed(
  state: SnakeGameState,
  newBaseSpeed: number
): SnakeGameState {
  return {
    ...state,
    baseSpeed: newBaseSpeed,
    speed: calculateSpeed(state.score, newBaseSpeed),
  }
}

/**
 * 游戏步进（移动一步）
 */
export function gameStep(
  state: SnakeGameState,
  config: SnakeGameConfig = defaultConfig
): SnakeGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  // 更新方向
  const newDirection = state.nextDirection

  // 获取新头部位置
  const newHeadPos = getNextPosition(state.snake[0], newDirection)

  // 检查碰撞
  if (checkCollision(newHeadPos, state.snake, config)) {
    const newHighScore = Math.max(state.score, state.highScore)
    localStorage.setItem('snakeHighScore', newHighScore.toString())
    return {
      ...state,
      status: 'GAME_OVER',
      highScore: newHighScore,
    }
  }

  // 创建新头部
  const newHead: SnakeNode = {
    ...newHeadPos,
    id: generateId(),
  }

  const newSnake = [newHead, ...state.snake]
  let newFood = state.food
  let newScore = state.score
  let newSpeed = state.speed

  // 检查是否吃到食物
  if (checkEatFood(newHead, state.food)) {
    newScore += state.food.value
    newSpeed = calculateSpeed(newScore, state.baseSpeed, config)
    newFood = generateFood(newSnake, config)
  } else {
    // 没吃到食物，移除尾巴
    newSnake.pop()
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    direction: newDirection,
    score: newScore,
    speed: newSpeed,
  }
}

/**
 * 设置方向
 */
export function setDirection(
  state: SnakeGameState,
  direction: Direction
): SnakeGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  if (!isValidDirection(state.direction, direction)) {
    return state
  }

  return {
    ...state,
    nextDirection: direction,
  }
}

/**
 * 开始游戏
 */
export function startGame(state: SnakeGameState): SnakeGameState {
  if (state.status === 'PLAYING') {
    return state
  }

  // 如果游戏结束，重置游戏
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
export function pauseGame(state: SnakeGameState): SnakeGameState {
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
export function resumeGame(state: SnakeGameState): SnakeGameState {
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
export function resetGame(state: SnakeGameState): SnakeGameState {
  return {
    ...initializeGame(),
    highScore: state.highScore,
  }
}

/**
 * 切换暂停/继续
 */
export function togglePause(state: SnakeGameState): SnakeGameState {
  if (state.status === 'PLAYING') {
    return pauseGame(state)
  } else if (state.status === 'PAUSED') {
    return resumeGame(state)
  }
  return state
}
