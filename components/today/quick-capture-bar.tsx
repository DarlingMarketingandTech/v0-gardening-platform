'use client'

import { Camera, Check, FileText, Leaf } from 'lucide-react'
import { ActionPill, AppSurface } from '@/components/garden-ui'

export function QuickCaptureBar() {
  return (
    <AppSurface variant="glass" padding="sm">
      <p className="mb-3 text-[11px] font-medium tracking-wide text-[var(--garden-text-muted)] uppercase">
        Quick capture
      </p>
      <div className="flex flex-wrap gap-2">
        <ActionPill type="button" variant="secondary" size="sm" disabled icon={<FileText className="size-3.5" />}>
          Add note (soon)
        </ActionPill>
        <ActionPill type="button" variant="secondary" size="sm" disabled icon={<Check className="size-3.5" />}>
          Mark watered (soon)
        </ActionPill>
        <ActionPill type="button" variant="secondary" size="sm" disabled icon={<Camera className="size-3.5" />}>
          Add photo (soon)
        </ActionPill>
        <ActionPill href="/my-garden/care" variant="primary" size="sm" icon={<Leaf className="size-3.5" />}>
          Start Care check
        </ActionPill>
      </div>
    </AppSurface>
  )
}
