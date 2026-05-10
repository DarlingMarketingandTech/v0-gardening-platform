'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Camera, 
  FileText, 
  Calendar, 
  Trash2, 
  Archive, 
  Lightbulb,
  Sprout,
  MoreHorizontal,
  Plus,
  Leaf,
  Droplets,
  Sun,
  Heart,
  AlertTriangle,
  Users,
  Apple
} from 'lucide-react'
import { getCompanionInfo, checkCompatibility } from '@/lib/companion-planting'
import { triggerHarvestConfetti } from '@/lib/confetti'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
} from '@/components/ui/alert-dialog'

interface ActiveCrop {
  id: string
  name: string
  variety?: string
  plantedAt: string
  daysToMaturity: number
  imageUrl?: string
  status: 'planted' | 'growing' | 'harvesting'
  waterNeeds: 'low' | 'moderate' | 'high'
  sunNeeds: 'full_sun' | 'partial_sun' | 'shade'
  notes: string[]
  photos: string[]
}

// Sample active crops data
const sampleCrops: ActiveCrop[] = [
  {
    id: '1',
    name: 'Tomato',
    variety: 'Roma',
    plantedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    daysToMaturity: 75,
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20230706_185416-Iafs9Siq1WdrKnmdJhVyIscMoe5hhW.jpg',
    status: 'growing',
    waterNeeds: 'moderate',
    sunNeeds: 'full_sun',
    notes: ['Looking healthy!', 'First flowers appearing'],
    photos: []
  },
  {
    id: '2',
    name: 'Cucumber',
    variety: 'English',
    plantedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    daysToMaturity: 55,
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20220618_180911-PBDTHZW4x1HiwJrf0Vqz8sEWuvlZ2P.jpg',
    status: 'growing',
    waterNeeds: 'high',
    sunNeeds: 'full_sun',
    notes: ['Vines spreading nicely'],
    photos: []
  },
  {
    id: '3',
    name: 'Basil',
    variety: 'Sweet Genovese',
    plantedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    daysToMaturity: 30,
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20230516_180831-vbTH4ec67CfLJIdGv2YjtQMBEQ5Qea.jpg',
    status: 'growing',
    waterNeeds: 'moderate',
    sunNeeds: 'full_sun',
    notes: [],
    photos: []
  },
  {
    id: '4',
    name: 'Pepper',
    variety: 'Banana',
    plantedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    daysToMaturity: 70,
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20230706_185416-Iafs9Siq1WdrKnmdJhVyIscMoe5hhW.jpg',
    status: 'harvesting',
    waterNeeds: 'moderate',
    sunNeeds: 'full_sun',
    notes: ['Ready to pick!'],
    photos: []
  }
]

interface FunFact {
  cropId: string
  fact: string
  loading: boolean
}

