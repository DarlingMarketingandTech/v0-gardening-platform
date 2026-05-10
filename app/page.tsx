"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flower2, Sun, Droplets, Leaf, ArrowRight, Loader2 } from "lucide-react"
import { getProfile } from "@/lib/profile-store"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profileName, setProfileName] = useState<string | null>(null)

  useEffect(() => {
    const profile = getProfile()
    if (profile.setupComplete) {
      setProfileName(profile.name)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Flower2 className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
              {profileName ? (
                <>Welcome back, <span className="text-primary">{profileName}</span>!</>
              ) : (
                <>Momma D&apos;s <span className="text-primary">Garden Tool</span></>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              {profileName 
                ? "Your personal gardening companion is ready. Check the weather, track your plants, and plan your garden."
                : "Your personal gardening companion. Track plants, check weather, plan your garden, and grow with confidence."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {profileName ? (
                <>
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/plants">Browse Plants</Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={() => router.push('/setup')}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
                <Sun className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Weather</h3>
              <p className="text-sm text-muted-foreground">
                Local forecast, UV index, and watering recommendations based on your garden&apos;s location.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Plant Tracker</h3>
              <p className="text-sm text-muted-foreground">
                Track your plants from seed to harvest with photos, notes, and care reminders.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Garden Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Smart task lists that adjust based on weather - skip watering on rainy days!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>Made with love for Momma D</p>
      </footer>
    </div>
  )
}
