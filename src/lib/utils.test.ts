import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional class names', () => {
      const condition = true
      const result = cn('base', condition && 'conditional')
      expect(result).toBe('base conditional')
    })

    it('should filter out falsy values', () => {
      const result = cn('base', false && 'hidden', null, undefined, 'visible')
      expect(result).toBe('base visible')
    })

    it('should handle object syntax', () => {
      const result = cn({ active: true, disabled: false })
      expect(result).toBe('active')
    })

    it('should handle array syntax', () => {
      const result = cn(['class1', 'class2'])
      expect(result).toBe('class1 class2')
    })

    it('should merge tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBe('py-1 px-4')
    })

    it('should handle nested arrays', () => {
      const result = cn('base', ['class1', ['class2', 'class3']])
      expect(result).toBe('base class1 class2 class3')
    })

    it('should return empty string for no inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle mixed inputs', () => {
      const result = cn(
        'base',
        { active: true },
        ['class1', 'class2'],
        false && 'hidden',
        'final'
      )
      expect(result).toBe('base active class1 class2 final')
    })
  })
})
