import { Flower2 } from 'lucide-react'

export function GardenShellHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur">
      <div className="container flex items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Flower2 className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold leading-tight">Momma D&apos;s Garden</h1>
          <p className="text-xs text-muted-foreground">Simple today, deeper when you want it</p>
        </div>
      </div>
    </header>
  )
}
