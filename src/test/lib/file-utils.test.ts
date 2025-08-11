import { describe, it, expect } from 'vitest'
import { formatFileSize } from '@/lib/file-utils'
import { parsePageRanges, formatPageRanges } from '@/lib/pdf-merger'

describe('File Utilities', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should handle decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB')
    })
  })

  describe('parsePageRanges', () => {
    it('should parse single pages', () => {
      expect(parsePageRanges('1', 10)).toEqual([1])
      expect(parsePageRanges('5', 10)).toEqual([5])
    })

    it('should parse page ranges', () => {
      expect(parsePageRanges('1-3', 10)).toEqual([1, 2, 3])
      expect(parsePageRanges('5-7', 10)).toEqual([5, 6, 7])
    })

    it('should parse multiple ranges', () => {
      expect(parsePageRanges('1-3,5,7-9', 10)).toEqual([1, 2, 3, 5, 7, 8, 9])
    })

    it('should handle spaces', () => {
      expect(parsePageRanges(' 1 - 3 , 5 , 7 - 9 ', 10)).toEqual([1, 2, 3, 5, 7, 8, 9])
    })

    it('should remove duplicates', () => {
      expect(parsePageRanges('1,1,2,2,3', 10)).toEqual([1, 2, 3])
    })

    it('should sort results', () => {
      expect(parsePageRanges('5,1,3', 10)).toEqual([1, 3, 5])
    })

    it('should throw for invalid ranges', () => {
      expect(() => parsePageRanges('0', 10)).toThrow('Invalid page: 0')
      expect(() => parsePageRanges('11', 10)).toThrow('Invalid page: 11')
      expect(() => parsePageRanges('5-3', 10)).toThrow('Invalid range: 5-3')
      expect(() => parsePageRanges('1-11', 10)).toThrow('Invalid range: 1-11')
    })
  })

  describe('formatPageRanges', () => {
    it('should format single pages', () => {
      expect(formatPageRanges([1])).toBe('1')
      expect(formatPageRanges([5])).toBe('5')
    })

    it('should format consecutive ranges', () => {
      expect(formatPageRanges([1, 2, 3])).toBe('1-3')
      expect(formatPageRanges([5, 6, 7, 8])).toBe('5-8')
    })

    it('should format mixed ranges and singles', () => {
      expect(formatPageRanges([1, 2, 3, 5, 7, 8, 9])).toBe('1-3, 5, 7-9')
      expect(formatPageRanges([1, 3, 5, 6, 7, 10])).toBe('1, 3, 5-7, 10')
    })

    it('should handle unsorted input', () => {
      expect(formatPageRanges([5, 1, 3, 2])).toBe('1-3, 5')
    })

    it('should handle empty input', () => {
      expect(formatPageRanges([])).toBe('')
    })
  })
})
