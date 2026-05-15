import Link from 'next/link'
import { GardenLog } from '@/components/dashboard/garden-log'
import { Button } from '@/components/ui/button'
import { getGardenContext } from '@/lib/garden-os/get-garden-context'

/** Internal fallback — not in primary V2 navigation. */
export default async function GardenLogFallbackPage() {
  const context = await getGardenContext()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold leading-tight">Garden log</h2>
          <p className="text-sm text-muted-foreground">A calm place for notes and memories.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/my-garden/today">Back to Today</Link>
        </Button>
      </div>
      <GardenLog householdId={context.householdId} />
    </div>
  )
}
