import { describe, it, expect } from 'vitest'
import { galleryItems, categories } from './galleryData'

describe('galleryData', () => {
  describe('galleryItems', () => {
    it('should have at least one item', () => {
      expect(galleryItems.length).toBeGreaterThan(0)
    })

    it('should have valid item structure', () => {
      galleryItems.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('src')
        expect(item).toHaveProperty('thumbnail')
        expect(item).toHaveProperty('title')
        expect(item).toHaveProperty('category')
        expect(item).toHaveProperty('description')
        expect(item).toHaveProperty('date')
      })
    })

    it('should have unique ids', () => {
      const ids = galleryItems.map(item => item.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid URLs', () => {
      galleryItems.forEach(item => {
        expect(item.src).toMatch(/^https?:\/\//)
        expect(item.thumbnail).toMatch(/^https?:\/\//)
      })
    })

    it('should have non-empty titles', () => {
      galleryItems.forEach(item => {
        expect(item.title).not.toBe('')
        expect(item.title.length).toBeGreaterThan(0)
      })
    })

    it('should have valid categories', () => {
      const validCategories = categories.filter(c => c !== '全部')
      galleryItems.forEach(item => {
        expect(validCategories).toContain(item.category)
      })
    })

    it('should have valid date format', () => {
      galleryItems.forEach(item => {
        expect(item.date).toMatch(/^\d{4}-\d{2}$/)
      })
    })

    it('should have descriptions', () => {
      galleryItems.forEach(item => {
        expect(item.description).not.toBe('')
        expect(item.description.length).toBeGreaterThan(10)
      })
    })
  })

  describe('categories', () => {
    it('should include "全部" as first category', () => {
      expect(categories[0]).toBe('全部')
    })

    it('should have unique categories', () => {
      const uniqueCategories = new Set(categories)
      expect(uniqueCategories.size).toBe(categories.length)
    })

    it('should have at least one category besides "全部"', () => {
      expect(categories.length).toBeGreaterThan(1)
    })
  })
})
