import Link from 'next/link'
import { BookOpen, Bug, CloudSun, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TodayNeedHelpStrip() {
  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-muted/20 px-3 py-3">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Need help?</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" className="shrink-0" asChild>
          <Link href="/my-garden/care">
            <Leaf className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Identify plant
          </Link>
        </Button>
        <Button type="button" variant="secondary" size="sm" className="shrink-0" asChild>
          <Link href="/my-garden/care">
            <Bug className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            What&apos;s wrong?
          </Link>
        </Button>
        <Button type="button" variant="secondary" size="sm" className="shrink-0" asChild>
          <Link href="/my-garden/care">
            <CloudSun className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Seasonal advice
          </Link>
        </Button>
        <Button type="button" variant="secondary" size="sm" className="shrink-0" asChild>
          <Link href="/my-garden/care">
            <BookOpen className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Learn
          </Link>
        </Button>
      </div>
      <p className="mt-2 text-xs leading-snug text-muted-foreground">
        These open Care for plant checks, pests, and calm follow-up guidance.
      </p>
    </div>
  )
}
