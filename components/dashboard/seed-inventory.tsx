'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Snowflake, Calendar, Package, AlertTriangle, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Seed {
  id: string
  name: string
  variety?: string
  quantity: number
  expirationYear: number
  category: 'vegetable' | 'herb' | 'flower' | 'fruit'
  weeksBeforeFrost: number // When to start indoors before last frost
  notes?: string
}

// Default frost dates by climate zone (approximate)
const defaultFrostDates: Record<string, { lastFrost: string; firstFrost: string }> = {
  '3': { lastFrost: '05-15', firstFrost: '09-15' },
  '4': { lastFrost: '05-01', firstFrost: '10-01' },
  '5': { lastFrost: '04-15', firstFrost: '10-15' },
  '6': { lastFrost: '04-01', firstFrost: '10-31' },
  '7': { lastFrost: '03-15', firstFrost: '11-15' },
  '8': { lastFrost: '03-01', firstFrost: '11-30' },
  '9': { lastFrost: '02-15', firstFrost: '12-15' },
  '10': { lastFrost: '01-31', firstFrost: '12-31' },
}

const categoryConfig = {
  vegetable: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', emoji: 'Veg' },
  herb: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', emoji: 'Herb' },
  flower: { color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300', emoji: 'Flower' },
  fruit: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', emoji: 'Fruit' },
}

const sampleSeeds: Seed[] = [
  { id: '1', name: 'Tomato', variety: 'Roma', quantity: 25, expirationYear: 2026, category: 'vegetable', weeksBeforeFrost: 8 },
  { id: '2', name: 'Basil', variety: 'Genovese', quantity: 50, expirationYear: 2025, category: 'herb', weeksBeforeFrost: 6 },
  { id: '3', name: 'Pepper', variety: 'Bell', quantity: 15, expirationYear: 2027, category: 'vegetable', weeksBeforeFrost: 10 },
  { id: '4', name: 'Zinnia', variety: 'Mixed Colors', quantity: 30, expirationYear: 2025, category: 'flower', weeksBeforeFrost: 4 },
  { id: '5', name: 'Cucumber', variety: 'Marketmore', quantity: 20, expirationYear: 2026, category: 'vegetable', weeksBeforeFrost: 4 },
  { id: '6', name: 'Lettuce', variety: 'Butterhead', quantity: 100, expirationYear: 2025, category: 'vegetable', weeksBeforeFrost: 6 },
]

// Hand-drawn seed packet SVG
function SeedPacketIcon({ category, size = 40 }: { category: Seed['category']; size?: number }) {
  const colors = {
    vegetable: { fill: '#86EFAC', stroke: '#16A34A' },
    herb: { fill: '#A7F3D0', stroke: '#059669' },
    flower: { fill: '#FBCFE8', stroke: '#DB2777' },
    fruit: { fill: '#FED7AA', stroke: '#EA580C' },
  }
  
  const { fill, stroke } = colors[category]
  
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="drop-shadow-sm">
      {/* Packet body */}
      <path 
        d="M8 8 C8 5 10 3 20 3 C30 3 32 5 32 8 L32 34 C32 36 30 38 28 38 L12 38 C10 38 8 36 8 34 Z" 
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeDasharray="3 1"
      />
      {/* Top fold */}
      <path 
        d="M8 8 Q20 12 32 8" 
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeDasharray="2 1"
      />
      {/* Seed illustration */}
      <ellipse cx="20" cy="22" rx="6" ry="8" fill={stroke} opacity="0.3" stroke={stroke} strokeWidth="0.5" />
      <path d="M20 16 Q24 20 20 28 Q16 20 20 16" fill={stroke} opacity="0.5" />
    </svg>
  )
}

