/**
 * 记忆翻牌游戏逻辑
 */

export type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER'
export type CardStatus = 'CLOSED' | 'OPEN' | 'MATCHED'

export interface MemoryCard {
  id: string
  value: string
  status: CardStatus
}

export interface MemoryGameState {
  cards: MemoryCard[]
  flippedCards: string[]
  matchedPairs: number
  totalPairs: number
  moves: number
  score: number
  time: number
  status: GameStatus
  gridSize: { rows: number; cols: number }
}

export interface MemoryGameConfig {
  rows: number
  cols: number
}

// 游戏配置
export const defaultConfig: MemoryGameConfig = {
  rows: 4,
  cols: 4,
}

// 卡片图标池
export const CARD_ICONS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
  '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞',
]

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * 打乱数组（Fisher-Yates算法）
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 创建卡片组
 */
export function createCards(pairCount: number): MemoryCard[] {
  const selectedIcons = CARD_ICONS.slice(0, pairCount)
  const cardPairs = [...selectedIcons, ...selectedIcons]
  const shuffledIcons = shuffleArray(cardPairs)

  return shuffledIcons.map((icon, index) => ({
    id: `card-${index}-${generateId()}`,
    value: icon,
    status: 'CLOSED',
  }))
}

/**
 * 初始化游戏状态
 */
export function initializeGame(config: MemoryGameConfig = defaultConfig): MemoryGameState {
  const totalCards = config.rows * config.cols
  const pairCount = totalCards / 2

  return {
    cards: createCards(pairCount),
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: pairCount,
    moves: 0,
    score: 0,
    time: 0,
    status: 'IDLE',
    gridSize: { rows: config.rows, cols: config.cols },
  }
}

/**
 * 翻转卡片
 */
export function flipCard(state: MemoryGameState, cardId: string): MemoryGameState {
  if (state.status !== 'PLAYING') {
    return state
  }

  // 不能翻转已匹配的卡片
  const card = state.cards.find(c => c.id === cardId)
  if (!card || card.status === 'MATCHED' || card.status === 'OPEN') {
    return state
  }

  // 不能同时翻转超过2张卡片
  if (state.flippedCards.length >= 2) {
    return state
  }

  const newCards = state.cards.map(c =>
    c.id === cardId ? { ...c, status: 'OPEN' as CardStatus } : c
  )

  return {
    ...state,
    cards: newCards,
    flippedCards: [...state.flippedCards, cardId],
  }
}

/**
 * 检查翻转的卡片是否匹配
 */
export function checkMatch(state: MemoryGameState): MemoryGameState {
  if (state.flippedCards.length !== 2) {
    return state
  }

  const [card1Id, card2Id] = state.flippedCards
  const card1 = state.cards.find(c => c.id === card1Id)
  const card2 = state.cards.find(c => c.id === card2Id)

  if (!card1 || !card2) {
    return state
  }

  const newMoves = state.moves + 1

  if (card1.value === card2.value) {
    // 匹配成功
    const newCards = state.cards.map(c =>
      c.id === card1Id || c.id === card2Id
        ? { ...c, status: 'MATCHED' as CardStatus }
        : c
    )
    const newMatchedPairs = state.matchedPairs + 1
    const newScore = state.score + 100 + Math.max(0, 20 - newMoves) * 5

    // 检查是否全部匹配
    if (newMatchedPairs === state.totalPairs) {
      return {
        ...state,
        cards: newCards,
        flippedCards: [],
        matchedPairs: newMatchedPairs,
        moves: newMoves,
        score: newScore,
        status: 'GAME_OVER',
      }
    }

    return {
      ...state,
      cards: newCards,
      flippedCards: [],
      matchedPairs: newMatchedPairs,
      moves: newMoves,
      score: newScore,
    }
  } else {
    // 匹配失败，翻回
    const newCards = state.cards.map(c =>
      c.id === card1Id || c.id === card2Id
        ? { ...c, status: 'CLOSED' as CardStatus }
        : c
    )

    return {
      ...state,
      cards: newCards,
      flippedCards: [],
      moves: newMoves,
    }
  }
}

/**
 * 开始游戏
 */
export function startGame(state: MemoryGameState): MemoryGameState {
  if (state.status === 'PLAYING') {
    return state
  }

  if (state.status === 'GAME_OVER') {
    return {
      ...initializeGame(state.gridSize),
      status: 'PLAYING',
    }
  }

  return {
    ...state,
    status: 'PLAYING',
  }
}

/**
 * 重置游戏
 */
export function resetGame(state: MemoryGameState): MemoryGameState {
  return {
    ...initializeGame(state.gridSize),
  }
}

/**
 * 更新游戏时间
 */
export function updateTime(state: MemoryGameState, time: number): MemoryGameState {
  return {
    ...state,
    time,
  }
}

/**
 * 计算最终得分
 */
export function calculateFinalScore(moves: number, time: number, totalPairs: number): number {
  const baseScore = totalPairs * 100
  const movesBonus = Math.max(0, (totalPairs * 2 - moves) * 10)
  const timeBonus = Math.max(0, 300 - time) * 2
  return baseScore + movesBonus + timeBonus
}
