'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Bell,
  BellRing,
  Scissors,
  Droplets,
  Sun,
  Calendar,
  Smartphone,
  Download,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Clock,
  Leaf,
  ExternalLink,
  Apple,
  Chrome,
  FlaskConical,
  Salad,
  AlertCircle,
  ShoppingBasket,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPlantTips, getNextFeedingDate, getNextPruningDate, getTaskUrgency } from '@/lib/plant-tips'
import { Checkbox } from '@/components/ui/checkbox'

// Types
interface NotificationSettings {
  pruningReminders: boolean
  feedingAlerts: boolean
  harvestWindows: boolean
  wateringReminders: boolean
  weatherAlerts: boolean
  dailySummary: boolean
}

interface ScheduledTask {
  id: string
  cropId: string
  title: string
  description: string
  crop: string
  type: 'pruning' | 'feeding' | 'watering' | 'harvest'
  frequency: string
  nextDate: Date
  howToLink?: string
  completed?: boolean
  urgency?: 'today' | 'soon' | 'upcoming' | 'past'
}

interface CropInfo {
  id: string
  name: string
  plantedDate: Date
  daysToMaturity: number
}

// Mock active crops - in real app would come from localStorage or Supabase
const mockActiveCrops: CropInfo[] = [
  { id: 'crop-1', name: 'Cherry Tomatoes', plantedDate: new Date('2024-05-15'), daysToMaturity: 70 },
  { id: 'crop-2', name: 'Bell Peppers', plantedDate: new Date('2024-05-20'), daysToMaturity: 75 },
  { id: 'crop-3', name: 'Zucchini', plantedDate: new Date('2024-06-01'), daysToMaturity: 50 },
  { id: 'crop-4', name: 'Basil', plantedDate: new Date('2024-05-25'), daysToMaturity: 30 },
]

// Get last fed/pruned timestamp from localStorage
function getLastActionDate(cropId: string, action: 'fed' | 'pruned'): Date | null {
  if (typeof window === 'undefined') return null
  const timestamp = localStorage.getItem(`garden_${action}_${cropId}`)
  return timestamp ? new Date(timestamp) : null
}

// Save action completion to localStorage
function markActionComplete(cropId: string, action: 'fed' | 'pruned'): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`garden_${action}_${cropId}`, new Date().toISOString())
}

