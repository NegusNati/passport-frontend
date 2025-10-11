#!/usr/bin/env node
/**
 * Sitemap Generator for Passport.ET
 * Generates sitemap.xml with all public routes
 * Run: pnpm run generate:sitemap
 */

import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

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

const routes: RouteConfig[] = [
  // High priority pages
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/articles', priority: '0.9', changefreq: 'daily' },
  { path: '/calendar', priority: '0.8', changefreq: 'weekly' },

  // Medium priority
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

/**
 * Main execution
 */
function main() {
  console.log('🗺️  Generating sitemap for Passport.ET...')
  console.log(`Site URL: ${SITE_URL}`)

  // Scan for additional routes (optional enhancement)
  // const discoveredRoutes = scanRoutes(ROUTES_DIR)
  // console.log(`Discovered ${discoveredRoutes.length} routes`)

  // Generate sitemap XML
  const sitemapXML = generateSitemapXML(routes)

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
  console.log(`   Total URLs: ${routes.length}`)

  // Also write robots.txt reference (optional)
  console.log(`🤖 Robots.txt should reference: ${SITE_URL}/sitemap.xml`)
  console.log('✅ Done!')
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateSitemapXML, routes }
