import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { fetchArticles, type ListParams } from '@/features/articles/lib/ArticlesApi'
import {
  articlesKeys,
  getCategoriesQueryOptions,
  getTagsQueryOptions,
} from '@/features/articles/lib/ArticlesQuery'
import { loadI18nNamespaces } from '@/i18n'

type RouterContext = { queryClient: QueryClient }

const defaultParams: ListParams = {
  per_page: 12,
  page: 1,
  sort: 'published_at',
  sort_dir: 'desc',
}

export const Route = createFileRoute('/articles/')({
  loader: ({ context }) => {
    const { queryClient } = context as RouterContext

    loadI18nNamespaces(['articles'])
    void queryClient.prefetchQuery({
      queryKey: articlesKeys.list(defaultParams),
      queryFn: () => fetchArticles(defaultParams),
      staleTime: 60_000,
      gcTime: 30 * 60_000,
      networkMode: 'offlineFirst',
    })
    void queryClient.prefetchQuery(getCategoriesQueryOptions())
    void queryClient.prefetchQuery(getTagsQueryOptions())
  },
  // Component is lazy-loaded in index.lazy.tsx
})
