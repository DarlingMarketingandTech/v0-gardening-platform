import { AppSurface, PlantImageFrame } from '@/components/garden-ui'
import type { PlanCropWindow } from '@/lib/garden-os/types'
import { Sprout } from 'lucide-react'

interface CropPlanCardProps {
  window: PlanCropWindow
}

export function CropPlanCard({ window: w }: CropPlanCardProps) {
  return (
    <AppSurface variant="elevated" padding="md" radius="lg" className="flex gap-4">
      <PlantImageFrame
        alt="Sprout placeholder"
        size="sm"
        fallback={<Sprout className="size-5 text-[var(--garden-primary)]" aria-hidden />}
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-semibold text-[var(--garden-text)]">{w.title}</p>
        <p className="text-xs leading-relaxed text-[var(--garden-text-muted)]">{w.description}</p>
      </div>
    </AppSurface>
  )
}
