import { useRef, useEffect } from 'react'

/**
 * 获取前一个值的 Hook
 * usePrevious Hook
 * 
 * @param value 当前值
 * @returns 前一个值
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  const prevRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    prevRef.current = ref.current
    ref.current = value
  }, [value])

  return prevRef.current
}

/**
 * 获取上一次渲染的值
 * 与 usePrevious 不同，这个 hook 在渲染时立即更新
 */
export function usePreviousImmediate<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  const previous = ref.current
  ref.current = value
  return previous
}

/**
 * 比较当前值和前一个值是否不同
 */
export function useHasChanged<T>(value: T, compare?: (a: T, b: T) => boolean): boolean {
  const previous = usePrevious(value)
  
  if (previous === undefined) {
    return false
  }
  
  if (compare) {
    return !compare(previous, value)
  }
  
  return previous !== value
}
