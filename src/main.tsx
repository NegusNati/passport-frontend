import './styles.css'
// initialize i18n (loads local resources for now)
import '@/i18n'

import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import type { PostHog } from 'posthog-js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import { restoreAuthTokenFromStorage } from '@/api/client'
import { queryClient } from '@/api/queryClient'
import { ThemeProvider } from '@/shared/components/theme-provider'
import { PWAInstallProvider } from '@/shared/hooks/usePWAInstall'
import { analytics } from '@/shared/lib/analytics'
import { env } from '@/shared/lib/env'
import { initializeErrorTracking } from '@/shared/lib/error-tracking'
import { PostHogBoundary } from '@/shared/providers/PostHogBoundary'

import reportWebVitals from './reportWebVitals.ts'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Read version from package.json
const APP_VERSION = __APP_VERSION__ || 'dev'

// Create a new router instance
restoreAuthTokenFromStorage()
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Initialize global error tracking
initializeErrorTracking()

// Set release version for tracking
// This will be available after PostHog initializes
setTimeout(() => {
  analytics.setReleaseVersion(APP_VERSION)
}, 100)

// Check if PostHog is configured
const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
const isPostHogEnabled = POSTHOG_KEY && POSTHOG_KEY.length > 0

// Warn if PostHog is not configured in production
if (!isPostHogEnabled && import.meta.env.PROD) {
  console.warn('[PostHog] Analytics disabled: VITE_PUBLIC_POSTHOG_KEY not configured')
}

// Register service worker for PWA (deferred to not compete with LCP)
if ('serviceWorker' in navigator) {
  // Wait for page load, then defer another 3 seconds to ensure
  // critical resources are fully loaded before SW registration
  window.addEventListener('load', () => {
    const registerSW = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          if (import.meta.env.DEV) {
            console.log('[SW] Registered successfully:', registration.scope)
          }
        })
        .catch((error) => {
          console.warn('[SW] Registration failed:', error)
        })
    }

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(registerSW, { timeout: 5000 })
    } else {
      setTimeout(registerSW, 3000)
    }
  })
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)

  const AppContent = (
    <PWAInstallProvider>
      <ThemeProvider>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </HelmetProvider>
      </ThemeProvider>
    </PWAInstallProvider>
  )

  const posthogOptions = {
    api_host: env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    ui_host: 'https://eu.i.posthog.com',
    defaults: '2025-05-24',
    capture_exceptions: true,
    debug: import.meta.env.MODE === 'development',
    loaded: (posthog: PostHog | undefined) => {
      analytics.initialize(posthog ?? null)
      analytics.setReleaseVersion(APP_VERSION)

      if (import.meta.env.DEV) {
        console.log('[PostHog] Successfully initialized')
        console.log(
          '[PostHog] API Host:',
          env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
        )
      }
    },
    persistence: 'localStorage+cookie',
    autocapture: {
      dom_event_allowlist: [],
      capture_copied_text: true,
    },
  }

  root.render(
    <StrictMode>
      <PostHogBoundary
        enabled={Boolean(isPostHogEnabled)}
        apiKey={POSTHOG_KEY ?? ''}
        options={posthogOptions}
      >
        {AppContent}
      </PostHogBoundary>
    </StrictMode>,
  )
}

// Start measuring Web Vitals and sending to PostHog
// In development, also log to console for debugging
if (import.meta.env.DEV) {
  reportWebVitals((metric) => {
    console.log('[Web Vitals]', metric.name, metric.value, metric.rating)
  })
} else {
  reportWebVitals()
}
