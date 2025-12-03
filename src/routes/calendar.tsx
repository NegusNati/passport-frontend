import { createFileRoute } from '@tanstack/react-router'

import { loadI18nNamespaces } from '@/i18n'

export const Route = createFileRoute('/calendar')({
  loader: async () => {
    await loadI18nNamespaces(['calendar'])
  },
})
