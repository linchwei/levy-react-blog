import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset document classList
    document.documentElement.className = ''
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should default to system theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('system')
    expect(result.current.resolvedTheme).toBe('light')
  })

  it('should set theme and update resolved theme', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(result.current.theme).toBe('dark')
    expect(result.current.resolvedTheme).toBe('dark')
  })

  it('should toggle through themes', () => {
    const { result } = renderHook(() => useTheme())
    
    // system -> light
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe('light')
    
    // light -> dark
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe('dark')
    
    // dark -> system
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe('system')
  })

  it('should resolve system theme based on prefers-color-scheme', () => {
    // Mock dark mode preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setTheme('system')
    })
    
    expect(result.current.resolvedTheme).toBe('dark')
  })

  it('should apply light theme class to document', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setTheme('light')
    })
    
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should apply dark theme class to document', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  it('should provide all theme options', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.theme).toBeDefined()
    expect(result.current.resolvedTheme).toBeDefined()
    expect(typeof result.current.setTheme).toBe('function')
    expect(typeof result.current.toggleTheme).toBe('function')
  })
})
