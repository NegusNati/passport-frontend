#!/usr/bin/env node
/**
 * Sitemap Generator for Passport.ET
 * Generates sitemap.xml with all public routes
 * Run: pnpm run generate:sitemap
 */

import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { toLocationSlug } from '../src/features/passports/lib/location-slug.ts'
import { API_ENDPOINTS } from '../src/shared/lib/API_ENDPOINTS.ts'

// Configuration
const SITE_URL = process.env.VITE_SITE_URL || 'https://passport.et'
const DIST_DIR = join(process.cwd(), 'dist')
// const ROUTES_DIR = join(process.cwd(), 'src', 'routes') // Reserved for future auto-discovery

// Route configuration: path, priority, changefreq
type RouteConfig = {
  path: string
  priority: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  lastmod?: string
}

const STATIC_ROUTES: RouteConfig[] = [
  // High priority pages
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/articles', priority: '0.9', changefreq: 'daily' },
  { path: '/passports', priority: '0.9', changefreq: 'daily' },
  { path: '/calendar', priority: '0.8', changefreq: 'weekly' },

  // Medium priority
  { path: '/locations', priority: '0.8', changefreq: 'weekly' },
  { path: '/register', priority: '0.7', changefreq: 'monthly' },
  { path: '/login', priority: '0.6', changefreq: 'monthly' },
]

// Routes to exclude from sitemap (reserved for future auto-discovery feature)
// const EXCLUDE_PATTERNS = ['__root', 'admin', 'profile', 'test', '.lazy', '$']

/**
 * Generate sitemap XML
 */
function generateSitemapXML(routes: RouteConfig[]): string {
  const now = new Date().toISOString().split('T')[0]

  const urls = routes
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((route) => {
      const url = `${SITE_URL}${route.path}`.replace(/\/$/, '') || SITE_URL
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${route.lastmod || now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>
`
}

const API_BASE_URL = (() => {
  const envUrl = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv && nodeEnv.toLowerCase() === 'development') {
    return 'http://app.localhost'
  }
  return 'https://api.passport.et'
})()

async function fetchLocationsFromApi(): Promise<string[]> {
  const endpoint = `${API_BASE_URL}${API_ENDPOINTS.V1.LOCATIONS}`
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      console.warn(`⚠️  Failed to fetch locations (status ${response.status})`)
      return []
    }

    const json = (await response.json()) as { data?: unknown }
    if (!json || !Array.isArray(json.data)) return []

    return json.data.filter((item): item is string => typeof item === 'string')
  } catch (error) {
    console.warn('⚠️  Error fetching locations for sitemap:', error)
    return []
  }
}

async function getLocationRoutes(): Promise<RouteConfig[]> {
  const locations = await fetchLocationsFromApi()
  if (!locations.length) return []

  const deduped = Array.from(new Set(locations))
  return deduped
    .map((location) => ({
      location,
      slug: toLocationSlug(location),
    }))
    .filter((entry) => entry.slug.length > 0)
    .map<RouteConfig>((entry) => ({
      path: `/locations/${entry.slug}`,
      priority: '0.7',
      changefreq: 'daily',
    }))
}

function dedupeRoutes(routes: RouteConfig[]) {
  const map = new Map<string, RouteConfig>()
  for (const route of routes) {
    if (!map.has(route.path)) {
      map.set(route.path, route)
    }
  }
  return Array.from(map.values())
}

/**
 * Main execution
 */
async function main() {
  console.log('🗺️  Generating sitemap for Passport.ET...')
  console.log(`Site URL: ${SITE_URL}`)

  const locationRoutes = await getLocationRoutes()
  if (locationRoutes.length) {
    console.log(`📍 Including ${locationRoutes.length} location routes`)
  } else {
    console.warn('⚠️  No location routes discovered; sitemap will omit location detail pages')
  }

  const allRoutes = dedupeRoutes([...STATIC_ROUTES, ...locationRoutes])

  // Generate sitemap XML
  const sitemapXML = generateSitemapXML(allRoutes)

  // Ensure dist directory exists
  if (!existsSync(DIST_DIR)) {
    console.error(`❌ Error: dist directory not found at ${DIST_DIR}`)
    console.error('   Please run "pnpm build" first')
    process.exit(1)
  }

  // Write sitemap.xml to dist
  const sitemapPath = join(DIST_DIR, 'sitemap.xml')
  writeFileSync(sitemapPath, sitemapXML, 'utf-8')
  console.log(`✅ Sitemap generated: ${sitemapPath}`)
  console.log(`   Total URLs: ${allRoutes.length}`)

  // Also write robots.txt reference (optional)
  console.log(`🤖 Robots.txt should reference: ${SITE_URL}/sitemap.xml`)
  console.log('✅ Done!')
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Failed to generate sitemap:', error)
    process.exit(1)
  })
}

export { API_BASE_URL, dedupeRoutes, generateSitemapXML, getLocationRoutes,STATIC_ROUTES }
