"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  MapPin, 
  ArrowLeft, 
  Save, 
  Loader2, 
  CheckCircle2,
  Flower2,
  Trash2
} from "lucide-react"
import { getProfile, saveProfile, geocodeAddress, clearProfile, type MomProfile } from "@/lib/profile-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<MomProfile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [saved, setSaved] = useState(false)
  const [locationFound, setLocationFound] = useState(false)

  useEffect(() => {
    const p = getProfile()
    if (!p.setupComplete) {
      router.push('/setup')
      return
    }
    setProfile(p)
  }, [router])

  const updateProfile = (updates: Partial<MomProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates })
      setLocationFound(false)
    }
  }

  const handleAddressLookup = async () => {
    if (!profile?.address || !profile?.city || !profile?.state) return
    
    setIsLookingUp(true)
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
    setIsLookingUp(false)
  }

  const handleSave = () => {
    if (!profile) return
    setIsSaving(true)
    saveProfile(profile)
    setSaved(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaved(false)
    }, 2000)
  }

  const handleReset = () => {
    clearProfile()
    router.push('/setup')
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-primary/10">
        <div className="container px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Update your garden profile
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saved ? 'Saved!' : 'Save'}
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-2xl space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="e.g., Mom, Diane"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gardenName">Garden Name</Label>
              <Input
                id="gardenName"
                value={profile.gardenName}
                onChange={(e) => updateProfile({ gardenName: e.target.value })}
                placeholder="e.g., Mom's Backyard Paradise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
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
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Location</CardTitle>
                <CardDescription>For weather and sunlight data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => updateProfile({ address: e.target.value })}
                placeholder="123 Garden Lane"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => updateProfile({ city: e.target.value })}
                  placeholder="Springfield"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={profile.state}
                  onValueChange={(value) => updateProfile({ state: value })}
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
                value={profile.zipCode}
                onChange={(e) => updateProfile({ zipCode: e.target.value })}
                placeholder="12345"
                maxLength={5}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAddressLookup}
              disabled={isLookingUp || !profile.address || !profile.city || !profile.state}
            >
              {isLookingUp ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Finding location...
                </>
              ) : locationFound ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Location Updated!
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Update Location Coordinates
                </>
              )}
            </Button>

            {profile.latitude && profile.longitude && (
              <p className="text-sm text-center text-muted-foreground">
                Current coordinates: {profile.latitude.toFixed(4)}, {profile.longitude.toFixed(4)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Reset App</CardTitle>
            <CardDescription>
              This will clear all your data and start fresh
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Everything
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all your profile data, tasks, and garden logs. 
                    You&apos;ll need to set up your profile again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>
                    Yes, reset everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Flower2 className="h-4 w-4" />
          <span className="text-sm">Momma D&apos;s Garden Tool</span>
        </div>
      </footer>
    </div>
  )
}
