import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePrevious, usePreviousImmediate, useHasChanged } from '../usePrevious'

describe('usePrevious', () => {
  it('should return undefined on first render', () => {
    const { result } = renderHook(() => usePrevious('initial'))
    expect(result.current).toBeUndefined()
  })

  it('should return previous value after re-renders', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'first' } }
    )

    // First render: previous is undefined
    expect(result.current).toBeUndefined()

    // Second render: previous should be 'first' (from useEffect)
    rerender({ value: 'second' })
    // Note: useEffect runs after render, so we check the next render
    rerender({ value: 'third' })
    expect(result.current).toBe('first')
  })

  it('should handle number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 0 } }
    )

    rerender({ value: 42 })
    rerender({ value: 100 })
    expect(result.current).toBe(0)
  })

  it('should handle object values', () => {
    const obj1 = { id: 1 }

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj1 } }
    )

    rerender({ value: { id: 2 } })
    rerender({ value: { id: 3 } })
    expect(result.current).toBe(obj1)
  })

  it('should handle array values', () => {
    const arr1 = [1, 2, 3]

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: arr1 } }
    )

    rerender({ value: [4, 5, 6] })
    rerender({ value: [7, 8, 9] })
    expect(result.current).toBe(arr1)
  })
})

describe('usePreviousImmediate', () => {
  it('should return undefined on first render', () => {
    const { result } = renderHook(() => usePreviousImmediate('initial'))
    expect(result.current).toBeUndefined()
  })

  it('should return previous value immediately after update', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousImmediate(value),
      { initialProps: { value: 'first' } }
    )

    // First render: previous is undefined
    expect(result.current).toBeUndefined()

    // Second render: previous is 'first' (immediate update)
    rerender({ value: 'second' })
    expect(result.current).toBe('first')

    rerender({ value: 'third' })
    expect(result.current).toBe('second')
  })

  it('should handle number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousImmediate(value),
      { initialProps: { value: 10 } }
    )

    rerender({ value: 20 })
    expect(result.current).toBe(10)
  })
})

describe('useHasChanged', () => {
  it('should return false on first render', () => {
    const { result } = renderHook(() => useHasChanged('initial'))
    expect(result.current).toBe(false)
  })

  it('should return true when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value),
      { initialProps: { value: 'first' } }
    )

    expect(result.current).toBe(false)

    rerender({ value: 'second' })
    rerender({ value: 'third' })
    expect(result.current).toBe(true)

    rerender({ value: 'third' })
    expect(result.current).toBe(true)
  })

  it('should return false when value stays the same', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value),
      { initialProps: { value: 'same' } }
    )

    rerender({ value: 'same' })
    expect(result.current).toBe(false)
  })

  it('should use custom compare function', () => {
    const compare = (a: number, b: number) => Math.abs(a - b) < 5

    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value, compare),
      { initialProps: { value: 10 } }
    )

    expect(result.current).toBe(false)

    // Change within threshold (10 -> 13, diff = 3 < 5)
    rerender({ value: 13 })
    rerender({ value: 16 })
    expect(result.current).toBe(true)

    // Change outside threshold (16 -> 23, diff = 7 >= 5)
    rerender({ value: 23 })
    expect(result.current).toBe(true)
  })

  it('should handle object comparison with custom compare', () => {
    const compare = (a: { id: number }, b: { id: number }) => a.id === b.id

    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value, compare),
      { initialProps: { value: { id: 1, name: 'first' } } }
    )

    expect(result.current).toBe(false)

    // Same id, different name - should not be considered changed
    rerender({ value: { id: 1, name: 'second' } })
    rerender({ value: { id: 1, name: 'third' } })
    expect(result.current).toBe(false)

    // Different id - should be considered changed
    rerender({ value: { id: 2, name: 'third' } })
    expect(result.current).toBe(true)
  })
})
