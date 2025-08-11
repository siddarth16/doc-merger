"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function MergeControls() {
  const { 
    files, 
    settings, 
    updateSettings, 
    isLoading, 
    progress,
    setLoading,
    setProgress 
  } = useAppStore()
  
  const [outputName, setOutputName] = useState(settings.outputFileName)

  // Determine merge type and compatibility
  const pdfFiles = files.filter(f => f.kind === 'pdf')
  const docxFiles = files.filter(f => f.kind === 'docx')
  const isMixed = pdfFiles.length > 0 && docxFiles.length > 0
  const canMerge = files.length > 1

  // Determine output format
  const outputFormat = isMixed 
    ? (settings.conversionEnabled ? 'pdf' : null)
    : files.length > 0 ? files[0].kind : null

  const handleMerge = async () => {
    if (!canMerge) return

    try {
      setLoading(true)
      setProgress(0)

      if (isMixed && !settings.conversionEnabled) {
        toast.error("Mixed file types require conversion to be enabled in settings")
        return
      }

      // Update output filename if changed
      if (outputName !== settings.outputFileName) {
        updateSettings({ outputFileName: outputName })
      }

      // Import merge service dynamically
      const { MergeService, downloadFile } = await import('@/lib/merge-service')
      const mergeService = new MergeService()

      // Merge files with progress tracking
      const result = await mergeService.mergeFiles(
        files,
        {
          filename: outputName,
          title: settings.pdfMetadata.title,
          author: settings.pdfMetadata.author,
        },
        (progress) => {
          setProgress(progress.progress)
        }
      )

      // Download the merged file
      downloadFile(result.data, result.filename, result.mimeType)
      
      toast.success(`Files merged successfully! Downloaded ${result.filename}`)
      
      // Clean up
      mergeService.dispose()
      
    } catch (error) {
      console.error("Merge error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to merge files")
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/95 backdrop-blur-sm z-40"
    >
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* File Count & Output Info */}
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="font-medium">{files.length} files</span>
              <span className="text-muted-foreground ml-2">
                ({pdfFiles.length} PDF, {docxFiles.length} DOCX)
              </span>
            </div>

            {/* Mixed Type Warning */}
            {isMixed && !settings.conversionEnabled && (
              <div className="flex items-center space-x-2 text-amber-500">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  Conversion required for mixed types
                </span>
              </div>
            )}
          </div>

          {/* Output Filename */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="output-name" className="text-sm">
              Output:
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="output-name"
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
                className="w-64 h-9"
                placeholder="merged-document"
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">
                .{outputFormat || 'pdf'}
              </span>
            </div>
          </div>

          {/* Merge Button */}
          <div className="flex items-center space-x-4">
            {isLoading && (
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            <Button
              onClick={handleMerge}
              disabled={!canMerge || isLoading || (isMixed && !settings.conversionEnabled)}
              size="lg"
              className={cn(
                "neon-glow-cyan min-w-32",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Merging...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Merge Files
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
