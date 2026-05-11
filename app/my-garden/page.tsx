import { DashboardClient } from '@/components/dashboard/dashboard-client'
import {
  DEMO_HOUSEHOLD_ID,
  demoGardenZones,
  demoInsights,
  demoPlantings,
  demoPlants,
  demoTasks,
} from '@/lib/demo-garden'

export default function MyGardenPage() {
  return (
    <DashboardClient
      plants={demoPlants}
      householdId={DEMO_HOUSEHOLD_ID}
      zones={demoGardenZones}
      plantings={demoPlantings}
      tasks={demoTasks}
      insights={demoInsights}
    />
  )
}
