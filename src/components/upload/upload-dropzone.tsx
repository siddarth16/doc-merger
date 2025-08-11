"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { FileItem } from "@/lib/store"
import { validateFile, parseFile } from "@/lib/file-utils"

export function UploadDropzone() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { addFiles, settings } = useAppStore()

  const processFiles = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true)
    const newFileItems: FileItem[] = []
    
    for (const file of acceptedFiles) {
      try {
        // Validate file
        const validation = validateFile(file, settings.maxFileSize)
        if (!validation.valid) {
          toast.error(`${file.name}: ${validation.error}`)
          continue
        }

        // Parse file to get metadata
        const fileData = await parseFile(file)
        newFileItems.push(fileData)
        
        toast.success(`Added ${file.name}`)
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        toast.error(`Failed to process ${file.name}`)
      }
    }

    if (newFileItems.length > 0) {
      addFiles(newFileItems)
    }
    
    setIsProcessing(false)
  }, [addFiles, settings.maxFileSize])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    processFiles(acceptedFiles)
  }, [processFiles])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    open
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    noClick: true,
    disabled: isProcessing
  })

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer",
          "glass dropzone",
          isDragActive && !isDragReject && "dropzone-active neon-glow-cyan",
          isDragReject && "border-destructive bg-destructive/5",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        
        <div className="text-center space-y-4">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Processing files...</p>
              </motion.div>
            ) : isDragReject ? (
              <motion.div
                key="reject"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center space-y-2"
              >
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-sm text-destructive">
                  Only PDF and DOCX files are supported
                </p>
              </motion.div>
            ) : isDragActive ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center space-y-2"
              >
                <Upload className="w-12 h-12 text-primary animate-bounce" />
                <p className="text-lg font-medium text-primary">
                  Drop your files here
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Drag & drop your documents
                  </h3>
                  <p className="text-muted-foreground">
                    Support for PDF and DOCX files up to {settings.maxFileSize}MB each
                  </p>
                </div>

                <Button 
                  onClick={open}
                  className="neon-glow-cyan"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Supported: PDF, DOCX</span>
                  <span>•</span>
                  <span>Max size: {settings.maxFileSize}MB</span>
                  <span>•</span>
                  <span>Multiple files</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
