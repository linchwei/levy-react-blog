import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage, useSessionStorage } from '../useLocalStorage'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with initial value when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))
    
    expect(result.current[0]).toBe('initial')
  })

  it('should initialize with stored value when localStorage has data', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored'))
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))
    
    expect(result.current[0]).toBe('stored')
  })

  it('should set value to localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))
    
    act(() => {
      result.current[1]('newValue')
    })
    
    expect(result.current[0]).toBe('newValue')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('newValue'))
  })

  it('should handle function updates', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('testKey', 0))
    
    act(() => {
      result.current[1]((prev) => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
  })

  it('should remove value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored'))
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))
    
    act(() => {
      result.current[2]()
    })
    
    expect(result.current[0]).toBe('initial')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey')
  })

  it('should handle JSON parse errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json')
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
    consoleSpy.mockRestore()
  })

  it('should handle complex objects', () => {
    localStorageMock.getItem.mockReturnValue(null)
    const complexObject = { name: 'test', count: 42, nested: { value: true } }
    
    const { result } = renderHook(() => useLocalStorage('testKey', complexObject))
    
    expect(result.current[0]).toEqual(complexObject)
    
    act(() => {
      result.current[1]({ ...complexObject, count: 100 })
    })
    
    expect(result.current[0].count).toBe(100)
  })
})

describe('useSessionStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with initial value when sessionStorage is empty', () => {
    sessionStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useSessionStorage('testKey', 'initial'))
    
    expect(result.current[0]).toBe('initial')
  })

  it('should initialize with stored value when sessionStorage has data', () => {
    sessionStorageMock.getItem.mockReturnValue(JSON.stringify('stored'))
    
    const { result } = renderHook(() => useSessionStorage('testKey', 'initial'))
    
    expect(result.current[0]).toBe('stored')
  })

  it('should set value to sessionStorage', () => {
    sessionStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useSessionStorage('testKey', 'initial'))
    
    act(() => {
      result.current[1]('newValue')
    })
    
    expect(result.current[0]).toBe('newValue')
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('newValue'))
  })

  it('should remove value from sessionStorage', () => {
    sessionStorageMock.getItem.mockReturnValue(JSON.stringify('stored'))
    
    const { result } = renderHook(() => useSessionStorage('testKey', 'initial'))
    
    act(() => {
      result.current[2]()
    })
    
    expect(result.current[0]).toBe('initial')
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('testKey')
  })
})
