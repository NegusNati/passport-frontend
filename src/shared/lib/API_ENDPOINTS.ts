// URLs after the base URL (see env.ts for base resolution)

export const API_ENDPOINTS = {
  // API v1 namespace
  V1: {
    ARTICLES: {
      ROOT: '/api/v1/articles',
      BY_SLUG: (slug: string) => `/api/v1/articles/${slug}`,
    },
    CATEGORIES: '/api/v1/categories',
    TAGS: '/api/v1/tags',
    FEEDS: {
      RSS: '/api/v1/feeds/articles.rss',
      ATOM: '/api/v1/feeds/articles.atom',
    },
    PASSPORTS: {
      ROOT: '/api/v1/passports',
      BY_ID: (id: string | number) => `/api/v1/passports/${id}`,
    },
    LOCATIONS: '/api/v1/locations',
  },
  // Optional additional domains can live here later (auth, profile, etc.)
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
