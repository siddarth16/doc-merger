"use client"

import { Header } from "@/components/layout/header"
import { UploadDropzone } from "@/components/upload/upload-dropzone"
import { FileList } from "@/components/file-list/file-list"
import { MergeControls } from "@/components/merge/merge-controls"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const files = useAppStore((state) => state.files)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Doc Merger
            </h1>
            <p className="text-muted-foreground text-lg">
              Privacy-first document merging. Your files never leave your browser.
            </p>
          </div>
          
          <UploadDropzone />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Files to Merge</h2>
              <span className="text-sm text-muted-foreground">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <FileList />
          </div>
        )}
      </main>

      {/* Fixed Merge Controls */}
      {files.length > 0 && <MergeControls />}
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            🔒 Privacy-first • Your files are processed locally in your browser • 
            No data is sent to our servers
          </p>
        </div>
      </footer>
    </div>
  )
}
