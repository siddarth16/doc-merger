import { PDFDocument } from 'pdf-lib'
import type { FileItem } from './store'

export interface PdfMergeOptions {
  title?: string
  author?: string
  subject?: string
}

export interface PdfMergeProgress {
  progress: number
  status: string
  currentFile?: string
}

export class PdfMerger {
  private onProgress?: (progress: PdfMergeProgress) => void

  constructor(onProgress?: (progress: PdfMergeProgress) => void) {
    this.onProgress = onProgress
  }

  async mergePdfs(files: FileItem[], options: PdfMergeOptions = {}): Promise<Uint8Array> {
    this.reportProgress(0, "Starting merge...")

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create()
    
    // Set metadata
    if (options.title) mergedPdf.setTitle(options.title)
    if (options.author) mergedPdf.setAuthor(options.author)
    if (options.subject) mergedPdf.setSubject(options.subject)
    mergedPdf.setCreator('Doc Merger')
    mergedPdf.setProducer('Doc Merger')
    mergedPdf.setCreationDate(new Date())
    mergedPdf.setModificationDate(new Date())

    const totalFiles = files.length
    let processedFiles = 0

    for (const file of files) {
      if (file.kind !== 'pdf') continue

      this.reportProgress(
        (processedFiles / totalFiles) * 80,
        `Processing ${file.name}...`,
        file.name
      )

      try {
        // Load the PDF
        const arrayBuffer = await file.blob.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        
        // Get pages to include (use ranges if specified)
        const pagesToInclude = file.ranges || Array.from({ length: pdf.getPageCount() }, (_, i) => i + 1)
        
        // Copy pages
        for (const pageNum of pagesToInclude) {
          if (pageNum >= 1 && pageNum <= pdf.getPageCount()) {
            const [copiedPage] = await mergedPdf.copyPages(pdf, [pageNum - 1])
            mergedPdf.addPage(copiedPage)
          }
        }

        processedFiles++
        this.reportProgress(
          (processedFiles / totalFiles) * 80,
          `Processed ${file.name}`
        )

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        throw new Error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    this.reportProgress(90, "Finalizing PDF...")

    // Save the merged PDF
    const pdfBytes = await mergedPdf.save()
    
    this.reportProgress(100, "Merge completed!")
    
    return pdfBytes
  }

  private reportProgress(progress: number, status: string, currentFile?: string) {
    if (this.onProgress) {
      this.onProgress({ progress, status, currentFile })
    }
  }
}

// Utility function to validate page ranges
export function parsePageRanges(input: string, maxPages: number): number[] {
  const ranges: number[] = []
  const parts = input.split(',').map(part => part.trim())

  for (const part of parts) {
    if (part.includes('-')) {
      // Range like "1-5"
      const [start, end] = part.split('-').map(num => parseInt(num.trim(), 10))
      if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
        throw new Error(`Invalid range: ${part}`)
      }
      for (let i = start; i <= end; i++) {
        if (!ranges.includes(i)) {
          ranges.push(i)
        }
      }
    } else {
      // Single page like "3"
      const page = parseInt(part, 10)
      if (isNaN(page) || page < 1 || page > maxPages) {
        throw new Error(`Invalid page: ${part}`)
      }
      if (!ranges.includes(page)) {
        ranges.push(page)
      }
    }
  }

  return ranges.sort((a, b) => a - b)
}

// Utility function to format page ranges for display
export function formatPageRanges(pages: number[]): string {
  if (pages.length === 0) return ''
  
  const sorted = [...pages].sort((a, b) => a - b)
  const ranges: string[] = []
  let start = sorted[0]
  let end = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i]
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`)
      start = sorted[i]
      end = sorted[i]
    }
  }
  
  ranges.push(start === end ? `${start}` : `${start}-${end}`)
  return ranges.join(', ')
}
