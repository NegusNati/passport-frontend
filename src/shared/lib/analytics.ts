import { usePostHog } from 'posthog-js/react'
import type { PostHog } from 'posthog-js'

// Event naming convention: snake_case (e.g., 'passport_status_search_started')
// Property naming convention: kebab-case (e.g., 'country-code', 'result-type')
// Use ISO timestamps and enumerated values for consistency

type EventProperties = Record<string, string | number | boolean | null | undefined>

// Feature flag names enum for type safety
export enum FeatureFlag {
  GUIDANCE_WIZARD = 'feature:guidance-wizard',
  ADVANCED_SEARCH = 'feature:advanced-search',
  LOCATION_ALERTS = 'feature:location-alerts',
}

// Core analytics helper class
class Analytics {
  private posthog: PostHog | null = null
  private isEnabled = true

  initialize(posthog: PostHog | null) {
    this.posthog = posthog
    this.isEnabled = !!posthog
  }

  private getPostHog(): PostHog | null {
    if (!this.isEnabled || !this.posthog) {
      if (import.meta.env.DEV) {
        console.warn('[Analytics] PostHog not available')
      }
      return null
    }
    return this.posthog
  }

  /**
   * Capture a custom event with optional properties
   * @param event - Event name in snake_case (e.g., 'passport_status_search_started')
   * @param properties - Event properties with kebab-case keys
   */
  capture(event: string, properties?: EventProperties): void {
    const ph = this.getPostHog()
    if (!ph) return

    // Add environment and version metadata
    const enrichedProperties = {
      ...properties,
      $process: import.meta.env.MODE, // 'development', 'production', etc.
      timestamp: new Date().toISOString(),
    }

    ph.capture(event, enrichedProperties)

    if (import.meta.env.DEV) {
      console.log('[Analytics] Event captured:', event, enrichedProperties)
    }
  }

  /**
   * Capture a page view event
   * @param routeName - Canonical route name (e.g., '/status', '/locations/[slug]')
   * @param properties - Additional properties
   */
  capturePageview(routeName: string, properties?: EventProperties): void {
    this.capture('$pageview', {
      'route-name': routeName,
      ...properties,
    })
  }

  /**
   * Identify a user with properties
   * @param userId - Unique user identifier
   * @param properties - User properties (account_type, preferred_language, etc.)
   */
  identify(userId: string, properties?: EventProperties): void {
    const ph = this.getPostHog()
    if (!ph) return

    ph.identify(userId, properties)

    if (import.meta.env.DEV) {
      console.log('[Analytics] User identified:', userId, properties)
    }
  }

  /**
   * Associate user with a group (e.g., release version, organization)
   * @param groupType - Type of group (e.g., 'release', 'organization')
   * @param groupKey - Unique key for the group
   * @param properties - Group properties
   */
  group(groupType: string, groupKey: string, properties?: EventProperties): void {
    const ph = this.getPostHog()
    if (!ph) return

    ph.group(groupType, groupKey, properties)

    if (import.meta.env.DEV) {
      console.log('[Analytics] Group set:', groupType, groupKey, properties)
    }
  }

  /**
   * Check if a feature flag is enabled
   * @param flag - Feature flag name (use FeatureFlag enum)
   * @param defaultValue - Default value if flag is not available
   */
  isFeatureEnabled(flag: FeatureFlag | string, defaultValue = false): boolean {
    const ph = this.getPostHog()
    if (!ph) return defaultValue

    const value = ph.isFeatureEnabled(flag)
    return value ?? defaultValue
  }

  /**
   * Get feature flag value with type safety
   * @param flag - Feature flag name
   */
  getFeatureFlag(flag: FeatureFlag | string): string | boolean | undefined {
    const ph = this.getPostHog()
    if (!ph) return undefined

    return ph.getFeatureFlag(flag)
  }

  /**
   * Get all active feature flags
   */
  getFeatureFlags(): Record<string, string | boolean> | undefined {
    const ph = this.getPostHog()
    if (!ph) return undefined

    return ph.getFeatureFlags() as Record<string, string | boolean> | undefined
  }

  /**
   * Reset user identity (call on logout)
   */
  reset(): void {
    const ph = this.getPostHog()
    if (!ph) return

    ph.reset()

    if (import.meta.env.DEV) {
      console.log('[Analytics] User identity reset')
    }
  }

  /**
   * Opt user out of tracking
   */
  optOut(): void {
    const ph = this.getPostHog()
    if (!ph) return

    ph.opt_out_capturing()
    this.isEnabled = false

    if (import.meta.env.DEV) {
      console.log('[Analytics] User opted out')
    }
  }

  /**
   * Opt user back in to tracking
   */
  optIn(): void {
    const ph = this.getPostHog()
    if (!ph) return

    ph.opt_in_capturing()
    this.isEnabled = true

    if (import.meta.env.DEV) {
      console.log('[Analytics] User opted in')
    }
  }

  /**
   * Set person properties without sending an event
   * @param properties - Person properties to set
   */
  setPersonProperties(properties: EventProperties): void {
    const ph = this.getPostHog()
    if (!ph) return

    ph.setPersonProperties(properties)

    if (import.meta.env.DEV) {
      console.log('[Analytics] Person properties set:', properties)
    }
  }

  /**
   * Track release version
   * @param version - Version string (e.g., from package.json)
   */
  setReleaseVersion(version: string): void {
    this.group('release', version, { version })
  }
}

// Singleton instance
export const analytics = new Analytics()

/**
 * React hook to access PostHog instance
 * Initializes the analytics singleton if not already done
 */
export function useAnalytics() {
  const posthog = usePostHog()

  // Initialize analytics singleton on first use
  if (posthog && !analytics['posthog']) {
    analytics.initialize(posthog)
  }

  return {
    capture: analytics.capture.bind(analytics),
    capturePageview: analytics.capturePageview.bind(analytics),
    identify: analytics.identify.bind(analytics),
    group: analytics.group.bind(analytics),
    isFeatureEnabled: analytics.isFeatureEnabled.bind(analytics),
    getFeatureFlag: analytics.getFeatureFlag.bind(analytics),
    getFeatureFlags: analytics.getFeatureFlags.bind(analytics),
    reset: analytics.reset.bind(analytics),
    optOut: analytics.optOut.bind(analytics),
    optIn: analytics.optIn.bind(analytics),
    setPersonProperties: analytics.setPersonProperties.bind(analytics),
    setReleaseVersion: analytics.setReleaseVersion.bind(analytics),
  }
}

// Convenience function for non-React contexts
export function initializeAnalytics(posthog: PostHog | null) {
  analytics.initialize(posthog)
}

// Export for direct use in error boundaries and other non-hook contexts
export { analytics as default }
