import { GuidePageClient } from '@/components/guide/guide-page-client'
import { getPlantLibrary } from '@/lib/plant-library/get-plant-library'

export default function GuidePage() {
  const plants = getPlantLibrary()
  return <GuidePageClient plants={plants} />
}
