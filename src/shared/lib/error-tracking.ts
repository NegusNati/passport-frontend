import analytics from './analytics'

const seenErrors = new Set<string>()
const MAX_ERROR_CACHE = 100

function generateErrorKey(message: string, source?: string, lineno?: number): string {
  return `${message}:${source || 'unknown'}:${lineno || 0}`
}

function shouldReportError(key: string): boolean {
  if (seenErrors.has(key)) {
    return false
  }

  seenErrors.add(key)

  // Prevent memory leak by limiting cache size
  if (seenErrors.size > MAX_ERROR_CACHE) {
    const firstKey = seenErrors.values().next().value
    if (firstKey) {
      seenErrors.delete(firstKey)
    }
  }

  return true
}

/**
 * Initialize global error tracking
 * Call this once in main.tsx after PostHog is initialized
 */
export function initializeErrorTracking() {
  // Capture unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    const { message, filename, lineno, colno, error } = event

    const errorKey = generateErrorKey(message, filename ?? undefined, lineno)
    if (!shouldReportError(errorKey)) return

    analytics.capture('frontend_error', {
      type: 'unhandled_error',
      message: message || 'Unknown error',
      source: filename || 'unknown',
      'line-number': lineno || 0,
      'column-number': colno || 0,
      'stack-hash': error ? generateStackHash(error) : 'no_stack',
      route: window.location.pathname,
      'error-boundary': 'window.onerror',
    })
  })

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason) || 'Unhandled rejection'
    const errorKey = generateErrorKey(message)

    if (!shouldReportError(errorKey)) return

    analytics.capture('frontend_error', {
      type: 'unhandled_rejection',
      message,
      'stack-hash': event.reason?.stack ? generateStackHash(event.reason) : 'no_stack',
      route: window.location.pathname,
      'error-boundary': 'window.onunhandledrejection',
    })
  })

  if (import.meta.env.DEV) {
    console.log('[ErrorTracking] Global error handlers initialized')
  }
}

function generateStackHash(error: Error): string {
  const stackLine = error.stack?.split('\n')[1] || error.message
  let hash = 0
  for (let i = 0; i < stackLine.length; i++) {
    const char = stackLine.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return `err_${Math.abs(hash).toString(36)}`
}

/**
 * Manually capture a handled error
 * Use this for try-catch blocks where you want to track the error
 */
export function captureError(
  error: Error | unknown,
  context?: {
    component?: string
    action?: string
    metadata?: Record<string, string | number | boolean>
  },
) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorName = error instanceof Error ? error.name : 'Error'

  analytics.capture('frontend_error', {
    type: 'handled_error',
    'error-type': errorName,
    message: errorMessage,
    'stack-hash': error instanceof Error ? generateStackHash(error) : 'no_stack',
    route: window.location.pathname,
    component: context?.component || 'unknown',
    action: context?.action || 'unknown',
    ...(context?.metadata || {}),
  })
}
