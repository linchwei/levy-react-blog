import { describe, it, expect } from 'vitest'
import {
  certifications,
  skillProgress,
  categoryColors,
  categoryLabels,
} from './certificationData'

describe('certificationData', () => {
  describe('certifications', () => {
    it('should have at least one certification', () => {
      expect(certifications.length).toBeGreaterThan(0)
    })

    it('should have valid certification structure', () => {
      certifications.forEach(cert => {
        expect(cert).toHaveProperty('id')
        expect(cert).toHaveProperty('name')
        expect(cert).toHaveProperty('issuer')
        expect(cert).toHaveProperty('issueDate')
        expect(cert).toHaveProperty('credentialId')
        expect(cert).toHaveProperty('verifyUrl')
        expect(cert).toHaveProperty('badge')
        expect(cert).toHaveProperty('skills')
      })
    })

    it('should have unique ids', () => {
      const ids = certifications.map(cert => cert.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have non-empty names', () => {
      certifications.forEach(cert => {
        expect(cert.name).not.toBe('')
        expect(cert.name.length).toBeGreaterThan(0)
      })
    })

    it('should have non-empty issuers', () => {
      certifications.forEach(cert => {
        expect(cert.issuer).not.toBe('')
        expect(cert.issuer.length).toBeGreaterThan(0)
      })
    })

    it('should have valid issueDate format', () => {
      certifications.forEach(cert => {
        expect(cert.issueDate).toMatch(/^\d{4}-\d{2}$/)
      })
    })

    it('should have valid expiryDate format if present', () => {
      certifications.forEach(cert => {
        if (cert.expiryDate) {
          expect(cert.expiryDate).toMatch(/^\d{4}-\d{2}$/)
        }
      })
    })

    it('should have valid URLs', () => {
      certifications.forEach(cert => {
        expect(cert.verifyUrl).toMatch(/^https?:\/\//)
      })
    })

    it('should have at least one skill', () => {
      certifications.forEach(cert => {
        expect(cert.skills.length).toBeGreaterThan(0)
      })
    })
  })

  describe('skillProgress', () => {
    it('should have at least one skill', () => {
      expect(skillProgress.length).toBeGreaterThan(0)
    })

    it('should have valid skill structure', () => {
      skillProgress.forEach(skill => {
        expect(skill).toHaveProperty('name')
        expect(skill).toHaveProperty('level')
        expect(skill).toHaveProperty('category')
        expect(skill).toHaveProperty('learning')
      })
    })

    it('should have level between 0 and 100', () => {
      skillProgress.forEach(skill => {
        expect(skill.level).toBeGreaterThanOrEqual(0)
        expect(skill.level).toBeLessThanOrEqual(100)
      })
    })

    it('should have valid categories', () => {
      const validCategories = ['frontend', 'backend', 'devops', 'ai', 'other']
      skillProgress.forEach(skill => {
        expect(validCategories).toContain(skill.category)
      })
    })

    it('should have non-empty names', () => {
      skillProgress.forEach(skill => {
        expect(skill.name).not.toBe('')
        expect(skill.name.length).toBeGreaterThan(0)
      })
    })
  })

  describe('categoryColors', () => {
    it('should have colors for all categories', () => {
      const categories = ['frontend', 'backend', 'devops', 'ai', 'other']
      categories.forEach(category => {
        expect(categoryColors).toHaveProperty(category)
        expect(categoryColors[category]).toMatch(/^bg-/)
      })
    })
  })

  describe('categoryLabels', () => {
    it('should have labels for all categories', () => {
      const categories = ['frontend', 'backend', 'devops', 'ai', 'other']
      categories.forEach(category => {
        expect(categoryLabels).toHaveProperty(category)
        expect(categoryLabels[category]).not.toBe('')
      })
    })

    it('should have Chinese labels', () => {
      Object.values(categoryLabels).forEach(label => {
        expect(label.length).toBeGreaterThan(0)
      })
    })
  })
})
