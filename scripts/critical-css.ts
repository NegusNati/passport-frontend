/**
 * Critical CSS Script
 *
 * Extracts and inlines above-the-fold CSS into index.html
 * This runs AFTER prerendering so it can extract CSS for the prerendered content
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DIST_DIR = resolve(process.cwd(), 'dist')
const HTML_PATH = resolve(DIST_DIR, 'index.html')

async function main() {
  console.log('[critical-css] Starting critical CSS extraction...')

  if (!existsSync(HTML_PATH)) {
    console.warn('[critical-css] index.html not found, skipping')
    return
  }

  // Dynamically import beasties
  let Beasties: new (options: Record<string, unknown>) => { process(html: string): Promise<string> }
  try {
    const mod = await import('beasties')
    Beasties = (mod.default || mod) as typeof Beasties
  } catch {
    console.warn('[critical-css] Beasties not available, skipping critical CSS extraction')
    return
  }

  const beasties = new Beasties({
    preload: 'media',
    pruneSource: false,
    reduceInlineStyles: false,
    logLevel: 'info',
    path: DIST_DIR,
    publicPath: '/',
  })

  try {
    const html = readFileSync(HTML_PATH, 'utf-8')
    const inlined = await beasties.process(html)
    writeFileSync(HTML_PATH, inlined)
    console.log('[critical-css] ✅ Inlined above-the-fold CSS into index.html')
  } catch (error) {
    console.error('[critical-css] Failed to inline CSS:', error)
    // Don't fail the build
  }
}

main()
