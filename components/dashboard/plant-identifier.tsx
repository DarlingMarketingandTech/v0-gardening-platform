'use client'

import { ActionPill } from '@/components/garden-ui/action-pill'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCareCopy } from '@/lib/care/care-copy'
import { ScanLine } from 'lucide-react'

const CARE_PLANT_IDENTIFY_HREF = '/my-garden/care'

/**
 * Legacy dashboard entry for plant photo match. Identification runs in **Care → Plant Identify**
 * (`PlantIdentifyPanel` + `CareResultCard`); this card only routes people there.
 */
export function PlantIdentifier() {
  const copy = getCareCopy()

  return (
    <Card className="border-emerald-200/50 bg-linear-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ScanLine className="h-5 w-5 text-emerald-600" aria-hidden />
          Plant Identifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{copy.sections.dashboardIdentifyHint}</p>
        <ActionPill href={CARE_PLANT_IDENTIFY_HREF} variant="primary" size="md" icon={<ScanLine className="size-4" aria-hidden />}>
          {copy.sections.openPlantIdentify}
        </ActionPill>
      </CardContent>
    </Card>
  )
}
