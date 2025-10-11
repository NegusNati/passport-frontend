import { createFileRoute } from '@tanstack/react-router'

import { fetchLandingArticles } from '@/features/landing/lib/LandingApi'
import { landingKeys } from '@/features/landing/lib/LandingQuery'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery({
      queryKey: landingKeys.articles(),
      queryFn: fetchLandingArticles,
      staleTime: 5 * 60_000,
    })
  },
})
