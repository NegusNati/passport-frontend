import { createFileRoute } from '@tanstack/react-router'

import { loadI18nNamespaces } from '@/i18n/loader'

export const Route = createFileRoute('/passports/')({
  loader: async () => {
    await loadI18nNamespaces(['passports'])
  },
  // Component is lazy-loaded in index.lazy.tsx
})
