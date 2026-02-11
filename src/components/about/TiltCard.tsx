import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  isDark: boolean
  glowColor?: string
}

export function TiltCard({ children, className, isDark, glowColor = '#00f5ff' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn('relative rounded-2xl transition-all duration-300', className)}
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, ${glowColor}30, transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Card content */}
      <div
        className={cn(
          'relative h-full rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden',
          isDark
            ? 'bg-white/5 border-white/10 hover:border-white/20'
            : 'bg-white/80 border-white/50 hover:border-white/80 shadow-lg'
        )}
        style={{ transform: 'translateZ(30px)' }}
      >
        {children}
      </div>

      {/* Shine effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)'} 45%, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)'} 50%, transparent 55%)`,
          transform: `translateX(${x.get() * 100}%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
    </motion.div>
  )
}
