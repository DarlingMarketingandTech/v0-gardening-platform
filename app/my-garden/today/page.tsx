import { TodayPageClient } from '@/components/today/today-page-client'
import { resolveSpacesSourceForContext } from '@/lib/garden-os/data/resolve-spaces-source'
import { getGardenContext } from '@/lib/garden-os/get-garden-context'
import { getTodayViewModel } from '@/lib/garden-os/queries/get-today-view-model'

export default async function TodayPage() {
  const context = await getGardenContext()
  const spacesSource = resolveSpacesSourceForContext(context)
  const viewModel = await getTodayViewModel(context)

  return (
    <TodayPageClient context={context} viewModel={viewModel} spacesSource={spacesSource} />
  )
}
