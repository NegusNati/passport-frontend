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
    ADVERTISEMENT_REQUESTS: {
      ROOT: '/api/v1/advertisement-requests',
      ADMIN: '/api/v1/admin/advertisement-requests',
      ADMIN_BY_ID: (id: string | number) => `/api/v1/admin/advertisement-requests/${id}`,
    },
    ADVERTISEMENTS: {
      BY_PLACEMENT: '/api/v1/advertisements/placement', // GET ?placement=home-hero
      IMPRESSION: '/api/v1/advertisements/impression', // POST
      CLICK: '/api/v1/advertisements/click', // POST
      ADMIN: '/api/v1/admin/advertisements', // GET, POST
      ADMIN_BY_ID: (id: string | number) => `/api/v1/admin/advertisements/${id}`, // GET, PATCH, DELETE
      ADMIN_STATS: '/api/v1/admin/advertisements/stats', // GET
    },
  },
  // Optional additional domains can live here later (auth, profile, etc.)
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
