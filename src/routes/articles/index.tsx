import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { fetchArticles, type ListParams } from '@/features/articles/lib/ArticlesApi'
import { articlesKeys } from '@/features/articles/lib/ArticlesQuery'

type RouterContext = { queryClient: QueryClient }

const defaultParams: ListParams = {
  per_page: 12,
  page: 1,
  sort: 'published_at',
  sort_dir: 'desc',
}

export const Route = createFileRoute('/articles/')({
  loader: async ({ context }) => {
    const { queryClient } = context as RouterContext

    await queryClient.prefetchQuery({
      queryKey: articlesKeys.list(defaultParams),
      queryFn: () => fetchArticles(defaultParams),
      staleTime: 30_000,
    })
  },
  // Component is lazy-loaded in index.lazy.tsx
})