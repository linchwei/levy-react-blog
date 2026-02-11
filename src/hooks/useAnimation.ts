import { useState, useCallback, useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'
import type { AnimationConfig } from '@/types'

export function useAnimatedCounter(
  end: number,
  duration: number = 2000,
  start: boolean = true
): number {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    if (!start || isAnimatingRef.current) {
      return
    }

    isAnimatingRef.current = true
    let canceled = false

    const animateFrame = (currentTimestamp: number) => {
      if (canceled) return

      const startTime = currentTimestamp
      const runAnimation = (ts: number) => {
        if (canceled) return

        const elapsed = ts - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutExpo = 1 - Math.pow(2, -10 * progress)
        const currentCount = Math.floor(easeOutExpo * end)

        setCount(currentCount)

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(runAnimation)
        } else {
          isAnimatingRef.current = false
        }
      }

      rafRef.current = requestAnimationFrame(runAnimation)
    }

    rafRef.current = requestAnimationFrame(animateFrame)

    return () => {
      canceled = true
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      isAnimatingRef.current = false
    }
  }, [end, duration, start])

  return count
}

export function useViewportAnimation<
  T extends HTMLElement = HTMLDivElement,
>(options?: {
  once?: boolean
  margin?: string
  amount?: 'some' | 'all' | number
}): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: (options?.margin as `${number}px` | undefined) ?? '-50px',
    amount: options?.amount ?? 'some',
  })

  return [ref, isInView]
}

export function useStaggerAnimation(
  _itemCount: number,
  baseDelay: number = 0.05
): { getDelay: (index: number) => number } {
  const getDelay = useCallback(
    (index: number) => baseDelay * index,
    [baseDelay]
  )

  return { getDelay }
}

export function useAnimationSequence(
  steps: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config?: AnimationConfig
): {
  currentStep: number
  next: () => void
  reset: () => void
  isComplete: boolean
} {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const next = useCallback(() => {
    setCurrentStep(prev => {
      const nextStep = prev + 1
      if (nextStep >= steps) {
        setIsComplete(true)
        return prev
      }
      return nextStep
    })
  }, [steps])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsComplete(false)
  }, [])

  return { currentStep, next, reset, isComplete }
}

export function usePulseAnimation(config?: AnimationConfig): {
  scale: number
  isPulsing: boolean
  trigger: () => void
} {
  const [scale, setScale] = useState(1)
  const [isPulsing, setIsPulsing] = useState(false)

  const trigger = useCallback(() => {
    if (isPulsing) return

    setIsPulsing(true)
    const duration = config?.duration ?? 300

    setScale(1.1)

    setTimeout(() => {
      setScale(1)
      setIsPulsing(false)
    }, duration)
  }, [config?.duration, isPulsing])

  return { scale, isPulsing, trigger }
}
