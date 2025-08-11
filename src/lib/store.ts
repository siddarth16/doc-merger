import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FileItem {
  id: string
  name: string
  kind: 'pdf' | 'docx'
  size: number
  lastModified: number
  blob: Blob
  pages?: number
  ranges?: number[]
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system'
  accentColor: 'cyan' | 'violet' | 'green'
  conversionEnabled: boolean
  conversionApiKey?: string
  conversionProvider: 'cloudconvert' | 'convertapi'
  pdfMetadata: {
    title?: string
    author?: string
  }
  maxFileSize: number // in MB
  outputFileName: string
}

interface AppState {
  // Files
  files: FileItem[]
  addFiles: (files: FileItem[]) => void
  removeFile: (id: string) => void
  updateFile: (id: string, updates: Partial<FileItem>) => void
  reorderFiles: (startIndex: number, endIndex: number) => void
  clearFiles: () => void
  
  // Settings
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  
  // UI State
  isLoading: boolean
  setLoading: (loading: boolean) => void
  isConverting: boolean
  setConverting: (converting: boolean) => void
  progress: number
  setProgress: (progress: number) => void
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  accentColor: 'cyan',
  conversionEnabled: false,
  conversionProvider: 'cloudconvert',
  pdfMetadata: {
    title: 'Merged Document',
    author: 'Doc Merger'
  },
  maxFileSize: 50, // 50MB
  outputFileName: `merged-${new Date().toISOString().slice(0, 16).replace(/[:]/g, '-')}`
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Files
      files: [],
      addFiles: (newFiles) => set((state) => ({ 
        files: [...state.files, ...newFiles] 
      })),
      removeFile: (id) => set((state) => ({ 
        files: state.files.filter(file => file.id !== id) 
      })),
      updateFile: (id, updates) => set((state) => ({
        files: state.files.map(file => 
          file.id === id ? { ...file, ...updates } : file
        )
      })),
      reorderFiles: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.files)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return { files: result }
      }),
      clearFiles: () => set({ files: [] }),
      
      // Settings
      settings: defaultSettings,
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      // UI State
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      isConverting: false,
      setConverting: (converting) => set({ isConverting: converting }),
      progress: 0,
      setProgress: (progress) => set({ progress }),
    }),
    {
      name: 'doc-merger-storage',
      partialize: (state) => ({ 
        settings: state.settings 
      }),
    }
  )
)
