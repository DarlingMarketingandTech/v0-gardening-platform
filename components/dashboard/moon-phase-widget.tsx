'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Hand-drawn style moon SVG component
function MoonIcon({ phase, size = 48 }: { phase: number; size?: number }) {
  // Phase: 0 = new moon, 0.5 = full moon, 1 = new moon again
  const illumination = phase <= 0.5 ? phase * 2 : (1 - phase) * 2
  const isWaxing = phase <= 0.5
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="drop-shadow-lg">
      {/* Outer glow */}
      <defs>
        <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="moonSurface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      
      {/* Moon base - cream/parchment color */}
      <circle 
        cx="24" 
        cy="24" 
        r="20" 
        fill="url(#moonSurface)"
        filter="url(#moonGlow)"
        stroke="#D97706"
        strokeWidth="1"
        strokeDasharray="2 1"
        className="opacity-90"
      />
      
      {/* Shadow for phase - hand-drawn style with wavy edge */}
      {illumination < 1 && (
        <path
          d={isWaxing 
            ? `M 24 4 
               Q ${24 + (1 - illumination) * 22} 14, ${24 + (1 - illumination) * 20} 24 
               Q ${24 + (1 - illumination) * 22} 34, 24 44
               A 20 20 0 0 1 24 4`
            : `M 24 4 
               Q ${24 - (1 - illumination) * 22} 14, ${24 - (1 - illumination) * 20} 24 
               Q ${24 - (1 - illumination) * 22} 34, 24 44
               A 20 20 0 0 0 24 4`
          }
          fill="#1F2937"
          opacity="0.85"
        />
      )}
      
      {/* Crater details - hand drawn circles */}
      <circle cx="18" cy="16" r="3" fill="#D97706" opacity="0.2" />
      <circle cx="30" cy="20" r="2" fill="#D97706" opacity="0.15" />
      <circle cx="22" cy="30" r="2.5" fill="#D97706" opacity="0.2" />
      <circle cx="28" cy="28" r="1.5" fill="#D97706" opacity="0.15" />
    </svg>
  )
}

// Hand-drawn seed packet icon
function SeedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6 C4 4 6 2 12 2 C18 2 20 4 20 6 L20 20 C20 21 19 22 18 22 L6 22 C5 22 4 21 4 20 Z" strokeDasharray="3 1" />
      <ellipse cx="12" cy="12" rx="4" ry="6" strokeDasharray="2 1" />
      <path d="M12 8 Q14 10 12 14 Q10 10 12 8" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

interface MoonData {
  phase: number
  phaseName: string
  illumination: number
  suggestion: {
    task: string
    description: string
    icon: 'plant' | 'harvest' | 'weed' | 'rest'
  }
}

// Calculate moon phase based on lunar cycle
function calculateMoonPhase(date: Date): MoonData {
  // Lunar cycle is approximately 29.53 days
  // New Moon reference: January 6, 2000
  const refDate = new Date(2000, 0, 6, 18, 14, 0)
  const daysSinceRef = (date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
  const lunarCycle = 29.53058867
  const phase = (daysSinceRef % lunarCycle) / lunarCycle
  
  // Determine phase name and gardening suggestion
  let phaseName: string
  let suggestion: MoonData['suggestion']
  
  if (phase < 0.0625) {
    phaseName = 'New Moon'
    suggestion = { 
      task: 'Rest & Plan', 
      description: 'Great time to plan your garden and let the soil rest.',
      icon: 'rest'
    }
  } else if (phase < 0.1875) {
    phaseName = 'Waxing Crescent'
    suggestion = { 
      task: 'Plant Leafy Greens', 
      description: 'Rising moon energy supports leaf growth. Plant lettuce, spinach, cabbage.',
      icon: 'plant'
    }
  } else if (phase < 0.3125) {
    phaseName = 'First Quarter'
    suggestion = { 
      task: 'Plant Fruiting Crops', 
      description: 'Strong upward growth. Plant tomatoes, peppers, squash.',
      icon: 'plant'
    }
  } else if (phase < 0.4375) {
    phaseName = 'Waxing Gibbous'
    suggestion = { 
      task: 'Continue Planting', 
      description: 'Good moisture in soil. Plant and transplant seedlings.',
      icon: 'plant'
    }
  } else if (phase < 0.5625) {
    phaseName = 'Full Moon'
    suggestion = { 
      task: 'Harvest Above Ground', 
      description: 'Peak energy! Harvest herbs, fruits, and vegetables.',
      icon: 'harvest'
    }
  } else if (phase < 0.6875) {
    phaseName = 'Waning Gibbous'
    suggestion = { 
      task: 'Plant Root Crops', 
      description: 'Energy moves downward. Plant carrots, potatoes, onions.',
      icon: 'plant'
    }
  } else if (phase < 0.8125) {
    phaseName = 'Last Quarter'
    suggestion = { 
      task: 'Weed & Prune', 
      description: 'Decreasing light slows growth. Perfect for weeding.',
      icon: 'weed'
    }
  } else if (phase < 0.9375) {
    phaseName = 'Waning Crescent'
    suggestion = { 
      task: 'Rest & Prepare', 
      description: 'Low energy period. Prepare beds and compost.',
      icon: 'rest'
    }
  } else {
    phaseName = 'New Moon'
    suggestion = { 
      task: 'Rest & Plan', 
      description: 'Great time to plan your garden and let the soil rest.',
      icon: 'rest'
    }
  }
  
  const illumination = phase <= 0.5 ? phase * 2 : (1 - phase) * 2
  
  return { phase, phaseName, illumination: Math.round(illumination * 100), suggestion }
}

export function MoonPhaseWidget() {
  const [moonData, setMoonData] = useState<MoonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Calculate moon phase for today
    const data = calculateMoonPhase(new Date())
    setMoonData(data)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200/50 dark:border-indigo-800/50">
        <CardContent className="p-4">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!moonData) return null

  const taskColors = {
    plant: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    harvest: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    weed: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    rest: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-200/50 dark:border-indigo-800/50 overflow-hidden relative">
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.8%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20filter%3D%22url(%23noise)%22%20opacity%3D%220.5%22%2F%3E%3C%2Fsvg%3E')]" />
      
      <CardContent className="p-4 relative">
        <div className="flex items-center gap-4">
          {/* Moon visualization */}
          <div className="shrink-0">
            <MoonIcon phase={moonData.phase} size={56} />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                Lunar Gardener
              </span>
              <Badge variant="outline" className="text-xs border-indigo-300 dark:border-indigo-700">
                {moonData.illumination}% lit
              </Badge>
            </div>
            
            {/* Phase name */}
            <h3 className="font-semibold text-foreground mb-1">{moonData.phaseName}</h3>
            
            {/* Today's suggestion */}
            <div className="flex items-center gap-2">
              <Badge className={taskColors[moonData.suggestion.icon]}>
                {moonData.suggestion.task}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-xs text-muted-foreground mt-3 pl-[72px] italic">
          {moonData.suggestion.description}
        </p>
      </CardContent>
    </Card>
  )
}

export { SeedIcon }
