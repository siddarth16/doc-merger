"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GripVertical, X, Edit2, Check, FileText, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { formatFileSize } from "@/lib/file-utils"
import { toast } from "sonner"
import type { FileItem } from "@/lib/store"
import { cn } from "@/lib/utils"

interface FileCardProps {
  file: FileItem
  index: number
}

export function FileCard({ file, index }: FileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(file.name)
  const { removeFile, updateFile } = useAppStore()

  const handleRemove = () => {
    removeFile(file.id)
    toast.success(`Removed ${file.name}`)
  }

  const handleSaveName = () => {
    if (editName.trim() && editName !== file.name) {
      updateFile(file.id, { name: editName.trim() })
      toast.success("File renamed")
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      setEditName(file.name)
      setIsEditing(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass glass-hover rounded-lg p-4 border-animated"
    >
      <div className="flex items-center space-x-4">
        {/* Drag Handle */}
        <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
          <GripVertical className="w-5 h-5" />
        </div>

        {/* File Icon & Type */}
        <div className="flex-shrink-0">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            file.kind === 'pdf' ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
          )}>
            {file.kind === 'pdf' ? (
              <FileText className="w-6 h-6" />
            ) : (
              <File className="w-6 h-6" />
            )}
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name */}
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <div className="flex-1 flex items-center space-x-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveName}
                  className="h-8 w-8 p-0"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-medium truncate flex-1" title={file.name}>
                  {file.name}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {file.kind.toUpperCase()}
            </Badge>
            <span>{formatFileSize(file.size)}</span>
            {file.pages && (
              <span>{file.pages} page{file.pages !== 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Page Range (PDF only) */}
          {file.kind === 'pdf' && file.pages && (
            <div className="text-sm">
              <span className="text-muted-foreground">Pages: </span>
              <span className="font-mono">
                {file.ranges?.length === file.pages 
                  ? 'All pages' 
                  : `${file.ranges?.length || 0} of ${file.pages}`
                }
              </span>
              {/* TODO: Add page range editor */}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
