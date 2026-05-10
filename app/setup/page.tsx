"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flower2, MapPin, Sun, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { getProfile, saveProfile, geocodeAddress, type MomProfile } from "@/lib/profile-store"

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [locationFound, setLocationFound] = useState(false)
  
  const [profile, setProfile] = useState<MomProfile>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: null,
    longitude: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    gardenName: "Mom's Garden",
    experienceLevel: 'beginner',
    setupComplete: false,
  })

  useEffect(() => {
    const existing = getProfile()
    if (existing.setupComplete) {
      router.push('/dashboard')
    }
  }, [router])

  const updateProfile = (updates: Partial<MomProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const handleAddressLookup = async () => {
    if (!profile.address || !profile.city || !profile.state) return
    
    setIsLoading(true)
    setLocationFound(false)
    
    const coords = await geocodeAddress(
      profile.address,
      profile.city,
      profile.state,
      profile.zipCode
    )
    
    if (coords) {
      updateProfile({
        latitude: coords.lat,
        longitude: coords.lon
      })
      setLocationFound(true)
    }
    
    setIsLoading(false)
  }

  const handleComplete = () => {
    saveProfile({ ...profile, setupComplete: true })
    router.push('/dashboard')
  }

  const canProceedStep1 = profile.name.trim().length > 0
  const canProceedStep2 = profile.address && profile.city && profile.state && profile.latitude
  const canComplete = canProceedStep1 && canProceedStep2

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Flower2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Momma D&apos;s Garden
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s set up your personal gardening companion
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-primary' : s < step ? 'w-8 bg-primary/50' : 'w-8 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Name & Garden */}
        {step === 1 && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Hello, Gardener!</CardTitle>
              <CardDescription>
                What should we call you?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mom, Diane, Momma D"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gardenName">Name Your Garden</Label>
                <Input
                  id="gardenName"
                  placeholder="e.g., Mom's Backyard Paradise"
                  value={profile.gardenName}
                  onChange={(e) => updateProfile({ gardenName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Gardening Experience</Label>
                <Select
                  value={profile.experienceLevel}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                    updateProfile({ experienceLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Just Starting Out</SelectItem>
                    <SelectItem value="intermediate">Growing for a Few Years</SelectItem>
                    <SelectItem value="advanced">Seasoned Green Thumb</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Where&apos;s Your Garden?</CardTitle>
              <CardDescription>
                This helps us show accurate weather and sunlight info
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Garden Lane"
                  value={profile.address}
                  onChange={(e) => {
                    updateProfile({ address: e.target.value })
                    setLocationFound(false)
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Springfield"
                    value={profile.city}
                    onChange={(e) => {
                      updateProfile({ city: e.target.value })
                      setLocationFound(false)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={profile.state}
                    onValueChange={(value) => {
                      updateProfile({ state: value })
                      setLocationFound(false)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="12345"
                  value={profile.zipCode}
                  onChange={(e) => {
                    updateProfile({ zipCode: e.target.value })
                    setLocationFound(false)
                  }}
                  maxLength={5}
                />
              </div>

              {/* Location Lookup Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddressLookup}
                disabled={isLoading || !profile.address || !profile.city || !profile.state}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finding your garden...
                  </>
                ) : locationFound ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Location Found!
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Find My Garden Location
                  </>
                )}
              </Button>

              {locationFound && profile.latitude && profile.longitude && (
                <p className="text-sm text-center text-muted-foreground">
                  Coordinates: {profile.latitude.toFixed(4)}, {profile.longitude.toFixed(4)}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  className="flex-1"
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                <Sun className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>You&apos;re All Set!</CardTitle>
              <CardDescription>
                Here&apos;s your garden profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gardener</span>
                  <span className="font-medium">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Garden Name</span>
                  <span className="font-medium">{profile.gardenName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-right">
                    {profile.city}, {profile.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium capitalize">{profile.experienceLevel}</span>
                </div>
              </div>

              <div className="bg-accent/30 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  We&apos;ll use your location to show:
                </p>
                <div className="flex justify-center gap-4 text-sm font-medium">
                  <span>Local Weather</span>
                  <span>Sunrise/Sunset</span>
                  <span>Frost Dates</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button 
                  className="flex-1"
                  size="lg"
                  onClick={handleComplete}
                  disabled={!canComplete}
                >
                  <Flower2 className="w-4 h-4 mr-2" />
                  Start Gardening!
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
