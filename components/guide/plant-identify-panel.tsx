'use client'

import { useRef, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { identifyPlantAction } from '@/app/actions/identify-plant'
import type { IdentifyAndEnrichResult } from '@/lib/plant-intelligence'
import { Camera, ChevronDown, Loader2, ScanLine, Sparkles } from 'lucide-react'

export function PlantIdentifyPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [result, setResult] = useState<IdentifyAndEnrichResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const runIdentify = () => {
    if (!selectedImage) return
    setError(null)
    startTransition(async () => {
      try {
        const data = await identifyPlantAction(selectedImage)
        setResult(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Identification failed. Try another photo.')
      }
    })
  }

  return (
    <Card className="border-emerald-200/50 bg-linear-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ScanLine className="h-5 w-5 text-emerald-600" />
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
          <img
            src={selectedImage}
            alt="Plant to identify"
            className="w-full h-40 object-cover rounded-lg"
          />
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg p-6 text-center hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors"
          >
            <Camera className="h-8 w-8 mx-auto text-emerald-600 mb-2" />
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
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
              }}
            >
              New photo
            </Button>
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {result ? <IdentificationResultCard result={result} /> : null}
      </CardContent>
    </Card>
  )
}

function IdentificationResultCard({ result }: { result: IdentifyAndEnrichResult }) {
  const top = result.identification.topMatch
  const enrichment = result.enrichment

  if (!top) {
    return (
      <p className="text-sm text-muted-foreground rounded-lg border px-3 py-2">
        {result.identification.disclaimer}
      </p>
    )
  }

  const displayName = top.commonNames[0] ?? top.scientificName

  return (
    <div className="rounded-xl border bg-background p-4 space-y-3">
      <div>
        <p className="text-lg font-semibold">{displayName}</p>
        <p className="text-sm text-muted-foreground italic">{top.scientificName}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Confidence about {top.confidence}% · {result.identification.provenance}
        </p>
      </div>

      {enrichment?.growthNotes ? (
        <p className="text-sm leading-relaxed">{enrichment.growthNotes}</p>
      ) : null}

      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
          Why we think this
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2 text-xs text-muted-foreground">
          {result.identification.candidates.map((c) => (
            <p key={c.scientificName}>
              {c.commonNames[0] ?? c.scientificName} — {c.confidence}%
            </p>
          ))}
          {enrichment?.family ? <p>Family: {enrichment.family}</p> : null}
          <p>{result.identification.disclaimer}</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
