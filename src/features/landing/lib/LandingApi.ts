import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { ArticleListResponse } from './LandingSchema'

/**
 * Fetch the latest articles for the landing page hero section.
 * Reuses the v1 articles endpoint while limiting the payload to three items.
 */
export async function fetchLandingArticles() {
  const params = {
    per_page: 3,
    page: 1,
    sort: 'published_at',
    sort_dir: 'desc',
  } as const

  const data = await getJSON<unknown>(API_ENDPOINTS.V1.ARTICLES.ROOT, params)
  return ArticleListResponse.parse(data)
}
