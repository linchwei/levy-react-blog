import { useEffect, useRef } from 'react'

interface Skill {
  name: string
  level: number
  category?: string
  description?: string
}

interface SkillRadarChartProps {
  skills: Skill[]
  isDark?: boolean
}

export function SkillRadarChart({ skills, isDark = true }: SkillRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const size = 400
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.35

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Take first 6 skills or pad with defaults
    const displaySkills = skills.slice(0, 6)
    while (displaySkills.length < 6) {
      displaySkills.push({ name: 'Skill', level: 0 })
    }

    const numSkills = 6
    const angleStep = (Math.PI * 2) / numSkills

    // Colors based on theme
    const gridColor = isDark ? 'rgba(0, 245, 255, 0.2)' : 'rgba(0, 102, 255, 0.15)'
    const lineColor = isDark ? '#00f5ff' : '#0066ff'
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

    // Draw axis lines and labels
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Axis line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      ctx.stroke()

      // Label
      const labelX = centerX + Math.cos(angle) * (radius + 40)
      const labelY = centerY + Math.sin(angle) * (radius + 40)

      ctx.font = 'bold 13px sans-serif'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(displaySkills[i].name, labelX, labelY)

      // Level text
      const levelX = centerX + Math.cos(angle) * (radius + 55)
      const levelY = centerY + Math.sin(angle) * (radius + 55)
      ctx.font = '11px sans-serif'
      ctx.fillStyle = isDark ? '#b829f7' : '#7c3aed'
      ctx.fillText(`${displaySkills[i].level}%`, levelX, levelY)
    }

    // Draw data polygon
    ctx.beginPath()
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = displaySkills[i].level / 100
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
    ctx.lineWidth = 3
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 15
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw data points
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = displaySkills[i].level / 100
      const x = centerX + Math.cos(angle) * radius * value
      const y = centerY + Math.sin(angle) * radius * value

      // Outer glow
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fillStyle = glowColor + '40'
      ctx.fill()

      // Inner point
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = glowColor
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0
    }
  }, [skills, isDark])

  return (
    <div className="relative w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[400px] h-auto"
        style={{ 
          filter: isDark 
            ? 'drop-shadow(0 0 30px rgba(0, 245, 255, 0.3))' 
            : 'drop-shadow(0 0 30px rgba(0, 102, 255, 0.2))' 
        }}
      />
    </div>
  )
}
