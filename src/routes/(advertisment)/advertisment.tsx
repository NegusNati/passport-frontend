import { createFileRoute } from '@tanstack/react-router'

import { AdvertisementPreviewPage } from '@/features/advertisements/components/AdvertisementPreviewPage'

export const Route = createFileRoute('/(advertisment)/advertisment')({
  component: AdvertisementPreviewPage,
})
