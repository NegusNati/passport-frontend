import { createFileRoute } from '@tanstack/react-router'

import { AdvertisementPreviewPage } from '@/features/advertisements/components/AdvertisementPreviewPage'
import { loadI18nNamespaces } from '@/i18n'

export const Route = createFileRoute('/(advertisment)/advertisment')({
  loader: () => loadI18nNamespaces(['advertisements']),
  component: AdvertisementPreviewPage,
})
