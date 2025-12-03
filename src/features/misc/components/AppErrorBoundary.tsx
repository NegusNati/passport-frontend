import { motion, useReducedMotion } from 'framer-motion'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { analytics } from '@/shared/lib/analytics'
import { Button } from '@/shared/ui/button'

type AppErrorFallbackProps = {
  error: Error | null
  reset?: () => void
  showDetails?: boolean
}

const FLOATING_ICONS = ['🧭', '🛫', '📘', '🛰️']

export function AppErrorFallback({ error, reset, showDetails }: AppErrorFallbackProps) {
  const { t, ready } = useTranslation('errors')
  const reducedMotion = useReducedMotion()

  // Fallback text if i18n is not ready
  const title = ready ? t('errorBoundary.title') : 'Something went off course'
  const description = ready
    ? t('errorBoundary.description')
    : 'Try refreshing, or head back home while we fix the issue.'
  const goHomeText = ready ? t('errorBoundary.goHome') : 'Go home'
  const tryAgainText = ready ? t('errorBoundary.tryAgain') : 'Try again'

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-10 h-44 w-44">
        {FLOATING_ICONS.map((icon, index) => (
          <motion.span
            key={icon}
            className="absolute top-1/2 left-1/2 text-3xl"
            style={{ transform: `translate(-50%, -50%)` }}
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [0, -14, 0],
                    rotate: [0, index % 2 === 0 ? 6 : -6, 0],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: 3.6,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
          >
            {icon}
          </motion.span>
        ))}
        <motion.div
          className="border-primary/40 bg-primary/10 absolute inset-6 rounded-full border"
          animate={reducedMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
        />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm sm:text-base">{description}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <a href="/">{goHomeText}</a>
        </Button>
        {reset ? (
          <Button variant="outline" onClick={reset}>
            {tryAgainText}
          </Button>
        ) : null}
      </div>

      {showDetails && error ? (
        <pre className="text-muted-foreground/70 bg-muted/40 mt-6 max-w-2xl overflow-auto rounded-md p-4 text-left text-xs">
          {error.message}
        </pre>
      ) : null}
    </div>
  )
}

type AppErrorBoundaryProps = {
  children: ReactNode
  development?: boolean
}

type AppErrorBoundaryState = {
  error: Error | null
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Capture error in PostHog with deduplication via stack hash
    const stackHash = this.generateStackHash(error)
    const currentRoute = window.location.pathname

    analytics.capture('frontend_error', {
      type: error.name || 'Error',
      message: error.message,
      'stack-hash': stackHash,
      route: currentRoute,
      'component-stack': info.componentStack?.slice(0, 500) || '', // Truncate long stacks
      'error-boundary': 'AppErrorBoundary',
    })

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('AppErrorBoundary caught an error', error, info)
    }
  }

  private generateStackHash(error: Error): string {
    // Simple hash for deduplication - use first line of stack
    const stackLine = error.stack?.split('\n')[1] || error.message
    let hash = 0
    for (let i = 0; i < stackLine.length; i++) {
      const char = stackLine.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return `err_${Math.abs(hash).toString(36)}`
  }

  resetErrorBoundary = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, development = import.meta.env.DEV } = this.props

    if (error) {
      return (
        <AppErrorFallback error={error} reset={this.resetErrorBoundary} showDetails={development} />
      )
    }

    return children
  }
}
