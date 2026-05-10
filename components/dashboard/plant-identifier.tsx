'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Camera, 
  ScanLine, 
  Upload, 
  Leaf, 
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react'

export function PlantIdentifier() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ScanLine className="h-5 w-5 text-emerald-600" />
          Plant Identifier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Snap a photo of any plant or flower to identify it instantly using AI-powered recognition.
        </p>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Camera className="h-4 w-4 mr-2" />
              Scan a Plant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                AI Plant Identification
              </DialogTitle>
              <DialogDescription>
                Upload or take a photo of a plant to identify it
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />

              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected plant"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    Choose Different
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg p-8 text-center cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
                >
                  <Upload className="h-10 w-10 mx-auto text-emerald-500 mb-3" />
                  <p className="text-sm font-medium mb-1">Click to upload or take a photo</p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, HEIC
                  </p>
                </div>
              )}

              {/* Feature explanation */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium mb-1">How it works</h4>
                    <p className="text-xs text-muted-foreground">
                      This feature uses PlantNet or iNaturalist AI to analyze your photo and identify
                      plants, flowers, trees, and even weeds. Get instant care tips and growing information.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-black/20 rounded-lg p-2">
                    <Leaf className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
                    <span className="text-xs">10K+ Plants</span>
                  </div>
                  <div className="bg-white dark:bg-black/20 rounded-lg p-2">
                    <Camera className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                    <span className="text-xs">Photo AI</span>
                  </div>
                  <div className="bg-white dark:bg-black/20 rounded-lg p-2">
                    <Sparkles className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                    <span className="text-xs">Instant ID</span>
                  </div>
                </div>
              </div>

              {selectedImage && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Identify Plant (Coming Soon)
                </Button>
              )}

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>Powered by</span>
                <a 
                  href="https://plantnet.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  PlantNet <ExternalLink className="h-3 w-3" />
                </a>
                <span>/</span>
                <a 
                  href="https://www.inaturalist.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  iNaturalist <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
