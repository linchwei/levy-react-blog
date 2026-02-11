import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Bomb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  initializeGame,
  movePlayer,
  fireBullet,
  useBomb,
  gameStep,
  startGame,
  resetGame,
  togglePause,
  defaultConfig,
  type AircraftState,
} from './aircraftLogic'

interface AircraftGameProps {
  onScoreChange?: (score: number) => void
  onGameOver?: (score: number) => void
}

export function AircraftGame({ onScoreChange, onGameOver }: AircraftGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [uiState, setUiState] = useState<AircraftState>(() => initializeGame())
  const gameStateRef = useRef<AircraftState>(initializeGame())
  const rafRef = useRef<number | null>(null)
  const keysRef = useRef<Record<string, boolean>>({})
  const frameCountRef = useRef(0)

  const canvasWidth = defaultConfig.canvasWidth
  const canvasHeight = defaultConfig.canvasHeight

  // 绘制函数 - 使用 ref 避免闭包问题
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current

    // 清空画布 - 深空背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    gradient.addColorStop(0, '#0a0a1a')
    gradient.addColorStop(1, '#1a1a3a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 绘制星空背景 - 带闪烁效果
    for (let i = 0; i < 80; i++) {
      const x = (i * 37 + frameCountRef.current * 0.3) % canvasWidth
      const y = (i * 23 + frameCountRef.current * 0.2) % canvasHeight
      const size = (i % 3) + 1
      const alpha = 0.3 + (Math.sin(frameCountRef.current * 0.1 + i) + 1) * 0.35
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
      ctx.fill()
    }

    // 绘制玩家战机 - F-22 猛禽风格战斗机
    const player = state.player
    const px = player.x
    const py = player.y
    const pw = player.width
    const ph = player.height

    // 战机主体颜色
    const bodyColor = '#64748b'
    const darkColor = '#334155'
    const lightColor = '#94a3b8'

    // 1. 左机翼（后掠翼）
    ctx.fillStyle = bodyColor
    ctx.beginPath()
    ctx.moveTo(px - pw * 0.15, py + ph * 0.1) // 翼根
    ctx.lineTo(px - pw * 0.5, py + ph * 0.3) // 翼尖后
    ctx.lineTo(px - pw * 0.45, py + ph * 0.45) // 翼尖
    ctx.lineTo(px - pw * 0.1, py + ph * 0.25) // 翼根前
    ctx.closePath()
    ctx.fill()

    // 2. 右机翼（后掠翼）
    ctx.beginPath()
    ctx.moveTo(px + pw * 0.15, py + ph * 0.1) // 翼根
    ctx.lineTo(px + pw * 0.5, py + ph * 0.3) // 翼尖后
    ctx.lineTo(px + pw * 0.45, py + ph * 0.45) // 翼尖
    ctx.lineTo(px + pw * 0.1, py + ph * 0.25) // 翼根前
    ctx.closePath()
    ctx.fill()

    // 3. 水平尾翼（左侧）
    ctx.fillStyle = darkColor
    ctx.beginPath()
    ctx.moveTo(px - pw * 0.12, py + ph * 0.35)
    ctx.lineTo(px - pw * 0.35, py + ph * 0.5)
    ctx.lineTo(px - pw * 0.3, py + ph * 0.55)
    ctx.lineTo(px - pw * 0.08, py + ph * 0.42)
    ctx.closePath()
    ctx.fill()

    // 4. 水平尾翼（右侧）
    ctx.beginPath()
    ctx.moveTo(px + pw * 0.12, py + ph * 0.35)
    ctx.lineTo(px + pw * 0.35, py + ph * 0.5)
    ctx.lineTo(px + pw * 0.3, py + ph * 0.55)
    ctx.lineTo(px + pw * 0.08, py + ph * 0.42)
    ctx.closePath()
    ctx.fill()

    // 5. 垂直尾翼（左侧）
    ctx.fillStyle = bodyColor
    ctx.beginPath()
    ctx.moveTo(px - pw * 0.08, py + ph * 0.15)
    ctx.lineTo(px - pw * 0.2, py - ph * 0.1)
    ctx.lineTo(px - pw * 0.12, py - ph * 0.05)
    ctx.lineTo(px - pw * 0.05, py + ph * 0.2)
    ctx.closePath()
    ctx.fill()

    // 6. 垂直尾翼（右侧）
    ctx.beginPath()
    ctx.moveTo(px + pw * 0.08, py + ph * 0.15)
    ctx.lineTo(px + pw * 0.2, py - ph * 0.1)
    ctx.lineTo(px + pw * 0.12, py - ph * 0.05)
    ctx.lineTo(px + pw * 0.05, py + ph * 0.2)
    ctx.closePath()
    ctx.fill()

    // 7. 机身主体
    const bodyGradient = ctx.createLinearGradient(
      px - pw * 0.15,
      py,
      px + pw * 0.15,
      py
    )
    bodyGradient.addColorStop(0, darkColor)
    bodyGradient.addColorStop(0.5, lightColor)
    bodyGradient.addColorStop(1, darkColor)
    ctx.fillStyle = bodyGradient
    ctx.beginPath()
    ctx.moveTo(px, py - ph * 0.45) // 机头
    ctx.lineTo(px + pw * 0.15, py + ph * 0.1) // 机身右侧
    ctx.lineTo(px + pw * 0.12, py + ph * 0.4) // 机尾右侧
    ctx.lineTo(px, py + ph * 0.48) // 尾喷口中心
    ctx.lineTo(px - pw * 0.12, py + ph * 0.4) // 机尾左侧
    ctx.lineTo(px - pw * 0.15, py + ph * 0.1) // 机身左侧
    ctx.closePath()
    ctx.fill()

    // 8. 机头雷达罩
    ctx.fillStyle = '#475569'
    ctx.beginPath()
    ctx.moveTo(px, py - ph * 0.45)
    ctx.lineTo(px + pw * 0.08, py - ph * 0.25)
    ctx.lineTo(px, py - ph * 0.2)
    ctx.lineTo(px - pw * 0.08, py - ph * 0.25)
    ctx.closePath()
    ctx.fill()

    // 9. 驾驶舱
    ctx.fillStyle = '#0ea5e9'
    ctx.beginPath()
    ctx.moveTo(px, py - ph * 0.25)
    ctx.lineTo(px + pw * 0.06, py - ph * 0.05)
    ctx.lineTo(px, py)
    ctx.lineTo(px - pw * 0.06, py - ph * 0.05)
    ctx.closePath()
    ctx.fill()
    // 驾驶舱高光
    ctx.fillStyle = '#7dd3fc'
    ctx.beginPath()
    ctx.moveTo(px, py - ph * 0.22)
    ctx.lineTo(px + pw * 0.03, py - ph * 0.1)
    ctx.lineTo(px, py - ph * 0.08)
    ctx.lineTo(px - pw * 0.03, py - ph * 0.1)
    ctx.closePath()
    ctx.fill()

    // 10. 发动机喷口（双发）
    const flameOffset = Math.sin(frameCountRef.current * 0.8) * 3
    // 左发喷口
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.ellipse(
      px - pw * 0.06,
      py + ph * 0.46,
      pw * 0.04,
      ph * 0.03,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()
    // 左发火焰
    const leftFlame = ctx.createLinearGradient(
      px - pw * 0.06,
      py + ph * 0.48,
      px - pw * 0.06,
      py + ph * 0.75 + flameOffset
    )
    leftFlame.addColorStop(0, '#fbbf24')
    leftFlame.addColorStop(0.3, '#f97316')
    leftFlame.addColorStop(0.7, '#ef4444')
    leftFlame.addColorStop(1, 'rgba(239, 68, 68, 0)')
    ctx.fillStyle = leftFlame
    ctx.beginPath()
    ctx.moveTo(px - pw * 0.09, py + ph * 0.48)
    ctx.lineTo(px - pw * 0.06, py + ph * 0.75 + flameOffset)
    ctx.lineTo(px - pw * 0.03, py + ph * 0.48)
    ctx.closePath()
    ctx.fill()

    // 右发喷口
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.ellipse(
      px + pw * 0.06,
      py + ph * 0.46,
      pw * 0.04,
      ph * 0.03,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()
    // 右发火焰
    const rightFlame = ctx.createLinearGradient(
      px + pw * 0.06,
      py + ph * 0.48,
      px + pw * 0.06,
      py + ph * 0.75 - flameOffset
    )
    rightFlame.addColorStop(0, '#fbbf24')
    rightFlame.addColorStop(0.3, '#f97316')
    rightFlame.addColorStop(0.7, '#ef4444')
    rightFlame.addColorStop(1, 'rgba(239, 68, 68, 0)')
    ctx.fillStyle = rightFlame
    ctx.beginPath()
    ctx.moveTo(px + pw * 0.03, py + ph * 0.48)
    ctx.lineTo(px + pw * 0.06, py + ph * 0.75 - flameOffset)
    ctx.lineTo(px + pw * 0.09, py + ph * 0.48)
    ctx.closePath()
    ctx.fill()

    // 11. 机身细节线条
    ctx.strokeStyle = lightColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(px, py - ph * 0.2)
    ctx.lineTo(px, py + ph * 0.4)
    ctx.stroke()

    // 绘制子弹 - 发光效果
    state.bullets.forEach(bullet => {
      if (!bullet.active) return

      if (bullet.isPlayer) {
        // 玩家子弹 - 黄色激光
        ctx.shadowBlur = 10
        ctx.shadowColor = '#fbbf24'
        ctx.fillStyle = '#fef3c7'
        ctx.fillRect(bullet.x - 2, bullet.y - 8, 4, 16)
        ctx.shadowBlur = 0
      } else {
        // 敌人子弹 - 红色
        ctx.shadowBlur = 8
        ctx.shadowColor = '#ef4444'
        ctx.fillStyle = '#fca5a5'
        ctx.beginPath()
        ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    })

    // 绘制敌人 - 真实飞机设计
    state.enemies.forEach(enemy => {
      if (!enemy.active) return

      const ex = enemy.x
      const ey = enemy.y
      const ew = enemy.width
      const eh = enemy.height
      const hpRatio = enemy.hp / enemy.maxHp

      if (enemy.type === 'SMALL') {
        // 小型敌机 - 米格风格轻型战机（红色）
        const bodyColor = '#dc2626'
        const darkColor = '#991b1b'
        const lightColor = '#ef4444'

        // 主机翼（前掠翼）
        ctx.fillStyle = bodyColor
        ctx.beginPath()
        ctx.moveTo(ex - ew * 0.1, ey - eh * 0.1)
        ctx.lineTo(ex - ew * 0.5, ey + eh * 0.2)
        ctx.lineTo(ex - ew * 0.4, ey + eh * 0.35)
        ctx.lineTo(ex - ew * 0.08, ey + eh * 0.15)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(ex + ew * 0.1, ey - eh * 0.1)
        ctx.lineTo(ex + ew * 0.5, ey + eh * 0.2)
        ctx.lineTo(ex + ew * 0.4, ey + eh * 0.35)
        ctx.lineTo(ex + ew * 0.08, ey + eh * 0.15)
        ctx.closePath()
        ctx.fill()

        // 机身
        const bodyGradient = ctx.createLinearGradient(
          ex - ew * 0.1,
          ey,
          ex + ew * 0.1,
          ey
        )
        bodyGradient.addColorStop(0, darkColor)
        bodyGradient.addColorStop(0.5, lightColor)
        bodyGradient.addColorStop(1, darkColor)
        ctx.fillStyle = bodyGradient
        ctx.beginPath()
        ctx.moveTo(ex, ey + eh * 0.4)
        ctx.lineTo(ex + ew * 0.1, ey - eh * 0.1)
        ctx.lineTo(ex, ey - eh * 0.4)
        ctx.lineTo(ex - ew * 0.1, ey - eh * 0.1)
        ctx.closePath()
        ctx.fill()

        // 驾驶舱
        ctx.fillStyle = '#1e3a5f'
        ctx.beginPath()
        ctx.moveTo(ex, ey - eh * 0.1)
        ctx.lineTo(ex + ew * 0.04, ey + eh * 0.1)
        ctx.lineTo(ex, ey + eh * 0.15)
        ctx.lineTo(ex - ew * 0.04, ey + eh * 0.1)
        ctx.closePath()
        ctx.fill()

        // 尾喷口火焰
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.moveTo(ex - ew * 0.03, ey + eh * 0.4)
        ctx.lineTo(ex, ey + eh * 0.6)
        ctx.lineTo(ex + ew * 0.03, ey + eh * 0.4)
        ctx.closePath()
        ctx.fill()
      } else if (enemy.type === 'MEDIUM') {
        // 中型敌机 - F-16风格战机（橙色）
        const bodyColor = '#ea580c'
        const darkColor = '#9a3412'
        const lightColor = '#fb923c'

        // 主翼（梯形翼）
        ctx.fillStyle = bodyColor
        ctx.beginPath()
        ctx.moveTo(ex - ew * 0.12, ey + eh * 0.05)
        ctx.lineTo(ex - ew * 0.45, ey + eh * 0.25)
        ctx.lineTo(ex - ew * 0.35, ey + eh * 0.4)
        ctx.lineTo(ex - ew * 0.08, ey + eh * 0.2)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(ex + ew * 0.12, ey + eh * 0.05)
        ctx.lineTo(ex + ew * 0.45, ey + eh * 0.25)
        ctx.lineTo(ex + ew * 0.35, ey + eh * 0.4)
        ctx.lineTo(ex + ew * 0.08, ey + eh * 0.2)
        ctx.closePath()
        ctx.fill()

        // 水平尾翼
        ctx.fillStyle = darkColor
        ctx.beginPath()
        ctx.moveTo(ex - ew * 0.1, ey + eh * 0.25)
        ctx.lineTo(ex - ew * 0.3, ey + eh * 0.4)
        ctx.lineTo(ex - ew * 0.25, ey + eh * 0.45)
        ctx.lineTo(ex - ew * 0.06, ey + eh * 0.32)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(ex + ew * 0.1, ey + eh * 0.25)
        ctx.lineTo(ex + ew * 0.3, ey + eh * 0.4)
        ctx.lineTo(ex + ew * 0.25, ey + eh * 0.45)
        ctx.lineTo(ex + ew * 0.06, ey + eh * 0.32)
        ctx.closePath()
        ctx.fill()

        // 机身
        const bodyGradient = ctx.createLinearGradient(
          ex - ew * 0.12,
          ey,
          ex + ew * 0.12,
          ey
        )
        bodyGradient.addColorStop(0, darkColor)
        bodyGradient.addColorStop(0.5, lightColor)
        bodyGradient.addColorStop(1, darkColor)
        ctx.fillStyle = bodyGradient
        ctx.beginPath()
        ctx.moveTo(ex, ey + eh * 0.45)
        ctx.lineTo(ex + ew * 0.12, ey + eh * 0.05)
        ctx.lineTo(ex, ey - eh * 0.35)
        ctx.lineTo(ex - ew * 0.12, ey + eh * 0.05)
        ctx.closePath()
        ctx.fill()

        // 驾驶舱
        ctx.fillStyle = '#0ea5e9'
        ctx.beginPath()
        ctx.moveTo(ex, ey - eh * 0.05)
        ctx.lineTo(ex + ew * 0.05, ey + eh * 0.15)
        ctx.lineTo(ex, ey + eh * 0.2)
        ctx.lineTo(ex - ew * 0.05, ey + eh * 0.15)
        ctx.closePath()
        ctx.fill()

        // 双发尾焰
        ctx.fillStyle = '#f97316'
        ctx.beginPath()
        ctx.moveTo(ex - ew * 0.05, ey + eh * 0.45)
        ctx.lineTo(ex - ew * 0.02, ey + eh * 0.65)
        ctx.lineTo(ex + ew * 0.01, ey + eh * 0.45)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(ex + ew * 0.01, ey + eh * 0.45)
        ctx.lineTo(ex + ew * 0.04, ey + eh * 0.65)
        ctx.lineTo(ex + ew * 0.07, ey + eh * 0.45)
        ctx.closePath()
        ctx.fill()
      } else {
        // 大型敌机 - B-2幽灵风格轰炸机（紫色）
        const darkColor = '#5b21b6'
        const lightColor = '#a78bfa'

        // 飞翼机身（三角形）
        const wingGradient = ctx.createLinearGradient(
          ex,
          ey - eh * 0.4,
          ex,
          ey + eh * 0.4
        )
        wingGradient.addColorStop(0, darkColor)
        wingGradient.addColorStop(0.5, lightColor)
        wingGradient.addColorStop(1, darkColor)
        ctx.fillStyle = wingGradient
        ctx.beginPath()
        ctx.moveTo(ex, ey - eh * 0.4)
        ctx.lineTo(ex + ew * 0.5, ey + eh * 0.3)
        ctx.lineTo(ex + ew * 0.3, ey + eh * 0.4)
        ctx.lineTo(ex, ey + eh * 0.35)
        ctx.lineTo(ex - ew * 0.3, ey + eh * 0.4)
        ctx.lineTo(ex - ew * 0.5, ey + eh * 0.3)
        ctx.closePath()
        ctx.fill()

        // 机身中线装饰
        ctx.strokeStyle = darkColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(ex, ey - eh * 0.3)
        ctx.lineTo(ex, ey + eh * 0.3)
        ctx.stroke()

        // 驾驶舱区域
        ctx.fillStyle = '#1e3a5f'
        ctx.beginPath()
        ctx.moveTo(ex, ey - eh * 0.25)
        ctx.lineTo(ex + ew * 0.08, ey - eh * 0.05)
        ctx.lineTo(ex, ey + eh * 0.05)
        ctx.lineTo(ex - ew * 0.08, ey - eh * 0.05)
        ctx.closePath()
        ctx.fill()

        // 四个发动机喷口
        const flamePositions = [
          { x: -0.25, y: 0.35 },
          { x: -0.08, y: 0.38 },
          { x: 0.08, y: 0.38 },
          { x: 0.25, y: 0.35 },
        ]

        flamePositions.forEach(pos => {
          ctx.fillStyle = '#fbbf24'
          ctx.beginPath()
          ctx.moveTo(ex + ew * pos.x - ew * 0.02, ey + eh * pos.y)
          ctx.lineTo(ex + ew * pos.x, ey + eh * (pos.y + 0.2))
          ctx.lineTo(ex + ew * pos.x + ew * 0.02, ey + eh * pos.y)
          ctx.closePath()
          ctx.fill()
        })
      }

      // 血条背景
      ctx.fillStyle = '#374151'
      ctx.fillRect(ex - ew / 2, ey - eh / 2 - 12, ew, 4)
      // 血条
      ctx.fillStyle =
        hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#eab308' : '#ef4444'
      ctx.fillRect(ex - ew / 2, ey - eh / 2 - 12, ew * hpRatio, 4)
    })

    // 绘制道具 - 发光效果
    state.powerUps.forEach(powerUp => {
      if (!powerUp.active) return

      const colors = {
        POWER: { bg: '#fbbf24', glow: '#f59e0b' },
        BOMB: { bg: '#ef4444', glow: '#dc2626' },
        LIFE: { bg: '#22c55e', glow: '#16a34a' },
      }
      const color = colors[powerUp.type]

      // 发光效果
      ctx.shadowBlur = 15
      ctx.shadowColor = color.glow
      ctx.fillStyle = color.bg
      ctx.beginPath()
      ctx.arc(powerUp.x, powerUp.y, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // 内部白色圆圈
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(powerUp.x, powerUp.y, 8, 0, Math.PI * 2)
      ctx.fill()

      // 文字
      ctx.fillStyle = color.glow
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const texts = { POWER: 'P', BOMB: 'B', LIFE: 'L' }
      ctx.fillText(texts[powerUp.type], powerUp.x, powerUp.y)
    })

    // 绘制粒子 - 发光效果
    state.particles.forEach(particle => {
      if (!particle.active) return
      const alpha = particle.life / particle.maxLife
      ctx.globalAlpha = alpha
      ctx.shadowBlur = 10
      ctx.shadowColor = particle.color
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    })
  }, [])

  // 游戏循环
  useEffect(() => {
    if (uiState.status !== 'PLAYING') {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      draw()
      return
    }

    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastTime >= frameInterval) {
        lastTime = timestamp
        frameCountRef.current++

        // 更新游戏状态
        let newState = gameStateRef.current

        // 处理玩家移动
        if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
          newState = movePlayer(newState, 'LEFT')
        }
        if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
          newState = movePlayer(newState, 'RIGHT')
        }
        if (keysRef.current['ArrowUp'] || keysRef.current['w']) {
          newState = movePlayer(newState, 'UP')
        }
        if (keysRef.current['ArrowDown'] || keysRef.current['s']) {
          newState = movePlayer(newState, 'DOWN')
        }

        // 自动发射子弹（每15帧发射一次）
        if (frameCountRef.current % 15 === 0) {
          newState = fireBullet(newState)
        }

        // 游戏步进
        newState = gameStep(newState, frameCountRef.current)

        // 更新 ref
        gameStateRef.current = newState

        // 每5帧更新一次 UI
        if (frameCountRef.current % 5 === 0) {
          setUiState(newState)
          if (newState.score !== uiState.score) {
            onScoreChange?.(newState.score)
          }
          if (
            newState.status === 'GAME_OVER' &&
            uiState.status !== 'GAME_OVER'
          ) {
            onGameOver?.(newState.score)
          }
        }

        // 绘制
        draw()
      }

      rafRef.current = requestAnimationFrame(gameLoop)
    }

    rafRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [uiState.status, uiState.score, onScoreChange, onGameOver, draw])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
      if (e.key === ' ') {
        e.preventDefault()
        if (gameStateRef.current.status === 'IDLE') {
          gameStateRef.current = startGame(gameStateRef.current)
          setUiState(gameStateRef.current)
        } else if (gameStateRef.current.status === 'PLAYING') {
          gameStateRef.current = fireBullet(gameStateRef.current)
        }
      }
      if (e.key === 'b' || e.key === 'B') {
        gameStateRef.current = useBomb(gameStateRef.current)
        setUiState(gameStateRef.current)
      }
      if (e.key === 'p' || e.key === 'P') {
        gameStateRef.current = togglePause(gameStateRef.current)
        setUiState(gameStateRef.current)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleStart = () => {
    gameStateRef.current = startGame(gameStateRef.current)
    setUiState(gameStateRef.current)
  }

  const handleReset = () => {
    gameStateRef.current = resetGame(gameStateRef.current)
    setUiState(gameStateRef.current)
  }

  const handlePauseToggle = () => {
    gameStateRef.current = togglePause(gameStateRef.current)
    setUiState(gameStateRef.current)
  }

  const handleBomb = () => {
    gameStateRef.current = useBomb(gameStateRef.current)
    setUiState(gameStateRef.current)
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          飞机大战
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">最高分: {uiState.highScore}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 游戏信息 */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">分数</p>
            <p className="text-xl font-bold">{uiState.score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">生命</p>
            <p className="text-xl font-bold">{'❤️'.repeat(uiState.lives)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">炸弹</p>
            <p className="text-xl font-bold">{'💣'.repeat(uiState.bombs)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">等级</p>
            <p className="text-xl font-bold">{uiState.level}</p>
          </div>
        </div>

        {/* 游戏画布 */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="border-2 border-border rounded-lg"
            />

            {/* 游戏状态覆盖层 */}
            {uiState.status !== 'PLAYING' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg"
              >
                {uiState.status === 'IDLE' && (
                  <>
                    <p className="text-lg font-medium mb-4">准备好了吗？</p>
                    <Button onClick={handleStart} size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      开始游戏
                    </Button>
                  </>
                )}
                {uiState.status === 'PAUSED' && (
                  <>
                    <p className="text-lg font-medium mb-4">游戏暂停</p>
                    <Button onClick={handlePauseToggle} size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      继续游戏
                    </Button>
                  </>
                )}
                {uiState.status === 'GAME_OVER' && (
                  <>
                    <p className="text-2xl font-bold text-destructive mb-2">
                      游戏结束
                    </p>
                    <p className="text-lg mb-4">最终得分: {uiState.score}</p>
                    <Button onClick={handleStart} size="lg">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      再来一局
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap justify-center gap-2">
          {uiState.status === 'PLAYING' ? (
            <Button variant="outline" onClick={handlePauseToggle}>
              <Pause className="w-4 h-4 mr-2" />
              暂停
            </Button>
          ) : (
            <Button onClick={handleStart}>
              <Play className="w-4 h-4 mr-2" />
              {uiState.status === 'GAME_OVER' ? '再来一局' : '开始'}
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button
            variant="outline"
            onClick={handleBomb}
            disabled={uiState.status !== 'PLAYING' || uiState.bombs <= 0}
          >
            <Bomb className="w-4 h-4 mr-2" />
            炸弹 ({uiState.bombs})
          </Button>
        </div>

        {/* 操作说明 */}
        <div className="text-sm text-muted-foreground text-center">
          <p>WASD/方向键移动 | 空格发射 | B使用炸弹 | P暂停</p>
          <p className="mt-1">拾取道具: P火力 B炸弹 L生命</p>
        </div>
      </CardContent>
    </Card>
  )
}
