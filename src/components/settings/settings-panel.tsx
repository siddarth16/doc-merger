"use client"

import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Palette, FileText, Zap } from "lucide-react"

export function SettingsPanel() {
  const { settings, updateSettings } = useAppStore()

  const accentColors = [
    { name: 'Cyan', value: 'cyan', color: '#00ffff' },
    { name: 'Violet', value: 'violet', color: '#a855f7' },
    { name: 'Green', value: 'green', color: '#22c55e' },
  ]

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
        <SheetDescription>
          Customize your document merging experience
        </SheetDescription>
      </SheetHeader>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="output">
            <FileText className="w-4 h-4 mr-2" />
            Output
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Zap className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Accent Color</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose your preferred neon accent color
              </p>
              <div className="grid grid-cols-3 gap-2">
                {accentColors.map((color) => (
                  <Button
                    key={color.value}
                    variant={settings.accentColor === color.value ? "default" : "outline"}
                    onClick={() => updateSettings({ accentColor: color.value as 'cyan' | 'violet' | 'green' })}
                    className="h-12 flex flex-col items-center space-y-1"
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="output" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="pdf-title">PDF Title</Label>
              <Input
                id="pdf-title"
                value={settings.pdfMetadata.title || ''}
                onChange={(e) => updateSettings({
                  pdfMetadata: { ...settings.pdfMetadata, title: e.target.value }
                })}
                placeholder="Merged Document"
              />
            </div>

            <div>
              <Label htmlFor="pdf-author">PDF Author</Label>
              <Input
                id="pdf-author"
                value={settings.pdfMetadata.author || ''}
                onChange={(e) => updateSettings({
                  pdfMetadata: { ...settings.pdfMetadata, author: e.target.value }
                })}
                placeholder="Doc Merger"
              />
            </div>

            <div>
              <Label>Max File Size (MB)</Label>
              <div className="mt-2 mb-4">
                <Slider
                  value={[settings.maxFileSize]}
                  onValueChange={(value) => updateSettings({ maxFileSize: value[0] })}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Current limit: {settings.maxFileSize}MB per file
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">
                  Document Conversion
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable conversion between PDF and DOCX for mixed merges
                </p>
              </div>
              <Switch
                checked={settings.conversionEnabled}
                onCheckedChange={(checked) => updateSettings({ conversionEnabled: checked })}
              />
            </div>

            {settings.conversionEnabled && (
              <div className="ml-4 space-y-4 border-l-2 border-border pl-4">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={settings.conversionApiKey || ''}
                    onChange={(e) => updateSettings({ conversionApiKey: e.target.value })}
                    placeholder="Enter your conversion API key"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    API key for {settings.conversionProvider} service
                  </p>
                </div>
              </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                ⚠️ Conversion requires sending DOCX files to external services. 
                Only enable if you trust the conversion provider with your documents.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
