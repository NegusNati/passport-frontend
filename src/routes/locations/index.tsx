import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { fetchLocations } from '@/features/passports/lib/PassportsApi'
import { passportsKeys } from '@/features/passports/lib/PassportsQuery'

type RouterContext = { queryClient: QueryClient }

export const Route = createFileRoute('/locations/')({
  loader: async ({ context }) => {
    const { queryClient } = context as RouterContext

    await queryClient.prefetchQuery({
      queryKey: passportsKeys.locations(),
      queryFn: fetchLocations,
      staleTime: 5 * 60_000,
    })
  },
  // Component is lazy-loaded in index.lazy.tsx
})
