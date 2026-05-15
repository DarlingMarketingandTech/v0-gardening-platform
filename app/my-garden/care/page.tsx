import { CarePageClient } from '@/components/care/care-page-client'
import { resolveSpacesSourceForContext } from '@/lib/garden-os/data/resolve-spaces-source'
import { getGardenContext } from '@/lib/garden-os/get-garden-context'
import { getCareViewModel } from '@/lib/garden-os/queries/get-care-view-model'

export default async function CarePage() {
  const context = await getGardenContext()
  const spacesSource = resolveSpacesSourceForContext(context)
  const viewModel = await getCareViewModel(context)

  return (
    <CarePageClient context={context} viewModel={viewModel} spacesSource={spacesSource} />
  )
}
