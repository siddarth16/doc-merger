import type { FileItem } from './store'
import { PdfMerger } from './pdf-merger'
import { DocxMerger } from './docx-merger'

export interface MergeOptions {
  filename: string
  title?: string
  author?: string
  subject?: string
}

export interface MergeProgress {
  progress: number
  status: string
  currentFile?: string
}

export interface MergeResult {
  data: Uint8Array
  filename: string
  mimeType: string
}

export class MergeService {
  private worker: Worker | null = null

  async mergeFiles(
    files: FileItem[], 
    options: MergeOptions,
    onProgress?: (progress: MergeProgress) => void
  ): Promise<MergeResult> {
    
    // Determine merge type
    const pdfFiles = files.filter(f => f.kind === 'pdf')
    const docxFiles = files.filter(f => f.kind === 'docx')
    const isMixed = pdfFiles.length > 0 && docxFiles.length > 0

    if (files.length === 0) {
      throw new Error('No files to merge')
    }

    if (files.length === 1) {
      throw new Error('At least 2 files are required for merging')
    }

    // For mixed types, we need conversion (not implemented in this demo)
    if (isMixed) {
      throw new Error('Mixed file types require conversion to be enabled')
    }

    // Determine output format and merge
    if (pdfFiles.length > 0 && docxFiles.length === 0) {
      return await this.mergePdfs(pdfFiles, options, onProgress)
    } else if (docxFiles.length > 0 && pdfFiles.length === 0) {
      return await this.mergeDocx(docxFiles, options, onProgress)
    } else {
      throw new Error('Cannot merge mixed file types without conversion')
    }
  }

  private async mergePdfs(
    files: FileItem[], 
    options: MergeOptions,
    onProgress?: (progress: MergeProgress) => void
  ): Promise<MergeResult> {
    
    const merger = new PdfMerger(onProgress)
    
    const pdfBytes = await merger.mergePdfs(files, {
      title: options.title,
      author: options.author,
      subject: options.subject
    })

    const filename = options.filename.endsWith('.pdf') 
      ? options.filename 
      : `${options.filename}.pdf`

    return {
      data: pdfBytes,
      filename,
      mimeType: 'application/pdf'
    }
  }

  private async mergeDocx(
    files: FileItem[], 
    options: MergeOptions,
    onProgress?: (progress: MergeProgress) => void
  ): Promise<MergeResult> {
    
    const merger = new DocxMerger(onProgress)
    
    const docxBytes = await merger.mergeDocx(files, {
      title: options.title,
      author: options.author,
      subject: options.subject
    })

    const filename = options.filename.endsWith('.docx') 
      ? options.filename 
      : `${options.filename}.docx`

    return {
      data: docxBytes,
      filename,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  }

  // Alternative Web Worker-based implementation (for future use)
  private async mergeWithWorker(
    files: FileItem[], 
    options: MergeOptions,
    onProgress?: (progress: MergeProgress) => void
  ): Promise<MergeResult> {
    
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        this.worker = new Worker('/merge-worker.js')
      }

      this.worker.onmessage = (e) => {
        const { type, progress, status, currentFile, result, filename, error } = e.data

        if (type === 'progress' && onProgress) {
          onProgress({ progress, status, currentFile })
        } else if (type === 'success') {
          resolve({
            data: result,
            filename,
            mimeType: filename.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })
        } else if (type === 'error') {
          reject(new Error(error))
        }
      }

      this.worker.onerror = (error) => {
        reject(new Error(`Worker error: ${error.message}`))
      }

      // Send files and options to worker
      const pdfFiles = files.filter(f => f.kind === 'pdf')
      const mergeType = pdfFiles.length > 0 ? 'merge-pdf' : 'merge-docx'

      this.worker.postMessage({
        type: mergeType,
        files: files.map(f => ({
          id: f.id,
          name: f.name,
          kind: f.kind,
          size: f.size,
          ranges: f.ranges
        })),
        options
      })
    })
  }

  dispose() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

// Utility function to trigger file download
export function downloadFile(data: Uint8Array, filename: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
