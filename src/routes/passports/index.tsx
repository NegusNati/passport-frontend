import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import {
  getLocationsQueryOptions,
  getPassportsListQueryOptions,
} from '@/features/passports/lib/PassportsQuery'
import { loadI18nNamespaces } from '@/i18n/loader'

type RouterContext = { queryClient: QueryClient }

export const Route = createFileRoute('/passports/')({
  loader: ({ context }) => {
    const { queryClient } = context as RouterContext

    loadI18nNamespaces(['passports'])
    void queryClient.prefetchQuery(
      getPassportsListQueryOptions({
        page: 1,
        page_size: 10,
        sort: 'dateOfPublish',
        sort_dir: 'desc',
      }),
    )
    void queryClient.prefetchQuery(getLocationsQueryOptions())
  },
  // Component is lazy-loaded in index.lazy.tsx
})
