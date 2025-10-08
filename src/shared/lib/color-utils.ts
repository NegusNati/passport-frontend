/**
 * Utility functions for handling OKLCH colors in HTML2Canvas
 * Converts modern OKLCH color functions to browser-compatible RGB values
 */

const OKLCH_FUNCTION_REGEX = /oklch\([^)]*\)/gi

const COLOR_PROPERTIES = [
  'color',
  'background-color',
  'background',
  'background-image',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'box-shadow',
  'text-decoration-color',
  'fill',
  'stroke',
] as const

interface StyleSnapshot {
  element: HTMLElement
  originalStyles: Map<string, string>
}

/**
 * Converts OKLCH color values to RGB by using browser's computed styles
 * This allows html2canvas to parse colors correctly
 */
export function normalizeOklchColors(root: HTMLElement): () => void {
  const doc = root.ownerDocument
  const win = doc.defaultView
  if (!win) return () => {}

  const snapshots: StyleSnapshot[] = []
  const conversionCache = new Map<string, string>()

  // Create temporary element for color conversion
  const tempEl = doc.createElement('div')
  tempEl.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none'
  doc.body.appendChild(tempEl)

  const convertOklchToRgb = (oklchValue: string): string => {
    // Check cache first
    const cached = conversionCache.get(oklchValue)
    if (cached) return cached

    // Use browser to compute RGB equivalent
    tempEl.style.color = oklchValue
    const computedColor = win.getComputedStyle(tempEl).color

    // Validate and cache result
    const result =
      computedColor && computedColor !== oklchValue && !computedColor.includes('oklch')
        ? computedColor
        : 'rgb(0, 0, 0)'

    conversionCache.set(oklchValue, result)
    return result
  }

  const convertValue = (value: string | null): string | null => {
    if (!value) return value

    OKLCH_FUNCTION_REGEX.lastIndex = 0
    if (!OKLCH_FUNCTION_REGEX.test(value)) return value

    OKLCH_FUNCTION_REGEX.lastIndex = 0
    return value.replace(OKLCH_FUNCTION_REGEX, (match) => convertOklchToRgb(match))
  }

  // Process all elements
  const elements: HTMLElement[] = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]

  for (const element of elements) {
    const computed = win.getComputedStyle(element)
    const originalStyles = new Map<string, string>()

    // Check each color property
    for (const property of COLOR_PROPERTIES) {
      const current = computed.getPropertyValue(property)
      if (!current) continue

      const converted = convertValue(current)
      if (converted && converted !== current) {
        // Store original inline style (if any)
        const inlineValue = element.style.getPropertyValue(property)
        if (inlineValue) {
          originalStyles.set(property, inlineValue)
        }

        // Apply converted color
        element.style.setProperty(property, converted, 'important')
      }
    }

    if (originalStyles.size > 0) {
      snapshots.push({ element, originalStyles })
    }
  }

  // Cleanup temp element
  tempEl.remove()

  // Return cleanup function to restore original styles
  return () => {
    for (const { element, originalStyles } of snapshots) {
      for (const [property, value] of originalStyles) {
        element.style.setProperty(property, value)
      }
    }
  }
}

/**
 * Add comprehensive style overrides to cloned document for html2canvas
 * This ensures OKLCH colors are properly handled in the cloned DOM
 */
export function addColorFallbackStyles(clonedDoc: Document): void {
  const style = clonedDoc.createElement('style')
  style.textContent = `
    * {
      color-scheme: light !important;
    }
    
    /* Tailwind color fallbacks for common classes */
    .text-red-900 { color: #7f1d1d !important; }
    .text-red-800 { color: #991b1b !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-gray-900 { color: #111827 !important; }
    .text-primary { color: #009966 !important; }
    
    .bg-emerald-600 { background-color: #059669 !important; }
    .bg-emerald-700 { background-color: #047857 !important; }
    .bg-white { background-color: #ffffff !important; }
    
    .border-primary { border-color: #009966 !important; }
    .border-gray-300 { border-color: #d1d5db !important; }
  `
  clonedDoc.head.appendChild(style)
}
