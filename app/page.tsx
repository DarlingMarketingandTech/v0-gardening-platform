import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
import { createClient } from '@/lib/supabase/server'
import { getMyHouseholdMembership } from '@/lib/access/private-beta'

export default async function Home() {
  let signedInContinueHref = '/my-garden'
  let signedInContinueLabel = 'Open the Garden'

  if (hasPublicSupabaseEnv()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { householdId } = await getMyHouseholdMembership(supabase)
      signedInContinueHref = householdId ? '/my-garden' : '/auth/login'
      signedInContinueLabel = householdId ? 'Continue to your garden' : 'Sign in to your garden'
    }
  }

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
              A family garden notebook for tracking plants, harvests, care notes, experiments, and the little wins that
              make the garden feel alive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href={signedInContinueHref}>{signedInContinueLabel}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/my-garden">Explore demo garden</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Link href="/auth/login" className="hover:text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
              <Link href="/auth/sign-up" className="hover:text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
