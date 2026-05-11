/**
 * Prerender Script for passport.et
 *
 * This script prerenders public sitemap routes to static HTML for faster FCP/LCP
 * and reliable crawler-visible metadata/content.
 * It runs after the Vite build and uses Puppeteer to render the SPA.
 *
 * Key considerations:
 * - Theme: Prerenders with light theme (inline script in HTML handles flash prevention)
 * - i18n: Prerenders with English (default), React hydrates to user's saved language
 * - Dynamic content: Prerendered HTML is a shell; React hydrates interactive parts
 *
 * Usage: pnpm prerender (runs after build)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, resolve } from 'node:path'

import handler from 'serve-handler'

const DIST_DIR = resolve(process.cwd(), 'dist')
const SITEMAP_PATH = resolve(DIST_DIR, 'sitemap.xml')
const SITE_URL = (process.env.VITE_SITE_URL || 'https://passport.et').replace(/\/$/, '')
const PORT = 4567
const TINY_TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

// Timeouts (in ms)
const PAGE_TIMEOUT = 30000 // 30s for page load
const RENDER_WAIT = 1000 // small settle time after route content appears
const OVERALL_TIMEOUT = 10 * 60_000 // public sitemap routes can include many dynamic pages

// Check if we should skip prerendering (CI without puppeteer, etc.)
const SKIP_PRERENDER = process.env.SKIP_PRERENDER === 'true'

type PrerenderFixtures = {
  locations: string[]
}

function getRoutesToPrerender(): string[] {
  const explicitRoutes = process.env.PRERENDER_ROUTES
  if (explicitRoutes) {
    return explicitRoutes
      .split(',')
      .map((route) => route.trim())
      .filter(Boolean)
      .map((route) => (route.startsWith('/') ? route : `/${route}`))
  }

  if (!existsSync(SITEMAP_PATH)) {
    throw new Error('[prerender] sitemap.xml not found. Run generate-sitemap before prerender.')
  }

  const sitemap = readFileSync(SITEMAP_PATH, 'utf-8')
  const routes = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
    .map((match) => {
      try {
        return new URL(match[1]).pathname || '/'
      } catch {
        return null
      }
    })
    .filter((route): route is string => Boolean(route))

  const deduped = Array.from(new Set(routes))
  if (!deduped.length) {
    throw new Error('[prerender] No routes found in sitemap.xml')
  }

  return deduped
}

function titleCaseLocationSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) =>
      part.toLowerCase() === 'ics' ? 'ICS' : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(' ')
}

function getFixtures(routes: string[]): PrerenderFixtures {
  const locations = routes
    .filter((route) => route.startsWith('/locations/') && route.length > '/locations/'.length)
    .map((route) => titleCaseLocationSlug(route.slice('/locations/'.length)))

  return {
    locations: Array.from(new Set(locations)),
  }
}

function emptyPassportListResponse() {
  return {
    data: [],
    links: {},
    meta: {
      current_page: 1,
      per_page: 25,
      page_size: 25,
      page_size_options: [10, 25, 50, 100],
      total: 0,
      last_page: 1,
      has_more: false,
    },
    filters: [],
  }
}

function emptyAdsBySlotResponse() {
  return { data: {} }
}

function emptyAdResponse() {
  return { data: null }
}

async function startServer(baseHtml: string): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      const pathname = req.url ? new URL(req.url, `http://localhost:${PORT}`).pathname : '/'
      const acceptsHtml = req.headers.accept?.includes('text/html')
      const isRouteRequest = req.method === 'GET' && (acceptsHtml || !extname(pathname))

      if (isRouteRequest) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(baseHtml)
        return
      }

      return handler(req, res, {
        public: DIST_DIR,
      })
    })

    server.listen(PORT, () => {
      console.log(`[prerender] Preview server running at http://localhost:${PORT}`)
      resolvePromise(server)
    })
  })
}

async function prerenderRoute(
  browser: import('puppeteer').Browser,
  route: string,
  fixtures: PrerenderFixtures,
): Promise<string> {
  console.log(`[prerender] Creating new page for ${route}...`)
  const page = await browser.newPage()

  // Log console messages from the page for debugging
  page.on('console', (msg) => {
    const type = msg.type()
    if (type === 'error' || type === 'warn') {
      console.log(`[prerender] Page ${type}: ${msg.text()}`)
    }
  })

  // Log errors for debugging
  page.on('pageerror', (err) => {
    console.log(`[prerender] Page error: ${String(err)}`)
  })

  // Set viewport for consistent rendering
  console.log(`[prerender] Setting viewport...`)
  await page.setViewport({ width: 1280, height: 800 })
  await page.evaluateOnNewDocument((prerenderFixtures) => {
    Object.defineProperty(window, '__PASSPORT_PRERENDER_FIXTURES__', {
      configurable: false,
      enumerable: false,
      value: prerenderFixtures,
      writable: false,
    })
  }, fixtures)

  // Block analytics and external resources to speed up rendering
  console.log(`[prerender] Setting up request interception...`)
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const url = req.url()
    const resourceType = req.resourceType()

    if (url.includes('/api/v1/locations')) {
      void req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: fixtures.locations,
          meta: { count: fixtures.locations.length },
        }),
      })
      return
    }

    if (url.includes('/api/v1/passports')) {
      void req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyPassportListResponse()),
      })
      return
    }

    if (
      url.includes('/api/v1/advertisements/slots?') ||
      url.endsWith('/api/v1/advertisements/slots')
    ) {
      void req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyAdsBySlotResponse()),
      })
      return
    }

    if (url.includes('/api/v1/advertisements/slots/')) {
      void req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyAdResponse()),
      })
      return
    }

    // Block analytics/tracking. Keep API calls available so prerendered pages
    // contain real public route metadata and content.
    if (
      url.includes('posthog') ||
      url.includes('analytics.passport.et') ||
      url.includes('gtm') ||
      url.includes('googletagmanager') ||
      (resourceType === 'image' && !url.includes('localhost')) // Block external images
    ) {
      void req.abort()
    } else {
      void req.continue()
    }
  })

  const url = `http://localhost:${PORT}${route}`
  console.log(`[prerender] Navigating to ${url}...`)

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded', // Don't wait for all resources, just DOM
      timeout: PAGE_TIMEOUT,
    })
    console.log(`[prerender] Page loaded, waiting for React to render...`)
  } catch (navError) {
    console.error(`[prerender] Navigation error:`, navError)
    throw navError
  }

  await page.waitForFunction(
    () => {
      const app = document.getElementById('app')
      if (!app) return false
      return app.querySelector('h1') !== null
    },
    { timeout: PAGE_TIMEOUT },
  )

  // Give Helmet and deferred route content a short settle window.
  await new Promise((r) => setTimeout(r, RENDER_WAIT))

  // Check if app has content
  const hasContent = await page.evaluate(() => {
    const app = document.getElementById('app')
    return app && app.innerHTML.trim().length > 0
  })

  if (!hasContent) {
    console.warn(`[prerender] Warning: App div appears empty for ${route}`)
  } else {
    console.log(`[prerender] App content detected`)
  }

  // Get the rendered HTML
  console.log(`[prerender] Extracting HTML...`)
  const html = await page.content()
  console.log(`[prerender] Got ${html.length} bytes of HTML`)

  await page.close()
  return html
}

function getExpectedCanonical(route: string) {
  return route === '/' ? SITE_URL : `${SITE_URL}${route}`
}

function normalizeCanonical(html: string, route: string) {
  const expectedCanonical = getExpectedCanonical(route)
  const withoutCanonicals = html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '')

  return withoutCanonicals.replace(
    '</head>',
    `    <link rel="canonical" href="${expectedCanonical}">\n  </head>`,
  )
}

function getFirstMatch(html: string, regex: RegExp) {
  return html.match(regex)?.[1]?.replace(/\s+/g, ' ').trim()
}

function validateRenderedHtml(html: string, route: string) {
  if (!html.includes('<div id="app"') || html.includes('<div id="app"></div>')) {
    throw new Error(`[prerender] Rendered app content is empty for ${route}`)
  }

  const title = getFirstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
  const canonical = getFirstMatch(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)/i)
  const h1 = getFirstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const ogTitle = getFirstMatch(
    html,
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)/i,
  )
  const ogUrl = getFirstMatch(html, /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)/i)
  const ogDescription = getFirstMatch(
    html,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)/i,
  )
  const twitterTitle = getFirstMatch(
    html,
    /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']*)/i,
  )
  const expectedCanonical = getExpectedCanonical(route)

  if (!title) {
    throw new Error(`[prerender] Missing title for ${route}`)
  }

  if (canonical !== expectedCanonical) {
    throw new Error(
      `[prerender] Canonical mismatch for ${route}. Expected ${expectedCanonical}, got ${canonical || 'none'}`,
    )
  }

  if (!h1) {
    throw new Error(`[prerender] Missing h1 for ${route}`)
  }

  if (/Something went off course/i.test(h1)) {
    throw new Error(`[prerender] Error boundary rendered for ${route}`)
  }

  if (!ogTitle || !ogUrl || !ogDescription || !twitterTitle) {
    throw new Error(`[prerender] Missing social metadata for ${route}`)
  }
}

function stripInlineImagePayloads(html: string) {
  return html.replace(/<img\b[^>]*\bsrc=(["'])data:image\/[^"']+\1[^>]*>/gi, (tag) => {
    const withTinySrc = tag.replace(
      /\bsrc=(["'])data:image\/[^"']+\1/i,
      `src="${TINY_TRANSPARENT_IMAGE}"`,
    )

    if (/\bdata-prerender-src-omitted=/.test(withTinySrc)) {
      return withTinySrc
    }

    return withTinySrc.replace(/>$/, ' data-prerender-src-omitted="true">')
  })
}

function processHtml(html: string, route: string): string {
  const normalizedHtml = normalizeCanonical(stripInlineImagePayloads(html), route)
  validateRenderedHtml(normalizedHtml, route)

  return normalizedHtml.replace(
    /<html([^>]*)>/,
    `<html$1 data-prerendered="true" data-prerendered-route="${route}">`,
  )
}

function getOutputPath(route: string): string {
  return route === '/'
    ? resolve(DIST_DIR, 'index.html')
    : resolve(DIST_DIR, route.replace(/^\//, ''), 'index.html')
}

async function main() {
  if (SKIP_PRERENDER) {
    console.log('[prerender] Skipping prerender (SKIP_PRERENDER=true)')
    return
  }

  if (!existsSync(DIST_DIR)) {
    console.error('[prerender] Error: dist directory not found. Run build first.')
    process.exit(1)
  }

  console.log('[prerender] Starting prerender process...')

  // Set overall timeout
  const timeoutId = setTimeout(() => {
    console.error(`[prerender] Overall timeout (${OVERALL_TIMEOUT}ms) exceeded`)
    process.exit(1)
  }, OVERALL_TIMEOUT)

  // Dynamically import puppeteer (might not be available in all environments)
  let puppeteer: typeof import('puppeteer')
  try {
    console.log('[prerender] Importing puppeteer...')
    puppeteer = await import('puppeteer')
    console.log('[prerender] Puppeteer imported successfully')
  } catch {
    clearTimeout(timeoutId)
    console.warn('[prerender] Puppeteer not available, skipping prerender')
    console.warn('[prerender] Install with: pnpm add -D puppeteer')
    return
  }

  // Keep the unmodified SPA shell for every route render. The script writes
  // prerendered files during the same process, so serving dist/index.html
  // directly would leak one route's head/body into later route renders.
  const baseHtml = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8')

  // Start preview server
  const server = await startServer(baseHtml)

  // Launch browser - wrap in try/catch to handle missing Chrome gracefully
  let browser: import('puppeteer').Browser
  try {
    // Use system Chromium if PUPPETEER_EXECUTABLE_PATH is set (Docker), otherwise let Puppeteer find Chrome
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
    console.log(
      `[prerender] Launching browser${executablePath ? ` with executable: ${executablePath}` : ''}...`,
    )
    browser = await puppeteer.default.launch({
      headless: true,
      executablePath: executablePath || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--no-first-run',
        '--no-zygote', // Important for Docker
        '--single-process', // Required for some Docker environments
      ],
    })
    console.log('[prerender] Browser launched successfully')
  } catch (launchError) {
    clearTimeout(timeoutId)
    server.close()
    const errorMessage = launchError instanceof Error ? launchError.message : String(launchError)
    if (
      errorMessage.includes('Could not find Chrome') ||
      errorMessage.includes('No usable sandbox')
    ) {
      console.error('[prerender] Chrome/Chromium not available')
      console.error(
        '[prerender] Install a browser for Puppeteer or set SKIP_PRERENDER=true explicitly for non-SEO builds.',
      )
      process.exit(1)
    }
    console.error('[prerender] Failed to launch browser:', errorMessage)
    process.exit(1)
  }

  try {
    const routesToPrerender = getRoutesToPrerender()
    const fixtures = getFixtures(routesToPrerender)
    console.log(`[prerender] Routes discovered from sitemap: ${routesToPrerender.length}`)

    for (const route of routesToPrerender) {
      const html = await prerenderRoute(browser, route, fixtures)
      const processedHtml = processHtml(html, route)
      const outputPath = getOutputPath(route)

      mkdirSync(dirname(outputPath), { recursive: true })
      writeFileSync(outputPath, processedHtml)
      console.log(`[prerender] ✅ Saved ${route} → ${outputPath}`)
    }

    console.log('[prerender] ✅ Prerendering complete!')
  } catch (error) {
    console.error('[prerender] Error during prerendering:', error)
    process.exitCode = 1
  } finally {
    clearTimeout(timeoutId)
    await browser.close()
    server.close()
  }
}

main()
