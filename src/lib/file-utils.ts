import type { FileItem } from './store'

export interface FileValidation {
  valid: boolean
  error?: string
}

export function validateFile(file: File, maxSizeMB: number): FileValidation {
  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PDF and DOCX files are supported'
    }
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    }
  }

  // Check for empty files
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    }
  }

  return { valid: true }
}

export async function parseFile(file: File): Promise<FileItem> {
  const kind = file.type === 'application/pdf' ? 'pdf' : 'docx'
  
  let pages: number | undefined
  
  if (kind === 'pdf') {
    try {
      pages = await getPdfPageCount(file)
    } catch (error) {
      console.warn(`Could not get page count for ${file.name}:`, error)
      pages = undefined
    }
  }

  return {
    id: generateFileId(),
    name: file.name,
    kind,
    size: file.size,
    lastModified: file.lastModified,
    blob: file,
    pages,
    ranges: pages ? Array.from({ length: pages }, (_, i) => i + 1) : undefined
  }
}

async function getPdfPageCount(file: File): Promise<number> {
  // Import PDF.js dynamically
  const pdfjsLib = await import('pdfjs-dist')
  
  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  
  return pdf.numPages
}

export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileIcon(kind: 'pdf' | 'docx'): string {
  return kind === 'pdf' ? '📄' : '📘'
}

export function sanitizeFileName(name: string): string {
  // Remove or replace invalid characters
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim()
}
