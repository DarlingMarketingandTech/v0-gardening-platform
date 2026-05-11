import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { DEMO_HOUSEHOLD_ID, demoPlants } from '@/lib/demo-garden'

export default function MyGardenPage() {
  return <DashboardClient plants={demoPlants} householdId={DEMO_HOUSEHOLD_ID} />
}
