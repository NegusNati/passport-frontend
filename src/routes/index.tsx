import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { advertisementKeys, fetchAdsBySlots } from '@/features/advertisements/api/get-ad'
import { fetchLandingArticles } from '@/features/landing/lib/LandingApi'
import { landingKeys } from '@/features/landing/lib/LandingQuery'
import { loadI18nNamespaces } from '@/i18n/loader'

type RouterContext = { queryClient: QueryClient }

export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    const { queryClient } = context as RouterContext

    // Fire-and-forget: Start loading translations and data without blocking render
    // This allows the page to show immediately with English fallback,
    // then hydrate when translations/data are ready.
    // Components use Suspense/loading states to handle the async data.
    loadI18nNamespaces(['landing'])
    queryClient.prefetchQuery({
      queryKey: landingKeys.articles(),
      queryFn: fetchLandingArticles,
      staleTime: 5 * 60_000,
    })
    queryClient.prefetchQuery({
      queryKey: advertisementKeys.slots(['home-alerts-banner', 'home-download-app']),
      queryFn: () => fetchAdsBySlots(['home-alerts-banner', 'home-download-app']),
      staleTime: 5 * 60_000,
    })

    // Return immediately - don't block the route
    return {}
  },
})
