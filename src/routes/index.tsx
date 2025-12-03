import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { fetchLandingArticles } from '@/features/landing/lib/LandingApi'
import { landingKeys } from '@/features/landing/lib/LandingQuery'
import { loadI18nNamespaces } from '@/i18n/loader'

type RouterContext = { queryClient: QueryClient }

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const { queryClient } = context as RouterContext

    // Load translations and data in parallel
    await Promise.all([
      loadI18nNamespaces(['landing']),
      queryClient.prefetchQuery({
        queryKey: landingKeys.articles(),
        queryFn: fetchLandingArticles,
        staleTime: 5 * 60_000,
      }),
    ])
  },
})
