import { PlanPageClient } from '@/components/plan/plan-page-client'
import { getGardenContext } from '@/lib/garden-os/get-garden-context'
import { getPlanViewModel } from '@/lib/garden-os/queries/get-plan-view-model'

export default async function PlanPage() {
  const context = await getGardenContext()
  const viewModel = await getPlanViewModel(context)

  return <PlanPageClient viewModel={viewModel} />
}
