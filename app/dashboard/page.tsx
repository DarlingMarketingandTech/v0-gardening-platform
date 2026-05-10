"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { getProfile } from "@/lib/profile-store"
import { Loader2, Flower2 } from "lucide-react"
import type { Plant } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [plants, setPlants] = useState<Plant[]>([])

  useEffect(() => {
    const profile = getProfile()
    
    // Redirect to setup if profile not complete
    if (!profile.setupComplete) {
      router.push('/setup')
      return
    }

    // Fetch plants from database
    async function fetchPlants() {
      const supabase = createClient()
      const { data } = await supabase
        .from('plants')
        .select('*')
        .order('name')
      
      setPlants((data || []) as Plant[])
      setIsLoading(false)
    }

    fetchPlants()
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

  return <DashboardClient plants={plants} />
}
