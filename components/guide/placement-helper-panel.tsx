'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { DemoGardenSpace } from '@/lib/demo-garden'
import {
  placementPlantOptions,
  recommendPlacement,
  type PlacementPlantKind,
} from '@/lib/placement-helper'
import { MapPin } from 'lucide-react'

interface PlacementHelperPanelProps {
  spaces: DemoGardenSpace[]
}

export function PlacementHelperPanel({ spaces }: PlacementHelperPanelProps) {
  const [kind, setKind] = useState<PlacementPlantKind>('general')
  const recommendation = useMemo(() => recommendPlacement(kind, spaces), [kind, spaces])

  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Plant Check
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A quick placement hint based on your spaces — not a full planner.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {placementPlantOptions.map((option) => (
            <Button
              key={option.id}
              type="button"
              size="sm"
              variant={kind === option.id ? 'default' : 'outline'}
              onClick={() => setKind(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 space-y-3 text-sm">
          <PlacementRow label="Best place" value={recommendation.bestPlace} />
          <PlacementRow label="Why" value={recommendation.why} />
          <PlacementRow label="Next" value={recommendation.nextStep} />
          <PlacementRow label="Caution" value={recommendation.caution} />
        </div>
      </CardContent>
    </Card>
  )
}

function PlacementRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 leading-relaxed">{value}</p>
    </div>
  )
}
