import { type QueryKey, useQuery } from '@tanstack/react-query'

import { fetchLandingArticles } from './LandingApi'

/**
 * Query key factory for the landing feature.
 */
export const landingKeys = {
  all: ['landing'] as const,
  articles: () => [...landingKeys.all, 'articles'] as const,
}

/**
 * Query hook for landing page articles.
 */
export function useLandingArticlesQuery() {
  return useQuery({
    queryKey: landingKeys.articles() as QueryKey,
    queryFn: fetchLandingArticles,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  })
}
