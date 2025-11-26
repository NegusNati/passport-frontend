import { describe, expect, it } from 'vitest'

import { $isImageNode, ImageNode } from '../ImageNode'
import { IMAGE, PASSPORT_TRANSFORMERS, VIDEO } from '../markdown-transformers'
import { $isVideoNode, VideoNode } from '../VideoNode'

describe('Markdown Transformers', () => {
  describe('Transformer Configuration', () => {
    it('should include all required transformers', () => {
      expect(PASSPORT_TRANSFORMERS).toBeDefined()
      expect(PASSPORT_TRANSFORMERS.length).toBeGreaterThan(0)
    })

    it('should include IMAGE transformer', () => {
      const imageTransformer = PASSPORT_TRANSFORMERS.find((t) => t === IMAGE)
      expect(imageTransformer).toBeDefined()
    })

    it('should include VIDEO transformer', () => {
      const videoTransformer = PASSPORT_TRANSFORMERS.find((t) => t === VIDEO)
      expect(videoTransformer).toBeDefined()
    })
  })

  describe('IMAGE transformer', () => {
    it('should have correct type', () => {
      expect(IMAGE.type).toBe('text-match')
    })

    it('should include ImageNode dependency', () => {
      expect(IMAGE.dependencies?.includes(ImageNode)).toBe(true)
    })

    it('should have correct trigger', () => {
      expect(IMAGE.trigger).toBe(')')
    })

    it('should match image markdown pattern', () => {
      const pattern = IMAGE.regExp
      expect(pattern.test('![Alt text](url)')).toBe(true)
      expect(pattern.test('![](url)')).toBe(true)
      expect(pattern.test('Not an image')).toBe(false)
    })

    it('should have export function', () => {
      expect(IMAGE.export).toBeDefined()
      expect(typeof IMAGE.export).toBe('function')
    })
  })

  describe('VIDEO transformer', () => {
    it('should have correct type', () => {
      expect(VIDEO.type).toBe('text-match')
    })

    it('should include VideoNode dependency', () => {
      expect(VIDEO.dependencies?.includes(VideoNode)).toBe(true)
    })

    it('should have correct trigger', () => {
      expect(VIDEO.trigger).toBe(')')
    })

    it('should match video markdown pattern', () => {
      const pattern = VIDEO.regExp
      expect(pattern.test('[video](url)')).toBe(true)
      expect(pattern.test('[video](https://example.com/video.mp4)')).toBe(true)
      expect(pattern.test('![Alt](url)')).toBe(false)
      expect(pattern.test('[text](url)')).toBe(false)
    })

    it('should have export function', () => {
      expect(VIDEO.export).toBeDefined()
      expect(typeof VIDEO.export).toBe('function')
    })
  })

  describe('Node type guards', () => {
    it('should have ImageNode type guard', () => {
      expect($isImageNode).toBeDefined()
      expect(typeof $isImageNode).toBe('function')
    })

    it('should have VideoNode type guard', () => {
      expect($isVideoNode).toBeDefined()
      expect(typeof $isVideoNode).toBe('function')
    })
  })
})
