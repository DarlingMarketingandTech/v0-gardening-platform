import { GardenPageClient } from '@/components/garden/garden-page-client'
import { resolveSpacesSourceForContext } from '@/lib/garden-os/data/resolve-spaces-source'
import { getGardenContext } from '@/lib/garden-os/get-garden-context'
import { getGardenViewModel } from '@/lib/garden-os/queries/get-garden-view-model'

export default async function GardenPage() {
  const context = await getGardenContext()
  const spacesSource = resolveSpacesSourceForContext(context)
  const viewModel = await getGardenViewModel(context)

  return (
    <GardenPageClient context={context} viewModel={viewModel} spacesSource={spacesSource} />
  )
}
