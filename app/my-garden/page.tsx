"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { getUserHousehold } from "@/lib/actions/household"
import { Loader2, Flower2 } from "lucide-react"
import type { Plant, Planting } from "@/lib/types"

export default function MyGardenPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [plants, setPlants] = useState<Plant[]>([])
  const [householdId, setHouseholdId] = useState<string | null>(null)
  const [growingCount, setGrowingCount] = useState(0)
  const [needSunCount, setNeedSunCount] = useState(0)
  const [needWaterCount, setNeedWaterCount] = useState(0)

  useEffect(() => {
    async function loadGarden() {
      try {
        // Get user's household
        const { household_id } = await getUserHousehold()
        if (!household_id) {
          router.push('/auth/login')
          return
        }
        setHouseholdId(household_id)

        const supabase = createClient()
        
        // Fetch plantings to get stats
        const { data: plantings } = await supabase
          .from('plantings')
          .select('*')
          .eq('household_id', household_id)
        
        const typedPlantings = (plantings || []) as Planting[]
        setGrowingCount(typedPlantings.filter(p => ['planted', 'growing'].includes(p.status)).length)
        // These would require additional plant_library fields, so for now setting to 0
        setNeedSunCount(0)
        setNeedWaterCount(0)
        
        // Fetch plant library for plants array
        const { data: plantLibrary } = await supabase
          .from('plant_library')
          .select('*')
          .order('common_name')
        
        const converted: Plant[] = (plantLibrary || []).map((item: any) => ({
          id: item.id,
          name: item.common_name,
          scientific_name: item.scientific_name,
          category: item.category,
          difficulty: 'intermediate',
          sunlight_needs: 'partial_sun',
          water_needs: 'moderate',
          days_to_maturity: item.days_to_maturity,
          description: item.description,
          care_tips: item.care_notes,
        }))
        
        setPlants(converted)
      } catch (error) {
        console.error('Failed to load garden:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGarden()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Flower2 className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your garden...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardClient 
      plants={plants} 
      householdId={householdId || ''} 
      growingCount={growingCount}
      needSunCount={needSunCount}
      needWaterCount={needWaterCount}
    />
  )
}
