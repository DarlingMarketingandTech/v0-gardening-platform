'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Garden } from '@/lib/types'

export default function NewGardenPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [gardenType, setGardenType] = useState<'raised_bed' | 'container' | 'in_ground' | 'greenhouse' | 'balcony' | 'indoor' | ''>('')
  const [sizeSqft, setSizeSqft] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Demo-first placeholder until garden spaces move to household-backed persistence.
      const savedGardens = localStorage.getItem('mommaGardens')
      let gardens: Garden[] = []
      if (savedGardens) {
        try {
          const parsedGardens = JSON.parse(savedGardens)
          gardens = Array.isArray(parsedGardens) ? parsedGardens : []
        } catch {
          gardens = []
          localStorage.setItem('mommaGardens', JSON.stringify(gardens))
        }
      }

      // Create new garden
      if (!gardenType) {
        setError('Please select a garden type')
        setLoading(false)
        return
      }

      const newGarden: Garden = {
        id: Date.now().toString(),
        name,
        description: description || '',
        garden_type: gardenType as 'raised_bed' | 'container' | 'in_ground' | 'greenhouse' | 'balcony' | 'indoor',
        size_sqft: sizeSqft ? parseFloat(sizeSqft) : null,
        location: location || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      gardens.push(newGarden)
      localStorage.setItem('mommaGardens', JSON.stringify(gardens))

      toast.success('Garden created successfully!')
      router.push('/gardens')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create garden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8 max-w-2xl">
        <Link 
          href="/gardens" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Gardens
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Garden</CardTitle>
            <CardDescription>
              Set up a new garden space to start planning and tracking your plants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Garden Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Backyard Vegetable Garden"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gardenType">Garden Type *</Label>
                <Select value={gardenType} onValueChange={(value: any) => setGardenType(value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select garden type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raised_bed">Raised Bed</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                    <SelectItem value="in_ground">In Ground</SelectItem>
                    <SelectItem value="greenhouse">Greenhouse</SelectItem>
                    <SelectItem value="balcony">Balcony</SelectItem>
                    <SelectItem value="indoor">Indoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your garden..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sizeSqft">Size (sq ft)</Label>
                  <Input
                    id="sizeSqft"
                    type="number"
                    placeholder="e.g., 100"
                    value={sizeSqft}
                    onChange={(e) => setSizeSqft(e.target.value)}
                    disabled={loading}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Backyard, South side"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading || !name || !gardenType}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Garden
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
