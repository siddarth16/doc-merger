import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UploadDropzone } from '@/components/upload/upload-dropzone'

// Mock the store
vi.mock('@/lib/store', () => ({
  useAppStore: () => ({
    addFiles: vi.fn(),
    settings: {
      maxFileSize: 50
    }
  })
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => children
}))

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({ 'data-testid': 'dropzone' }),
    getInputProps: () => ({ 'data-testid': 'file-input' }),
    isDragActive: false,
    isDragReject: false,
    open: vi.fn()
  })
}))

describe('UploadDropzone', () => {
  it('should render the dropzone', () => {
    render(<UploadDropzone />)
    
    expect(screen.getByTestId('dropzone')).toBeInTheDocument()
    expect(screen.getByTestId('file-input')).toBeInTheDocument()
  })

  it('should display correct file size limit', () => {
    render(<UploadDropzone />)
    
    expect(screen.getByText(/Max size: 50MB/)).toBeInTheDocument()
  })

  it('should show drag and drop text', () => {
    render(<UploadDropzone />)
    
    expect(screen.getByText('Drag & drop your documents')).toBeInTheDocument()
    expect(screen.getByText(/Support for PDF and DOCX files/)).toBeInTheDocument()
  })

  it('should have choose files button', () => {
    render(<UploadDropzone />)
    
    expect(screen.getByRole('button', { name: /choose files/i })).toBeInTheDocument()
  })
})
