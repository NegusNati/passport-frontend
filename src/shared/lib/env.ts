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
  VITE_HORIZON_URL: z.string().url().optional(),
  VITE_PUBLIC_POSTHOG_KEY: z.string().optional(), // Optional to allow graceful degradation
  VITE_PUBLIC_POSTHOG_HOST: z.string().optional(), // Can be relative path or URL
})

type Env = z.infer<typeof EnvSchema>

function inferApiBaseUrl(env: Partial<Env>): string {
  // Allow explicit override via environment variable
  if (env.VITE_API_BASE_URL) return env.VITE_API_BASE_URL

  // Mode-based defaults: dev uses app.localhost, production uses passport.et
  return import.meta.env.DEV ? 'http://app.localhost' : 'https://api.passport.et'
}

export const env = (() => {
  const parsed = EnvSchema.safeParse(import.meta.env)
  const values: Partial<Env> = parsed.success ? parsed.data : {}
  const apiBase = inferApiBaseUrl(values)
  const horizonUrl = values.VITE_HORIZON_URL ?? `${apiBase.replace(/\/$/, '')}/horizon`
  return {
    ...values,
    VITE_PUBLIC_POSTHOG_KEY: values.VITE_PUBLIC_POSTHOG_KEY ?? '',
    API_BASE_URL: apiBase,
    HORIZON_URL: horizonUrl,
  } as Env & { API_BASE_URL: string; HORIZON_URL: string }
})()

export type { Env }
