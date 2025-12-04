/**
 * Lazy font loading utilities for performance optimization
 *
 * Ethiopic font (Noto Sans Ethiopic) is only loaded when the user
 * switches to Amharic (am) or Tigrinya (ti) language.
 */

let ethiopicFontLoaded = false
let ethiopicFontLoading: Promise<void> | null = null

/**
 * Preload the Ethiopic font file without blocking.
 * This creates a <link rel="preload"> to hint the browser.
 */
export function preloadEthiopicFont(): void {
  if (ethiopicFontLoaded) return

  // Check if preload link already exists
  const existing = document.head.querySelector(
    'link[rel="preload"][href="/fonts/noto-sans-ethiopic.woff2"]',
  )
  if (existing) return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'font'
  link.type = 'font/woff2'
  link.href = '/fonts/noto-sans-ethiopic.woff2'
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

/**
 * Load the Ethiopic font and ensure it's ready for rendering.
 * Uses the CSS Font Loading API for reliable font activation.
 *
 * @returns Promise that resolves when the font is loaded and ready
 */
export async function loadEthiopicFont(): Promise<void> {
  if (ethiopicFontLoaded) return

  // Return existing promise if already loading
  if (ethiopicFontLoading) return ethiopicFontLoading

  ethiopicFontLoading = (async () => {
    try {
      // Use the CSS Font Loading API if available
      if (document.fonts) {
        // The font is defined in CSS, we just need to trigger its load
        // by checking if it's ready or loading it explicitly
        await document.fonts.load('400 16px "Noto Sans Ethiopic"')
        await document.fonts.load('500 16px "Noto Sans Ethiopic"')
        await document.fonts.load('600 16px "Noto Sans Ethiopic"')
        await document.fonts.load('700 16px "Noto Sans Ethiopic"')
      } else {
        // Fallback: Create a hidden element to trigger font load
        const testElement = document.createElement('span')
        testElement.style.fontFamily = '"Noto Sans Ethiopic"'
        testElement.style.position = 'absolute'
        testElement.style.visibility = 'hidden'
        testElement.style.left = '-9999px'
        testElement.textContent = 'ሀ' // Ethiopic character
        document.body.appendChild(testElement)

        // Wait a bit for the font to load
        await new Promise<void>((resolve) => setTimeout(resolve, 100))
        document.body.removeChild(testElement)
      }

      ethiopicFontLoaded = true
    } catch (error) {
      console.warn('[fonts] Failed to load Ethiopic font:', error)
      // Don't throw - the CSS fallback will handle it
    }
  })()

  return ethiopicFontLoading
}

/**
 * Check if Ethiopic font is already loaded
 */
export function isEthiopicFontLoaded(): boolean {
  return ethiopicFontLoaded
}

/**
 * Languages that require the Ethiopic font
 */
export const ETHIOPIC_LANGUAGES = ['am', 'ti'] as const

/**
 * Check if a language requires the Ethiopic font
 */
export function requiresEthiopicFont(lang: string): boolean {
  return ETHIOPIC_LANGUAGES.includes(lang as (typeof ETHIOPIC_LANGUAGES)[number])
}
