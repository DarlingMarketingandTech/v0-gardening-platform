'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GardenCard } from '@/components/garden-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Sprout } from 'lucide-react'
import type { Garden } from '@/lib/types'

export default function GardensPage() {
  const [gardens, setGardens] = useState<Garden[]>([])
  const [loading, setLoading] = useState(true)

  // Load gardens from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mommaGardens')
    if (saved) {
      try {
        setGardens(JSON.parse(saved))
      } catch {
        setGardens([])
      }
    }
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Gardens</h1>
            <p className="text-muted-foreground">
              Manage and organize all your garden spaces.
            </p>
          </div>
          <Button asChild>
            <Link href="/gardens/new">
              <Plus className="h-4 w-4 mr-2" />
              New Garden
            </Link>
          </Button>
        </div>

        {!loading && gardens && gardens.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gardens.map((garden: Garden) => (
              <GardenCard 
                key={garden.id} 
                garden={garden} 
                plantCount={0}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">No gardens yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first garden to start planning your plants and tracking your growing journey.
              </p>
              <Button size="lg" asChild>
                <Link href="/gardens/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Garden
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