function CircularProgress({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference
  
  // Color based on progress
  const getColor = () => {
    if (progress >= 100) return 'text-amber-500'
    if (progress >= 75) return 'text-lime-500'
    if (progress >= 50) return 'text-green-500'
    return 'text-emerald-500'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={getColor()}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease'
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{Math.min(progress, 100)}%</span>
      </div>
    </div>
  )
}

function GrowthProgressCard({ crop, allCrops, onDelete, onArchive, onAddNote, onAddPhoto }: {
  crop: ActiveCrop
  allCrops: ActiveCrop[]
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onAddNote: (id: string, note: string) => void
  onAddPhoto: (id: string, photo: string) => void
}) {
  const [funFact, setFunFact] = useState<{ fact: string; loading: boolean }>({ fact: '', loading: true })
  const [noteText, setNoteText] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  // Calculate progress
  const plantedDate = new Date(crop.plantedAt)
  const today = new Date()
  const daysSincePlanted = Math.floor((today.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24))
  const progress = Math.round((daysSincePlanted / crop.daysToMaturity) * 100)
  const daysRemaining = Math.max(0, crop.daysToMaturity - daysSincePlanted)
  
  // Estimated harvest date
  const harvestDate = new Date(plantedDate)
  harvestDate.setDate(harvestDate.getDate() + crop.daysToMaturity)
  
  // Fetch fun fact from Wikipedia
  useEffect(() => {
    const fetchFunFact = async () => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(crop.name)}`
        )
        if (response.ok) {
          const data = await response.json()
          // Extract first sentence as fun fact
          const extract = data.extract || ''
          const sentences = extract.split('. ')
          // Find an interesting fact (skip first sentence which is usually a definition)
          const fact = sentences.length > 1 
            ? sentences[1] + '.' 
            : sentences[0] + '.'
          setFunFact({ fact: fact.substring(0, 150) + (fact.length > 150 ? '...' : ''), loading: false })
        } else {
          setFunFact({ fact: `${crop.name}s thrive with consistent care and attention.`, loading: false })
        }
      } catch {
        setFunFact({ fact: `${crop.name}s are a wonderful addition to any garden!`, loading: false })
      }
    }
    fetchFunFact()
  }, [crop.name])

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(crop.id, noteText.trim())
      setNoteText('')
    }
  }

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      onAddPhoto(crop.id, photoUrl.trim())
      setPhotoUrl('')
    }
  }

  const getStatusBadge = () => {
    switch (crop.status) {
      case 'planted':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Just Planted</Badge>
      case 'growing':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Growing</Badge>
      case 'harvesting':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Ready to Harvest!</Badge>
    }
  }

  return (
    <Card className="overflow-hidden border-primary/10 hover:shadow-lg transition-shadow duration-300">
      {/* Header with Image */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20">
        {crop.imageUrl && (
          <img 
            src={crop.imageUrl} 
            alt={crop.name}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        
        {/* Floating Progress Circle */}
        <div className="absolute -bottom-8 left-4">
          <div className="bg-background rounded-full p-1 shadow-lg">
            <CircularProgress progress={progress} size={72} strokeWidth={5} />
          </div>
        </div>
        
        {/* More Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 bg-background/50 hover:bg-background/80">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onArchive(crop.id)}>
              <Archive className="h-4 w-4 mr-2" />
              Archive Crop
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Crop
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {crop.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove this crop from your garden tracker. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(crop.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="pt-12 pb-4">
        {/* Title & Status */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{crop.name}</h3>
            {crop.variety && (
              <p className="text-sm text-muted-foreground">{crop.variety}</p>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Days & Harvest Date */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Sprout className="h-4 w-4 text-green-500" />
            <span>{daysSincePlanted} days old</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              {progress >= 100 
                ? 'Ready now!' 
                : `${daysRemaining} days to harvest`
              }
            </span>
          </div>
        </div>

        {/* Estimated Harvest Date */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-accent/30 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Estimated Harvest</p>
            <p className="font-medium text-sm">
              {harvestDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Care Indicators */}
        <div className="flex gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Droplets className={`h-3 w-3 ${
              crop.waterNeeds === 'high' ? 'text-blue-500' : 
              crop.waterNeeds === 'moderate' ? 'text-blue-400' : 'text-blue-300'
            }`} />
            {crop.waterNeeds === 'high' ? 'High Water' : 
             crop.waterNeeds === 'moderate' ? 'Moderate' : 'Low Water'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Sun className={`h-3 w-3 ${
              crop.sunNeeds === 'full_sun' ? 'text-amber-500' : 
              crop.sunNeeds === 'partial_sun' ? 'text-amber-400' : 'text-gray-400'
            }`} />
            {crop.sunNeeds === 'full_sun' ? 'Full Sun' : 
             crop.sunNeeds === 'partial_sun' ? 'Part Sun' : 'Shade'}
          </Badge>
        </div>

        {/* Buddies - Companion Planting */}
        {(() => {
          const companions = getCompanionInfo(crop.name)
          const otherCrops = allCrops.filter(c => c.id !== crop.id)
          const goodBuddies: string[] = []
          const badNeighbors: string[] = []
          
          otherCrops.forEach(other => {
            const compatibility = checkCompatibility(crop.name, other.name)
            if (compatibility === 'good') goodBuddies.push(other.name)
            if (compatibility === 'bad') badNeighbors.push(other.name)
          })
          
          if (goodBuddies.length === 0 && badNeighbors.length === 0 && !companions) return null
          
          return (
            <div className="mb-4 p-2.5 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">Garden Buddies</span>
              </div>
              <div className="space-y-1.5">
                {goodBuddies.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <Heart className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-700 dark:text-green-400">
                      <span className="font-medium">Good companions:</span> {goodBuddies.join(', ')}
                    </p>
                  </div>
                )}
                {badNeighbors.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      <span className="font-medium">Watch out:</span> {badNeighbors.join(', ')} nearby
                    </p>
                  </div>
                )}
                {goodBuddies.length === 0 && badNeighbors.length === 0 && companions && (
                  <p className="text-xs text-muted-foreground">
                    Grows well with: {companions.goodCompanions.slice(0, 3).join(', ')}
                  </p>
                )}
              </div>
            </div>
          )
        })()}

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                <Camera className="h-4 w-4" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Photo for {crop.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Photo URL</Label>
                  <Input 
                    placeholder="Paste image URL..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Upload photos to a service like Imgur and paste the link here
                  </p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddPhoto}>Add Photo</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                <FileText className="h-4 w-4" />
                Log Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Note for {crop.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea 
                  placeholder="How's your plant doing? Any observations?"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddNote}>Save Note</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Fun Fact */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-primary mb-1">Fun Fact</p>
              {funFact.loading ? (
                <Skeleton className="h-4 w-full" />
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {funFact.fact}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActiveCrops() {
  const [crops, setCrops] = useState<ActiveCrop[]>(sampleCrops)
  const [showAddCrop, setShowAddCrop] = useState(false)

  const handleDelete = (id: string) => {
    setCrops(crops.filter(c => c.id !== id))
  }

  const handleArchive = (id: string) => {
    setCrops(crops.filter(c => c.id !== id))
    // In a real app, would move to archived collection
  }

  const handleAddNote = (id: string, note: string) => {
    setCrops(crops.map(c => 
      c.id === id 
        ? { ...c, notes: [...c.notes, note] }
        : c
    ))
  }

  const handleAddPhoto = (id: string, photo: string) => {
    setCrops(crops.map(c => 
      c.id === id 
        ? { ...c, photos: [...c.photos, photo] }
        : c
    ))
  }

  // Group crops by status
  const harvestingCrops = crops.filter(c => c.status === 'harvesting')
  const growingCrops = crops.filter(c => c.status === 'growing')
  const plantedCrops = crops.filter(c => c.status === 'planted')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Active Crops
          </h2>
          <p className="text-sm text-muted-foreground">
            {crops.length} plants growing in your garden
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              triggerHarvestConfetti()
            }} 
            className="gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-700 hover:from-amber-100 hover:to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800 dark:text-amber-400"
          >
            <Apple className="h-4 w-4" />
            Add Harvest
          </Button>
          <Button onClick={() => setShowAddCrop(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Crop
          </Button>
        </div>
      </div>

      {/* Ready to Harvest Section */}
      {harvestingCrops.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Ready to Harvest ({harvestingCrops.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {harvestingCrops.map(crop => (
              <GrowthProgressCard
                key={crop.id}
                crop={crop}
                allCrops={crops}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onAddNote={handleAddNote}
                onAddPhoto={handleAddPhoto}
              />
            ))}
          </div>
        </div>
      )}

      {/* Growing Section */}
      {growingCrops.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            Growing ({growingCrops.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {growingCrops.map(crop => (
              <GrowthProgressCard
                key={crop.id}
                crop={crop}
                allCrops={crops}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onAddNote={handleAddNote}
                onAddPhoto={handleAddPhoto}
              />
            ))}
          </div>
        </div>
      )}

      {/* Just Planted Section */}
      {plantedCrops.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Just Planted ({plantedCrops.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plantedCrops.map(crop => (
              <GrowthProgressCard
                key={crop.id}
                crop={crop}
                allCrops={crops}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onAddNote={handleAddNote}
                onAddPhoto={handleAddPhoto}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {crops.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <Sprout className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Active Crops</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Start tracking your garden by adding your first crop!
          </p>
          <Button onClick={() => setShowAddCrop(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Crop
          </Button>
        </Card>
      )}
    </div>
  )
}
