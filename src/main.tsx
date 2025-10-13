import './styles.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { PostHogProvider } from 'posthog-js/react'

import { restoreAuthTokenFromStorage } from '@/api/client'
import { queryClient } from '@/api/queryClient'
import { ThemeProvider } from '@/shared/components/theme-provider'
import analytics from '@/shared/lib/analytics'
import { env } from '@/shared/lib/env'
import { initializeErrorTracking } from '@/shared/lib/error-tracking'

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
const POSTHOG_KEY = env.VITE_PUBLIC_POSTHOG_KEY
const isPostHogEnabled = POSTHOG_KEY && POSTHOG_KEY.length > 0

// Warn if PostHog is not configured in production
if (!isPostHogEnabled && import.meta.env.PROD) {
  console.warn('[PostHog] Analytics disabled: VITE_PUBLIC_POSTHOG_KEY not configured')
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  
  const AppContent = (
    <ThemeProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  )

  root.render(
    <StrictMode>
      {isPostHogEnabled ? (
        <PostHogProvider
          apiKey={POSTHOG_KEY}
          options={{
            api_host: env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
            ui_host: 'https://eu.i.posthog.com',
            defaults: '2025-05-24',
            capture_exceptions: true,
            debug: import.meta.env.MODE === 'development',
            loaded: (posthog) => {
              analytics.initialize(posthog)
              analytics.setReleaseVersion(APP_VERSION)
              
              if (import.meta.env.DEV) {
                console.log('[PostHog] Successfully initialized')
                console.log('[PostHog] API Host:', env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com')
              }
            },
            persistence: 'localStorage+cookie',
            autocapture: true,
          }}
        >
          {AppContent}
        </PostHogProvider>
      ) : (
        AppContent
      )}
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
