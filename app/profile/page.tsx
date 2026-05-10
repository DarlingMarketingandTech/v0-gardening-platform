'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import type { Profile } from '@/lib/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [location, setLocation] = useState('')
  const [climateZone, setClimateZone] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('beginner')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setProfile(profile)
        setFullName(profile.full_name || '')
        setLocation(profile.location || '')
        setClimateZone(profile.climate_zone || '')
        setExperienceLevel(profile.experience_level || 'beginner')
      }

      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) return

    startTransition(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          location: location || null,
          climate_zone: climateZone || null,
          experience_level: experienceLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        setError(error.message)
        return
      }

      toast.success('Profile updated successfully!')
      router.refresh()
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 container px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and gardening preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{fullName || 'Your Profile'}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State or Region"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Used for personalized planting recommendations
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="climateZone">Climate Zone</Label>
                <Select value={climateZone} onValueChange={setClimateZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your climate zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Zone 1 (-60 to -50°F)</SelectItem>
                    <SelectItem value="2">Zone 2 (-50 to -40°F)</SelectItem>
                    <SelectItem value="3">Zone 3 (-40 to -30°F)</SelectItem>
                    <SelectItem value="4">Zone 4 (-30 to -20°F)</SelectItem>
                    <SelectItem value="5">Zone 5 (-20 to -10°F)</SelectItem>
                    <SelectItem value="6">Zone 6 (-10 to 0°F)</SelectItem>
                    <SelectItem value="7">Zone 7 (0 to 10°F)</SelectItem>
                    <SelectItem value="8">Zone 8 (10 to 20°F)</SelectItem>
                    <SelectItem value="9">Zone 9 (20 to 30°F)</SelectItem>
                    <SelectItem value="10">Zone 10 (30 to 40°F)</SelectItem>
                    <SelectItem value="11">Zone 11 (40 to 50°F)</SelectItem>
                    <SelectItem value="12">Zone 12 (50 to 60°F)</SelectItem>
                    <SelectItem value="13">Zone 13 (60 to 70°F)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  USDA Plant Hardiness Zone based on average minimum winter temperature
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - Just starting out</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                    <SelectItem value="advanced">Advanced - Experienced gardener</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
