import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypeWriterProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  onComplete?: () => void
}

export function TypeWriter({ 
  text, 
  speed = 50, 
  delay = 0, 
  className = '',
  onComplete 
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!isStarted) return

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, isStarted, speed, text, onComplete])

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
      />
    </span>
  )
}
