'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useTransition,
} from 'react'
import { CareResultCard } from '@/components/care/care-result-card'
import { AppSurface } from '@/components/garden-ui/app-surface'
import { identifyPlantAction } from '@/app/actions/identify-plant'
import type { IdentifyAndEnrichResult } from '@/lib/plant-intelligence'
import {
  buildSamplePlantIdentifyCareResult,
  mapPlantIdentifyToCareResult,
} from '@/lib/care/map-plant-identify-to-care-result'
import { getCareCopy } from '@/lib/care/care-copy'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Camera, ChevronDown, Loader2, ScanLine, Sparkles } from 'lucide-react'

export type PlantIdentifyPanelHandle = {
  openFilePicker: () => void
}

export interface PlantIdentifyPanelProps {
  /** When set (e.g. from camera overlay capture), preloads the preview image once. */
  initialImageDataUrl?: string | null
  onConsumedInitialImage?: () => void
}

export const PlantIdentifyPanel = forwardRef<PlantIdentifyPanelHandle, PlantIdentifyPanelProps>(
  function PlantIdentifyPanel({ initialImageDataUrl, onConsumedInitialImage }, ref) {
    const copy = getCareCopy()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [result, setResult] = useState<IdentifyAndEnrichResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()
    const [samplePreview, setSamplePreview] = useState(false)

    useImperativeHandle(ref, () => ({
      openFilePicker: () => fileInputRef.current?.click(),
    }))

    useEffect(() => {
      if (!initialImageDataUrl) return
      setSelectedImage(initialImageDataUrl)
      setResult(null)
      setError(null)
      setSamplePreview(false)
      onConsumedInitialImage?.()
    }, [initialImageDataUrl, onConsumedInitialImage])

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setError(null)
      setResult(null)
      setSamplePreview(false)
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }

    const runIdentify = () => {
      if (!selectedImage) return
      setError(null)
      setSamplePreview(false)
      startTransition(async () => {
        try {
          const data = await identifyPlantAction(selectedImage)
          setResult(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Identification failed. Try another photo.')
        }
      })
    }

    const mappedCareResult = result ? mapPlantIdentifyToCareResult(result, selectedImage) : null
    const sampleCareResult = buildSamplePlantIdentifyCareResult(selectedImage)

    return (
      <Card className="border-emerald-200/50 bg-linear-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-emerald-600" aria-hidden />
            Identify a plant
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Snap or upload a photo. We show a calm guess with confidence — not a chatbot.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            className="hidden"
          />

          {selectedImage ? (
            <img src={selectedImage} alt="Plant to identify" className="h-40 w-full rounded-lg object-cover" />
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg p-6 text-center hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors"
            >
              <Camera className="h-8 w-8 mx-auto text-emerald-600 mb-2" aria-hidden />
              <p className="text-sm font-medium">Tap to add a photo</p>
            </button>
          )}

          {selectedImage ? (
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={pending}
                onClick={runIdentify}
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" aria-hidden />
                )}
                Identify
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedImage(null)
                  setResult(null)
                  setError(null)
                  setSamplePreview(false)
                }}
              >
                New photo
              </Button>
            </div>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {samplePreview ? (
            <div className="space-y-3">
              <AppSurface variant="tinted" padding="sm" radius="lg" className="border-primary/20">
                <p className="text-sm leading-relaxed text-(--garden-text)">{copy.sections.sampleIdentityBanner}</p>
              </AppSurface>
              <CareResultCard result={sampleCareResult} />
            </div>
          ) : null}

          {!samplePreview && mappedCareResult ? (
            <div className="space-y-3">
              <CareResultCard result={mappedCareResult} />
              {result && result.identification.candidates.length > 1 ? (
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm font-medium">
                    Other possible matches
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 space-y-2 text-xs text-muted-foreground px-1">
                    {result.identification.candidates.map((c) => (
                      <p key={c.scientificName}>
                        {c.commonNames[0] ?? c.scientificName} — {c.confidence}%
                      </p>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : null}
            </div>
          ) : null}

          {!samplePreview && result && !mappedCareResult ? (
            <div className="space-y-3 rounded-lg border bg-background/80 p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{copy.sections.identifyNoMatchBody}</p>
              {result.identification.disclaimer ? (
                <p className="text-xs leading-relaxed text-muted-foreground">{result.identification.disclaimer}</p>
              ) : null}
              <Button type="button" variant="secondary" size="sm" onClick={() => setSamplePreview(true)}>
                {copy.sections.identifyTrySample}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    )
  },
)
