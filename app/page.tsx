import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, Sprout, Calendar, Database, Sun, Droplets, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Leaf className="h-4 w-4" />
                <span>Your Personal Gardening Companion</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
                Grow Your Dream Garden with Confidence
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
                Plan, plant, and nurture your perfect garden with personalized recommendations, expert guidance, and a comprehensive plant database.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/auth/sign-up">
                        Start Growing Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/plants">Browse Plants</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 text-6xl opacity-10">🌻</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-10">🌿</div>
          <div className="absolute top-40 right-20 text-4xl opacity-10">🌱</div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From planning to harvest, we provide the tools and knowledge to help your garden thrive.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Plant Database</CardTitle>
                  <CardDescription>
                    Explore hundreds of plants with detailed growing information, care tips, and companion planting suggestions.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Sprout className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Garden Planner</CardTitle>
                  <CardDescription>
                    Design and organize your garden beds, track plant placement, and visualize your garden layout.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Season Planner</CardTitle>
                  <CardDescription>
                    Know exactly when to plant, transplant, and harvest based on your location and climate zone.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple Steps to a Beautiful Garden</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Getting started is easy. Follow these simple steps to begin your gardening journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Create Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Set up your location and climate zone for personalized recommendations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Plan Your Garden</h3>
                <p className="text-sm text-muted-foreground">
                  Browse plants, create garden beds, and organize your planting layout.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Grow & Harvest</h3>
                <p className="text-sm text-muted-foreground">
                  Track your plants&apos; progress and get reminders for care and harvesting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-primary-foreground/80">Plants in Database</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10k+</div>
                <div className="text-primary-foreground/80">Gardens Planned</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-primary-foreground/80">Climate Zones</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-primary-foreground/80">Plant Care Tips</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-20">
            <div className="container px-4">
              <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-accent/10 border-0">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="flex justify-center gap-2 mb-6">
                    <Sun className="h-8 w-8 text-yellow-500" />
                    <Droplets className="h-8 w-8 text-blue-500" />
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Ready to Start Your Garden?
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    Join thousands of gardeners who are growing beautiful, productive gardens with GreenThumb.
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/auth/sign-up">
                      Create Free Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
