import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/lib/store'
import type { FileItem } from '@/lib/store'

// Mock file data
const mockFile1: FileItem = {
  id: 'file1',
  name: 'test1.pdf',
  kind: 'pdf',
  size: 1024,
  lastModified: Date.now(),
  blob: new Blob([]),
  pages: 5,
  ranges: [1, 2, 3, 4, 5]
}

const mockFile2: FileItem = {
  id: 'file2',
  name: 'test2.docx',
  kind: 'docx',
  size: 2048,
  lastModified: Date.now(),
  blob: new Blob() as Blob
}

describe('App Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.getState().clearFiles()
  })

  describe('File Management', () => {
    it('should add files', () => {
      const { addFiles, files } = useAppStore.getState()
      
      expect(files).toHaveLength(0)
      
      addFiles([mockFile1, mockFile2])
      
      expect(useAppStore.getState().files).toHaveLength(2)
      expect(useAppStore.getState().files[0].name).toBe('test1.pdf')
      expect(useAppStore.getState().files[1].name).toBe('test2.docx')
    })

    it('should remove files', () => {
      const { addFiles, removeFile } = useAppStore.getState()
      
      addFiles([mockFile1, mockFile2])
      expect(useAppStore.getState().files).toHaveLength(2)
      
      removeFile('file1')
      expect(useAppStore.getState().files).toHaveLength(1)
      expect(useAppStore.getState().files[0].id).toBe('file2')
    })

    it('should update files', () => {
      const { addFiles, updateFile } = useAppStore.getState()
      
      addFiles([mockFile1])
      
      updateFile('file1', { name: 'renamed.pdf' })
      
      expect(useAppStore.getState().files[0].name).toBe('renamed.pdf')
      expect(useAppStore.getState().files[0].id).toBe('file1') // ID should not change
    })

    it('should reorder files', () => {
      const { addFiles, reorderFiles } = useAppStore.getState()
      
      addFiles([mockFile1, mockFile2])
      
      // Move first file to second position
      reorderFiles(0, 1)
      
      const files = useAppStore.getState().files
      expect(files[0].id).toBe('file2')
      expect(files[1].id).toBe('file1')
    })

    it('should clear all files', () => {
      const { addFiles, clearFiles } = useAppStore.getState()
      
      addFiles([mockFile1, mockFile2])
      expect(useAppStore.getState().files).toHaveLength(2)
      
      clearFiles()
      expect(useAppStore.getState().files).toHaveLength(0)
    })
  })

  describe('Settings Management', () => {
    it('should update settings', () => {
      const { updateSettings, settings } = useAppStore.getState()
      
      expect(settings.accentColor).toBe('cyan') // default
      
      updateSettings({ accentColor: 'violet' })
      
      expect(useAppStore.getState().settings.accentColor).toBe('violet')
    })

    it('should update PDF metadata', () => {
      const { updateSettings } = useAppStore.getState()
      
      updateSettings({
        pdfMetadata: { title: 'Custom Title', author: 'Custom Author' }
      })
      
      const newSettings = useAppStore.getState().settings
      expect(newSettings.pdfMetadata.title).toBe('Custom Title')
      expect(newSettings.pdfMetadata.author).toBe('Custom Author')
    })
  })

  describe('UI State Management', () => {
    it('should manage loading state', () => {
      const { setLoading, isLoading } = useAppStore.getState()
      
      expect(isLoading).toBe(false)
      
      setLoading(true)
      expect(useAppStore.getState().isLoading).toBe(true)
      
      setLoading(false)
      expect(useAppStore.getState().isLoading).toBe(false)
    })

    it('should manage progress', () => {
      const { setProgress, progress } = useAppStore.getState()
      
      expect(progress).toBe(0)
      
      setProgress(50)
      expect(useAppStore.getState().progress).toBe(50)
      
      setProgress(100)
      expect(useAppStore.getState().progress).toBe(100)
    })
  })
})
