import { useEffect, useRef } from 'react'

interface Skill {
  name: string
  level: number
}

interface SkillRadarProps {
  skills: Skill[]
  isDark: boolean
}

export function SkillRadar({ skills, isDark }: SkillRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const size = 300
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.35

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    const numSkills = skills.length
    const angleStep = (Math.PI * 2) / numSkills

    // Colors
    const gridColor = isDark ? 'rgba(0, 245, 255, 0.2)' : 'rgba(0, 102, 255, 0.15)'
    const lineColor = isDark ? 'rgba(0, 245, 255, 0.5)' : 'rgba(0, 102, 255, 0.4)'
    const fillColor = isDark ? 'rgba(0, 245, 255, 0.25)' : 'rgba(0, 102, 255, 0.2)'
    const textColor = isDark ? '#00f5ff' : '#0066ff'
    const glowColor = isDark ? '#00f5ff' : '#0066ff'

    // Draw grid circles
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2)
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw axis lines
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw skill labels
      const labelX = centerX + Math.cos(angle) * (radius + 30)
      const labelY = centerY + Math.sin(angle) * (radius + 30)

      ctx.font = '12px sans-serif'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(skills[i].name, labelX, labelY)

      // Draw level text
      const levelX = centerX + Math.cos(angle) * (radius + 45)
      const levelY = centerY + Math.sin(angle) * (radius + 45)
      ctx.font = 'bold 11px sans-serif'
      ctx.fillStyle = isDark ? '#b829f7' : '#7c3aed'
      ctx.fillText(`${skills[i].level}%`, levelX, levelY)
    }

    // Draw data polygon
    ctx.beginPath()
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = skills[i].level / 100
      const x = centerX + Math.cos(angle) * radius * value
      const y = centerY + Math.sin(angle) * radius * value

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()

    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, fillColor)
    gradient.addColorStop(1, isDark ? 'rgba(184, 41, 247, 0.1)' : 'rgba(124, 58, 237, 0.1)')
    ctx.fillStyle = gradient
    ctx.fill()

    // Stroke with glow
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw glow effect
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 20
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw data points
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = skills[i].level / 100
      const x = centerX + Math.cos(angle) * radius * value
      const y = centerY + Math.sin(angle) * radius * value

      // Outer glow
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = glowColor + '40'
      ctx.fill()

      // Inner point
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = glowColor
      ctx.fill()
    }
  }, [skills, isDark])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[300px] h-auto"
        style={{ filter: isDark ? 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.3))' : 'drop-shadow(0 0 20px rgba(0, 102, 255, 0.2))' }}
      />
    </div>
  )
}
