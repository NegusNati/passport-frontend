/**
 * Prerender Script for passport.et
 *
 * This script prerenders the landing page to static HTML for faster FCP/LCP.
 * It runs after the Vite build and uses Puppeteer to render the SPA.
 *
 * Key considerations:
 * - Theme: Prerenders with light theme (inline script in HTML handles flash prevention)
 * - i18n: Prerenders with English (default), React hydrates to user's saved language
 * - Dynamic content: Prerendered HTML is a shell; React hydrates interactive parts
 *
 * Usage: pnpm prerender (runs after build)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { resolve } from 'node:path'

import handler from 'serve-handler'

const DIST_DIR = resolve(process.cwd(), 'dist')
const ROUTES_TO_PRERENDER = ['/']
const PORT = 4567

// Timeouts (in ms)
const PAGE_TIMEOUT = 30000 // 30s for page load
const RENDER_WAIT = 3000 // 3s for React to render
const OVERALL_TIMEOUT = 60000 // 60s total timeout for prerendering

// Check if we should skip prerendering (CI without puppeteer, etc.)
const SKIP_PRERENDER = process.env.SKIP_PRERENDER === 'true'

async function startServer(): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      return handler(req, res, {
        public: DIST_DIR,
        rewrites: [{ source: '**', destination: '/index.html' }],
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

  // Block analytics and external resources to speed up rendering
  console.log(`[prerender] Setting up request interception...`)
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const url = req.url()
    const resourceType = req.resourceType()

    // Block analytics, tracking, and external API calls
    if (
      url.includes('posthog') ||
      url.includes('analytics.passport.et') ||
      url.includes('gtm') ||
      url.includes('googletagmanager') ||
      url.includes('api.passport.et') || // Block API calls - we want static shell
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

  // Give React time to render
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

function processHtml(html: string, route: string): string {
  const originalHtml = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8')

  // Extract the rendered app content from puppeteer output
  const appStartMatch = html.match(/<div id="app"[^>]*>/)
  if (!appStartMatch) {
    console.warn(`[prerender] Could not find app div for ${route}, using original`)
    return originalHtml
  }

  const appStartIndex = html.indexOf(appStartMatch[0]) + appStartMatch[0].length

  // Find the matching closing </div> by counting nested divs
  let depth = 1
  let endIndex = appStartIndex
  const remaining = html.slice(appStartIndex)

  const tagRegex = /<\/?div[^>]*>/gi
  let match
  while ((match = tagRegex.exec(remaining)) !== null) {
    if (match[0].startsWith('</')) {
      depth--
      if (depth === 0) {
        endIndex = appStartIndex + match.index
        break
      }
    } else if (!match[0].endsWith('/>')) {
      depth++
    }
  }

  if (depth !== 0) {
    console.warn(`[prerender] Could not find closing app div for ${route}, using original`)
    return originalHtml
  }

  const renderedContent = html.slice(appStartIndex, endIndex)

  if (!renderedContent || renderedContent.trim().length === 0) {
    console.warn(`[prerender] Rendered content is empty for ${route}, using original`)
    return originalHtml
  }

  console.log(`[prerender] Extracted ${renderedContent.length} chars of content for ${route}`)

  // Replace the empty app div with the prerendered content
  const prerenderedHtml = originalHtml.replace(
    /<div id="app"><\/div>/,
    `<div id="app">${renderedContent}</div>`,
  )

  // Add a marker so we know this page was prerendered
  return prerenderedHtml.replace('<html', '<html data-prerendered="true"')
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
    console.error(`[prerender] Overall timeout (${OVERALL_TIMEOUT}ms) exceeded, exiting...`)
    console.warn('[prerender] Prerendering skipped due to timeout - build will continue without it')
    process.exit(0) // Exit cleanly so build doesn't fail
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

  // Start preview server
  const server = await startServer()

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
    // Check if it's a "Chrome not found" error - skip gracefully instead of failing build
    if (
      errorMessage.includes('Could not find Chrome') ||
      errorMessage.includes('No usable sandbox')
    ) {
      console.warn('[prerender] Chrome/Chromium not available, skipping prerender')
      console.warn('[prerender] This is normal in Docker/CI environments without a browser')
      console.warn(
        '[prerender] To enable prerendering, install Chrome or set SKIP_PRERENDER=true to silence this warning',
      )
      return
    }
    // For other errors, log and exit
    console.error('[prerender] Failed to launch browser:', errorMessage)
    process.exit(1)
  }

  try {
    for (const route of ROUTES_TO_PRERENDER) {
      const html = await prerenderRoute(browser, route)
      const processedHtml = processHtml(html, route)

      // Determine output path
      const outputPath =
        route === '/'
          ? resolve(DIST_DIR, 'index.html')
          : resolve(DIST_DIR, route.slice(1), 'index.html')

      writeFileSync(outputPath, processedHtml)
      console.log(`[prerender] ✅ Saved ${route} → ${outputPath}`)
    }

    console.log('[prerender] ✅ Prerendering complete!')
  } catch (error) {
    console.error('[prerender] Error during prerendering:', error)
    // Don't fail the build - just skip prerendering
    console.warn('[prerender] Prerendering failed - build will continue without it')
  } finally {
    clearTimeout(timeoutId)
    await browser.close()
    server.close()
  }
}

main()