// Generate smart schedule based on crops with real plant-specific intervals
function generateSmartSchedule(crops: CropInfo[]): ScheduledTask[] {
  const tasks: ScheduledTask[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  crops.forEach((crop) => {
    const tips = getPlantTips(crop.name)
    
    // Pruning tasks - only for plants that need it
    if (tips.pruning_interval_days > 0) {
      const lastPruned = getLastActionDate(crop.id, 'pruned')
      const nextPruneDate = getNextPruningDate(crop.name, crop.plantedDate, lastPruned)
      
      if (nextPruneDate) {
        const urgency = getTaskUrgency(nextPruneDate)
        tasks.push({
          id: `prune-${crop.id}`,
          cropId: crop.id,
          title: `Prune ${crop.name}`,
          description: `Check for suckers and remove yellowing leaves to encourage healthy growth.`,
          crop: crop.name,
          type: 'pruning',
          frequency: `Every ${tips.pruning_interval_days} days`,
          nextDate: nextPruneDate,
          urgency,
          howToLink: `https://en.wikipedia.org/wiki/${crop.name.replace(' ', '_')}#Cultivation`
        })
      }
    }
    
    // Feeding tasks - uses last fed date from localStorage
    const lastFed = getLastActionDate(crop.id, 'fed')
    const nextFeedingDate = getNextFeedingDate(crop.name, crop.plantedDate, lastFed)
    const feedingUrgency = getTaskUrgency(nextFeedingDate)
    
    tasks.push({
      id: `feed-${crop.id}`,
      cropId: crop.id,
      title: `Feed ${crop.name}`,
      description: `Apply balanced fertilizer to support growth and fruit production.`,
      crop: crop.name,
      type: 'feeding',
      frequency: `Every ${tips.nutrient_interval_days} days`,
      nextDate: nextFeedingDate,
      urgency: feedingUrgency,
      howToLink: `https://en.wikipedia.org/wiki/Fertilizer#Application`
    })
    
    // Harvest window - special urgency for close harvests
    const harvestDate = new Date(crop.plantedDate)
    harvestDate.setDate(harvestDate.getDate() + crop.daysToMaturity)
    const daysUntilHarvest = Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilHarvest > -7) { // Show if within past week or future
      const harvestUrgency = getTaskUrgency(harvestDate)
      const isHarvestSoon = daysUntilHarvest > 0 && daysUntilHarvest <= 5
      
      tasks.push({
        id: `harvest-${crop.id}`,
        cropId: crop.id,
        title: isHarvestSoon ? `Get your basket ready for ${crop.name}!` : `Harvest ${crop.name}`,
        description: isHarvestSoon 
          ? `Harvest starts in ${daysUntilHarvest} day${daysUntilHarvest === 1 ? '' : 's'}! ${tips.harvest_tip || 'Check for ripe produce.'}`
          : `Expected harvest window begins! ${tips.harvest_tip || 'Check for ripe produce.'}`,
        crop: crop.name,
        type: 'harvest',
        frequency: 'Harvest window',
        nextDate: harvestDate,
        urgency: harvestUrgency,
        howToLink: `https://en.wikipedia.org/wiki/${crop.name.replace(' ', '_')}#Harvesting`
      })
    }
  })
  
  // Sort by next date, with today's tasks first
  return tasks.sort((a, b) => {
    // Prioritize "today" tasks
    if (a.urgency === 'today' && b.urgency !== 'today') return -1
    if (b.urgency === 'today' && a.urgency !== 'today') return 1
    return a.nextDate.getTime() - b.nextDate.getTime()
  })
}

// Icons for task types
const taskTypeIcons: Record<string, React.ReactNode> = {
  pruning: <Scissors className="h-4 w-4" />,
  feeding: <FlaskConical className="h-4 w-4" />,
  watering: <Droplets className="h-4 w-4" />,
  harvest: <Salad className="h-4 w-4" />
}

