import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/10">
      <section className="relative overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20240716_062946-AC71Knsy1Bx0AOanquS95W8IzISrOf.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        <div className="container px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Leaf className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
              Momma D&apos;s <span className="text-primary">Garden</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              A family garden notebook for tracking plants, harvests, care notes, experiments, and the little wins that make the garden feel alive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/my-garden">Open the Garden</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/my-garden">Explore Garden Tools</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
