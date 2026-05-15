'use client'

import { AppSurface } from '@/components/garden-ui/app-surface'
import { ActionPill } from '@/components/garden-ui/action-pill'
import { ScanLine, Upload } from 'lucide-react'

export interface CareScanEntryCardProps {
  onIdentifyClick: () => void
  onUploadClick: () => void
}

export function CareScanEntryCard({ onIdentifyClick, onUploadClick }: CareScanEntryCardProps) {
  return (
    <AppSurface variant="tinted" padding="lg" radius="xl" className="border-primary/20 shadow-(--garden-shadow-soft)">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-(--garden-primary-soft) text-(--garden-primary-dark)">
            <ScanLine className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium tracking-wide text-primary uppercase">Scan</p>
            <h2 className="text-lg font-semibold leading-tight text-(--garden-text) md:text-xl">
              Identify a plant from your garden
            </h2>
            <p className="text-sm leading-relaxed text-(--garden-text-muted)">
              Use your camera for a quick snap, or upload a photo you already have. Calm results — no chatter.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <ActionPill type="button" variant="primary" size="md" onClick={onIdentifyClick}>
            Identify a plant
          </ActionPill>
          <ActionPill
            type="button"
            variant="secondary"
            size="md"
            icon={<Upload className="size-4" aria-hidden />}
            onClick={onUploadClick}
          >
            Upload a photo
          </ActionPill>
        </div>
      </div>
    </AppSurface>
  )
}
