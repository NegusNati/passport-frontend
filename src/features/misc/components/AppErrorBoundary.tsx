import { motion, useReducedMotion } from 'framer-motion'
import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button } from '@/shared/ui/button'

type AppErrorFallbackProps = {
  error: Error | null
  reset?: () => void
  showDetails?: boolean
}

const FLOATING_ICONS = ['🧭', '🛫', '📘', '🛰️']

export function AppErrorFallback({ error, reset, showDetails }: AppErrorFallbackProps) {
  const reducedMotion = useReducedMotion()

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

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Something went off course
      </h1>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm sm:text-base">
        Our passport pigeons are on the case. Try refreshing, or head back home while we realign the
        navigation.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <a href="/">Go home</a>
        </Button>
        {reset ? (
          <Button variant="outline" onClick={reset}>
            Try again
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
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('AppErrorBoundary caught an error', error, info)
    }
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
