"use client"

import { useAppStore } from "@/lib/store"
import { FileCard } from "./file-card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export function FileList() {
  const { files, clearFiles } = useAppStore()

  const handleClearAll = () => {
    clearFiles()
    toast.success("All files cleared")
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* File Cards */}
      <div className="space-y-3">
        {files.map((file, index) => (
          <FileCard
            key={file.id}
            file={file}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
