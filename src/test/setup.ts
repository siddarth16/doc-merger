import '@testing-library/jest-dom'

// Mock PDF.js worker
global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

// Mock file API
Object.defineProperty(window, 'File', {
  value: class MockFile {
    constructor(chunks: BlobPart[], filename: string, options: FilePropertyBag = {}) {
      this.name = filename
      this.type = options.type || ''
      this.size = chunks.reduce((acc, chunk) => acc + (typeof chunk === 'string' ? chunk.length : chunk.size || 0), 0)
      this.lastModified = Date.now()
    }
    
    async arrayBuffer() {
      return new ArrayBuffer(8)
    }
    
    async text() {
      return ''
    }
  }
})

// Mock Blob
Object.defineProperty(window, 'Blob', {
  value: class MockBlob {
    constructor(chunks: BlobPart[] = [], options: BlobPropertyBag = {}) {
      this.type = options.type || ''
      this.size = chunks ? chunks.reduce((acc, chunk) => acc + (typeof chunk === 'string' ? chunk.length : (chunk as Blob).size || 0), 0) : 0
    }
    
    async arrayBuffer() {
      return new ArrayBuffer(8)
    }
    
    async text() {
      return ''
    }
  }
})

// Mock Worker
Object.defineProperty(window, 'Worker', {
  value: class MockWorker {
    constructor(url: string) {
      this.url = url
    }
    
    postMessage() {
      // Mock worker response
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({ data: { type: 'success', result: new Uint8Array([1, 2, 3, 4]) } })
        }
      }, 100)
    }
    
    terminate() {}
    
    onmessage: ((event: MessageEvent) => void) | null = null
    onerror: ((event: ErrorEvent) => void) | null = null
    url: string
  }
})