export function SeedInventory() {
  const [seeds, setSeeds] = useState<Seed[]>(sampleSeeds)
  const [isAdding, setIsAdding] = useState(false)
  const [frostDate, setFrostDate] = useState<Date | null>(null)
  const [newSeed, setNewSeed] = useState<Partial<Seed>>({
    category: 'vegetable',
    quantity: 1,
    expirationYear: new Date().getFullYear() + 2,
    weeksBeforeFrost: 6
  })

  // Load from localStorage and calculate frost date
  useEffect(() => {
    const saved = localStorage.getItem('seedInventory')
    if (saved) {
      try {
        setSeeds(JSON.parse(saved))
      } catch {
        setSeeds(sampleSeeds)
      }
    }

    // Get frost date - use default Zone 6
    // Default to Zone 6 if no climate data available
    const year = new Date().getFullYear()
    let lastFrostDate = new Date(year, 3, 1) // April 1
    if (lastFrostDate < new Date()) {
      lastFrostDate = new Date(year + 1, 3, 1)
    }
    setFrostDate(lastFrostDate)
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('seedInventory', JSON.stringify(seeds))
  }, [seeds])

  const addSeed = () => {
    if (!newSeed.name) return

    const seed: Seed = {
      id: Date.now().toString(),
      name: newSeed.name,
      variety: newSeed.variety,
      quantity: newSeed.quantity || 1,
      expirationYear: newSeed.expirationYear || new Date().getFullYear() + 2,
      category: newSeed.category as Seed['category'] || 'vegetable',
      weeksBeforeFrost: newSeed.weeksBeforeFrost || 6,
      notes: newSeed.notes
    }

    setSeeds([...seeds, seed])
    setNewSeed({
      category: 'vegetable',
      quantity: 1,
      expirationYear: new Date().getFullYear() + 2,
      weeksBeforeFrost: 6
    })
    setIsAdding(false)
  }

  const deleteSeed = (id: string) => {
    setSeeds(seeds.filter(s => s.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setSeeds(seeds.map(s => 
      s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s
    ))
  }

  // Calculate countdown for starting indoors
  const getStartIndoorsInfo = (seed: Seed) => {
    if (!frostDate) return null
    
    const startDate = new Date(frostDate)
    startDate.setDate(startDate.getDate() - seed.weeksBeforeFrost * 7)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    startDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      date: startDate,
      daysUntil: diffDays,
      isPast: diffDays < 0,
      isNow: diffDays >= -7 && diffDays <= 7
    }
  }

  const currentYear = new Date().getFullYear()
  const expiredSeeds = seeds.filter(s => s.expirationYear <= currentYear)
  const readyToStart = seeds.filter(s => {
    const info = getStartIndoorsInfo(s)
    return info?.isNow
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-600" />
            The Seed Box
          </h2>
          <p className="text-sm text-muted-foreground">
            {seeds.length} seed packets in your collection
          </p>
        </div>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Seeds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Seed Packet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Seed Name *</Label>
                  <Input 
                    placeholder="e.g., Tomato"
                    value={newSeed.name || ''}
                    onChange={(e) => setNewSeed({ ...newSeed, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Variety</Label>
                  <Input 
                    placeholder="e.g., Roma"
                    value={newSeed.variety || ''}
                    onChange={(e) => setNewSeed({ ...newSeed, variety: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={newSeed.category} 
                    onValueChange={(v) => setNewSeed({ ...newSeed, category: v as Seed['category'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetable">Vegetable</SelectItem>
                      <SelectItem value="herb">Herb</SelectItem>
                      <SelectItem value="flower">Flower</SelectItem>
                      <SelectItem value="fruit">Fruit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number"
                    min="1"
                    value={newSeed.quantity || 1}
                    onChange={(e) => setNewSeed({ ...newSeed, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiration Year</Label>
                  <Input 
                    type="number"
                    min={currentYear}
                    max={currentYear + 10}
                    value={newSeed.expirationYear || currentYear + 2}
                    onChange={(e) => setNewSeed({ ...newSeed, expirationYear: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Indoors (weeks before frost)</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="16"
                    value={newSeed.weeksBeforeFrost || 6}
                    onChange={(e) => setNewSeed({ ...newSeed, weeksBeforeFrost: parseInt(e.target.value) || 6 })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={addSeed}>Add to Seed Box</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Frost Date & Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Frost Date Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Snowflake className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
                  Last Frost Date
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {frostDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ready to Start Card */}
        {readyToStart.length > 0 && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center animate-pulse">
                  <Sprout className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">
                    Start Indoors Now!
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {readyToStart.map(s => s.name).join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Expired Seeds Warning */}
      {expiredSeeds.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {expiredSeeds.length} seed{expiredSeeds.length > 1 ? 's' : ''} may be expired
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {expiredSeeds.map(s => s.name).join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seed List */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardTitle className="text-lg">Seed Packets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="divide-y divide-border">
              {seeds.map((seed) => {
                const startInfo = getStartIndoorsInfo(seed)
                const isExpired = seed.expirationYear <= currentYear
                
                return (
                  <div 
                    key={seed.id} 
                    className={cn(
                      "p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors",
                      isExpired && "bg-amber-50/50 dark:bg-amber-950/10"
                    )}
                  >
                    {/* Seed packet icon */}
                    <SeedPacketIcon category={seed.category} size={44} />
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{seed.name}</h4>
                        {seed.variety && (
                          <span className="text-sm text-muted-foreground">({seed.variety})</span>
                        )}
                        <Badge variant="outline" className={cn("text-xs", categoryConfig[seed.category].color)}>
                          {categoryConfig[seed.category].emoji}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className={isExpired ? "text-amber-600" : ""}>
                          Exp: {seed.expirationYear}
                        </span>
                        {startInfo && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {startInfo.isNow ? (
                              <span className="text-green-600 font-medium">Start now!</span>
                            ) : startInfo.isPast ? (
                              <span className="text-muted-foreground">Season passed</span>
                            ) : (
                              <span>Start in {startInfo.daysUntil} days</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(seed.id, -1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{seed.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(seed.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                    
                    {/* Delete */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteSeed(seed.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
