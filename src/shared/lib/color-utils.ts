/**
 * Utility functions for handling OKLCH colors in HTML2Canvas
 * Converts modern OKLCH color functions to browser-compatible RGB values
 */

const MODERN_COLOR_FUNCTIONS = ['color-mix', 'oklch', 'oklab', 'lch', 'lab', 'color'] as const

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
 * Converts modern color functions (OKLCH/OKLAB/Color Mix/etc.) to RGB
 * This allows html2canvas to parse colors correctly
 */
export function normalizeOklchColors(root: HTMLElement): () => void {
  const doc = root.ownerDocument
  const win = doc.defaultView
  if (!win) return () => {}

  const snapshots: StyleSnapshot[] = []
  const conversionCache = new Map<string, string>()
  const canvas = doc.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  const canParseColor = (value: string) =>
    typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
      ? CSS.supports('color', value)
      : true

  const convertColorToRgb = (colorValue: string): string | null => {
    const cached = conversionCache.get(colorValue)
    if (cached) return cached
    if (!ctx || !canParseColor(colorValue)) return null

    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = '#000000'
    ctx.fillStyle = colorValue
    ctx.fillRect(0, 0, 1, 1)

    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    const alpha = a / 255
    const result =
      alpha >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`

    conversionCache.set(colorValue, result)
    return result
  }

  const findNextFunction = (value: string, startIndex: number) => {
    const lower = value.toLowerCase()
    let nextIndex = -1
    let nextFunction = ''

    for (const fn of MODERN_COLOR_FUNCTIONS) {
      const idx = lower.indexOf(`${fn}(`, startIndex)
      if (idx !== -1 && (nextIndex === -1 || idx < nextIndex)) {
        nextIndex = idx
        nextFunction = fn
      }
    }

    return { index: nextIndex, fn: nextFunction }
  }

  const replaceColorFunctions = (value: string): string => {
    const hasModernColor = MODERN_COLOR_FUNCTIONS.some((fn) =>
      value.toLowerCase().includes(`${fn}(`),
    )
    if (!hasModernColor) return value

    let result = ''
    let cursor = 0

    while (cursor < value.length) {
      const { index, fn } = findNextFunction(value, cursor)
      if (index === -1) {
        result += value.slice(cursor)
        break
      }

      result += value.slice(cursor, index)
      const openIndex = index + fn.length
      let depth = 0
      let endIndex = -1

      for (let i = openIndex; i < value.length; i++) {
        const char = value[i]
        if (char === '(') depth++
        if (char === ')') {
          depth--
          if (depth === 0) {
            endIndex = i
            break
          }
        }
      }

      if (endIndex === -1) {
        result += value.slice(index)
        break
      }

      const fullExpression = value.slice(index, endIndex + 1)
      const converted = convertColorToRgb(fullExpression)
      result += converted ?? fullExpression
      cursor = endIndex + 1
    }

    return result
  }

  const convertValue = (value: string | null): string | null => {
    if (!value) return value
    return replaceColorFunctions(value)
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
        originalStyles.set(property, inlineValue)

        // Apply converted color
        element.style.setProperty(property, converted, 'important')
      }
    }

    if (originalStyles.size > 0) {
      snapshots.push({ element, originalStyles })
    }
  }

  // Return cleanup function to restore original styles
  return () => {
    for (const { element, originalStyles } of snapshots) {
      for (const [property, value] of originalStyles) {
        if (value) {
          element.style.setProperty(property, value)
        } else {
          element.style.removeProperty(property)
        }
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
