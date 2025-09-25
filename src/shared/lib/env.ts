import { z } from 'zod'

// Typed access to environment with sensible fallbacks
// Base URL rules:
// - Dev: http://app.localhost
// - Prod: https://passport.et
// You can override via VITE_API_BASE_URL when needed.

const EnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url().optional(),
  VITE_SITE_URL: z.string().url().optional(),
  VITE_SITE_NAME: z.string().optional(),
})

type Env = z.infer<typeof EnvSchema>

function inferApiBaseUrl(env: Partial<Env>): string {
  const fromVar = env.VITE_API_BASE_URL
  if (fromVar) return fromVar

  // Infer from host when running in the browser
  if (typeof window !== 'undefined') {
    const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname)
    const protocol = isLocal ? 'http:' : 'https:'
    const host = isLocal ? 'app.localhost' : 'passport.et'
    return `${protocol}//${host}`
  }

  // Fallback in SSR/build contexts
  return 'https://passport.et'
}

export const env = (() => {
  const parsed = EnvSchema.safeParse(import.meta.env)
  const values: Env = parsed.success ? parsed.data : {}
  return {
    ...values,
    API_BASE_URL: inferApiBaseUrl(values),
  }
})()

export type { Env }
