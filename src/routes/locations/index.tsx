import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { fetchLocations } from '@/features/passports/lib/PassportsApi'
import { passportsKeys } from '@/features/passports/lib/PassportsQuery'
import { loadI18nNamespaces } from '@/i18n/loader'

type RouterContext = { queryClient: QueryClient }

export const Route = createFileRoute('/locations/')({
  loader: async ({ context }) => {
    const { queryClient } = context as RouterContext

    await Promise.all([
      loadI18nNamespaces(['passports']),
      queryClient.prefetchQuery({
        queryKey: passportsKeys.locations(),
        queryFn: fetchLocations,
        staleTime: 5 * 60_000,
      }),
    ])
  },
  // Component is lazy-loaded in index.lazy.tsx
})