const taskTypeColors: Record<string, string> = {
  pruning: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  feeding: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  watering: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  harvest: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    pruningReminders: true,
    feedingAlerts: true,
    harvestWindows: true,
    wateringReminders: true,
    weatherAlerts: true,
    dailySummary: false
  })
  
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallInstructions, setShowInstallInstructions] = useState(false)
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([])
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null)
  const [wikiSummary, setWikiSummary] = useState<string>('')
  const [loadingWiki, setLoadingWiki] = useState(false)
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set())

  // Handle marking a task as complete
  const handleTaskComplete = (task: ScheduledTask) => {
    if (task.type === 'feeding') {
      markActionComplete(task.cropId, 'fed')
    } else if (task.type === 'pruning') {
      markActionComplete(task.cropId, 'pruned')
    }
    
    // Add to completed set for visual feedback
    setCompletedTaskIds(prev => new Set([...prev, task.id]))
    
    // Regenerate schedule after a short delay to show the check animation
    setTimeout(() => {
      setScheduledTasks(generateSmartSchedule(mockActiveCrops))
      setCompletedTaskIds(prev => {
        const next = new Set(prev)
        next.delete(task.id)
        return next
      })
    }, 1500)
  }
  
  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
    
    // Check if app is installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }
    
    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    
    // Load saved settings
    const saved = localStorage.getItem('garden_notification_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
    
    // Generate schedule
    setScheduledTasks(generateSmartSchedule(mockActiveCrops))
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])
  
  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('garden_notification_settings', JSON.stringify(settings))
  }, [settings])
  
  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      if (permission === 'granted') {
        // Register service worker
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js')
            console.log('[v0] Service Worker registered:', registration)
            
            // Show a test notification
            new Notification("Garden Alerts Enabled!", {
              body: "You'll now receive helpful reminders for your garden.",
              icon: '/icons/icon-192x192.png'
            })
          } catch (error) {
            console.error('[v0] Service Worker registration failed:', error)
          }
        }
      }
    }
  }
  
  // Install PWA
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    } else {
      // Show manual instructions
      setShowInstallInstructions(true)
    }
  }
  
  // Fetch Wikipedia how-to
  const fetchHowTo = async (task: ScheduledTask) => {
    setSelectedTask(task)
    setLoadingWiki(true)
    setWikiSummary('')
    
    try {
      const searchTerm = task.type === 'pruning' ? `pruning ${task.crop}` : 
                         task.type === 'feeding' ? 'plant fertilizer' :
                         task.type === 'harvest' ? `harvesting ${task.crop}` : task.crop
      
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm.replace(' ', '_'))}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setWikiSummary(data.extract || 'No information available.')
      } else {
        setWikiSummary('Could not load information. Try searching online for tips!')
      }
    } catch {
      setWikiSummary('Could not load information. Try searching online for tips!')
    } finally {
      setLoadingWiki(false)
    }
  }
  
  // Toggle setting
  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }
  
  // Detect device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  
  return (
    <div className="space-y-6">
      {/* PWA Install Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Install Garden App
              </CardTitle>
              <CardDescription className="mt-1">
                Add to your home screen for the best experience
              </CardDescription>
            </div>
            {isInstalled && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <Check className="h-3 w-3 mr-1" />
                Installed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isInstalled ? (
            <>
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl border">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Leaf className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Momma D&apos;s Garden</p>
                  <p className="text-sm text-muted-foreground truncate">Your personal gardening companion</p>
                </div>
              </div>
              
              <Button 
                className="w-full h-12 text-base gap-2" 
                onClick={handleInstall}
              >
                <Download className="h-5 w-5" />
                Add to Home Screen
              </Button>
              
              <Dialog open={showInstallInstructions} onOpenChange={setShowInstallInstructions}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {isIOS ? <Apple className="h-5 w-5" /> : <Chrome className="h-5 w-5" />}
                      Install on {isIOS ? 'iPhone/iPad' : 'Android'}
                    </DialogTitle>
                    <DialogDescription>
                      Follow these steps to add the app to your home screen
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    {isIOS ? (
                      <ol className="space-y-4">
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span>
                          <span>Tap the <strong>Share</strong> button (square with arrow) at the bottom of Safari</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span>
                          <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span>
                          <span>Tap <strong>&quot;Add&quot;</strong> in the top right corner</span>
                        </li>
                      </ol>
                    ) : (
                      <ol className="space-y-4">
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span>
                          <span>Tap the <strong>menu</strong> (three dots) in Chrome</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span>
                          <span>Tap <strong>&quot;Add to Home screen&quot;</strong></span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span>
                          <span>Tap <strong>&quot;Add&quot;</strong> to confirm</span>
                        </li>
                      </ol>
                    )}
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    <p className="font-medium mb-1">Why install?</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Works offline</li>
                      <li>• Faster loading</li>
                      <li>• Receive notifications</li>
                      <li>• Full-screen experience</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300">
                App is installed! Open it from your home screen for the best experience.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Push Notification Permission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            Phone Alerts
          </CardTitle>
          <CardDescription>
            Get helpful reminders sent directly to your phone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationPermission === 'granted' ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">Notifications Enabled</p>
                <p className="text-sm text-green-600/80 dark:text-green-400/80">You&apos;ll receive gardening reminders</p>
              </div>
            </div>
          ) : notificationPermission === 'denied' ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl">
              <X className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-300">Notifications Blocked</p>
                <p className="text-sm text-red-600/80 dark:text-red-400/80">
                  Enable in your browser settings to receive alerts
                </p>
              </div>
            </div>
          ) : (
            <Button 
              className="w-full h-12 text-base gap-2"
              variant="outline"
              onClick={requestNotificationPermission}
            >
              <Bell className="h-5 w-5" />
              Enable Phone Alerts
            </Button>
          )}
          
          <p className="text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 inline mr-1" />
            We&apos;ll send friendly reminders like &quot;Good morning! Your tomatoes are getting bushy—time to prune!&quot;
          </p>
        </CardContent>
      </Card>
      
      {/* Alert Toggle Board */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alert Preferences
          </CardTitle>
          <CardDescription>
            Choose which reminders you&apos;d like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {/* Pruning Reminders */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => toggleSetting('pruningReminders')}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <Scissors className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium">Pruning Reminders</p>
                <p className="text-sm text-muted-foreground">Weekly tips for healthier plants</p>
              </div>
            </div>
            <Switch 
              checked={settings.pruningReminders} 
              onCheckedChange={() => toggleSetting('pruningReminders')}
              className="data-[state=checked]:bg-primary scale-125"
            />
          </div>
          
          <Separator />
          
          {/* Feeding Alerts */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => toggleSetting('feedingAlerts')}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Feeding Alerts</p>
                <p className="text-sm text-muted-foreground">Fertilizer reminders every 2 weeks</p>
              </div>
            </div>
            <Switch 
              checked={settings.feedingAlerts}
              onCheckedChange={() => toggleSetting('feedingAlerts')}
              className="data-[state=checked]:bg-primary scale-125"
            />
          </div>
          
          <Separator />
          
          {/* Harvest Windows */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => toggleSetting('harvestWindows')}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <Salad className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Harvest Windows</p>
                <p className="text-sm text-muted-foreground">Know when produce is ready to pick</p>
              </div>
            </div>
            <Switch 
              checked={settings.harvestWindows}
              onCheckedChange={() => toggleSetting('harvestWindows')}
              className="data-[state=checked]:bg-primary scale-125"
            />
          </div>
          
          <Separator />
          
          {/* Watering Reminders */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => toggleSetting('wateringReminders')}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Watering Reminders</p>
                <p className="text-sm text-muted-foreground">Smart alerts based on weather</p>
              </div>
            </div>
            <Switch 
              checked={settings.wateringReminders}
              onCheckedChange={() => toggleSetting('wateringReminders')}
              className="data-[state=checked]:bg-primary scale-125"
            />
          </div>
          
          <Separator />
          
          {/* Weather Alerts */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => toggleSetting('weatherAlerts')}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Weather Alerts</p>
                <p className="text-sm text-muted-foreground">Frost warnings &amp; heat advisories</p>
              </div>
            </div>
            <Switch 
              checked={settings.weatherAlerts}
              onCheckedChange={() => toggleSetting('weatherAlerts')}
              className="data-[state=checked]:bg-primary scale-125"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Care Schedule — Key Times */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Care Schedule — Key Times
              </CardTitle>
              <CardDescription>
                Smart reminders based on each plant&apos;s needs
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Per-plant intervals
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {scheduledTasks.map((task) => {
                const daysUntil = Math.ceil((task.nextDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isUpcoming = daysUntil <= 3 && daysUntil > 0
                const isToday = daysUntil === 0
                const isHarvestSoon = task.type === 'harvest' && daysUntil > 0 && daysUntil <= 5
                const isCompleted = completedTaskIds.has(task.id)
                
                return (
                  <div 
                    key={task.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:shadow-md relative",
                      isToday && "border-primary/50 bg-primary/5",
                      isUpcoming && !isToday && "border-amber-300/50 bg-amber-50/50 dark:bg-amber-950/20",
                      isHarvestSoon && "border-green-400/50 bg-gradient-to-r from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20",
                      isCompleted && "opacity-60"
                    )}
                  >
                    {/* Pulsing indicator for today's tasks */}
                    {isToday && !isCompleted && (
                      <span className="absolute top-4 right-4 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    )}
                    
                    <div className="flex items-start gap-3">
                      {/* Checkbox for actionable tasks */}
                      {(task.type === 'feeding' || task.type === 'pruning') && (
                        <div className="pt-1">
                          <Checkbox 
                            checked={isCompleted}
                            onCheckedChange={() => handleTaskComplete(task)}
                            className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </div>
                      )}
                      
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                        taskTypeColors[task.type],
                        isHarvestSoon && "bg-gradient-to-br from-green-100 to-amber-100 dark:from-green-900 dark:to-amber-900"
                      )}>
                        {isHarvestSoon ? <ShoppingBasket className="h-4 w-4 text-green-600 dark:text-green-400" /> : taskTypeIcons[task.type]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={cn(
                              "font-medium",
                              isCompleted && "line-through text-muted-foreground"
                            )}>
                              {task.title}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                          {isToday && !isCompleted && (
                            <Badge className="shrink-0 bg-primary animate-pulse">Today!</Badge>
                          )}
                          {isCompleted && (
                            <Badge className="shrink-0 bg-green-500 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Done
                            </Badge>
                          )}
                          {isHarvestSoon && !isToday && (
                            <Badge className="shrink-0 bg-gradient-to-r from-green-500 to-amber-500 text-white border-0 gap-1">
                              <ShoppingBasket className="h-3 w-3" />
                              {daysUntil} day{daysUntil === 1 ? '' : 's'}!
                            </Badge>
                          )}
                          {isUpcoming && !isToday && !isHarvestSoon && (
                            <Badge variant="outline" className="shrink-0 border-amber-400 text-amber-600">
                              {daysUntil} days
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.frequency}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {task.nextDate.toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        {/* How-to Button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 h-8 text-xs gap-1 text-primary hover:text-primary"
                              onClick={() => fetchHowTo(task)}
                            >
                              <ExternalLink className="h-3 w-3" />
                              How to {task.type}
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {taskTypeIcons[task.type]}
                                How to {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                              </DialogTitle>
                              <DialogDescription>
                                Tips for {task.crop}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-4">
                              {loadingWiki ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {wikiSummary}
                                  </p>
                                  
                                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                    <p className="font-medium text-sm flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4 text-primary" />
                                      Quick Tips
                                    </p>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                      {task.type === 'pruning' && (
                                        <>
                                          <li>• Use clean, sharp scissors or pruners</li>
                                          <li>• Prune in the morning when plants are hydrated</li>
                                          <li>• Remove suckers (small shoots between branches)</li>
                                        </>
                                      )}
                                      {task.type === 'feeding' && (
                                        <>
                                          <li>• Water the soil before applying fertilizer</li>
                                          <li>• Follow package instructions for amounts</li>
                                          <li>• Apply in the morning or evening, not midday</li>
                                        </>
                                      )}
                                      {task.type === 'harvest' && (
                                        <>
                                          <li>• Harvest in the cool morning hours</li>
                                          <li>• Use scissors or pruners for clean cuts</li>
                                          <li>• Check daily once produce starts ripening</li>
                                        </>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Sample Notification Preview */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            What Your Notifications Will Look Like
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-background rounded-xl p-4 shadow-sm border flex gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Momma D&apos;s Garden</p>
              <p className="text-sm text-muted-foreground">
                Good morning! Your Cherry Tomatoes are getting bushy—today is a great day to pinch those suckers!
              </p>
            </div>
          </div>
          
          <div className="bg-background rounded-xl p-4 shadow-sm border flex gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
              <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Momma D&apos;s Garden</p>
              <p className="text-sm text-muted-foreground">
                I was going to remind you to water, but it looks like rain is coming! Enjoy your morning coffee instead.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
