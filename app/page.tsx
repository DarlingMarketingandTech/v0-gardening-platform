import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20240716_062946-AC71Knsy1Bx0AOanquS95W8IzISrOf.jpg')`
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
              {user 
                ? "A private family garden notebook — tracking plants, sharing observations, and nurturing growth together"
                : "A private family garden notebook designed for the Darling family to track plants, share observations, and nurture their garden together"
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button size="lg" asChild>
                    <Link href="/my-garden">Go to Your Garden</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/settings">Settings</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/auth/sign-up">Join the Garden</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
