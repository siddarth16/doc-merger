"use client"

import { Settings, Zap, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SettingsPanel } from "@/components/settings/settings-panel"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-cyan">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Doc Merger</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Stats */}
          <div className="hidden sm:flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-primary" />
              <span>Client-side Processing</span>
            </div>
          </div>

          {/* Settings */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="glass-hover">
                <Settings className="w-4 h-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96 glass">
              <SettingsPanel />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
