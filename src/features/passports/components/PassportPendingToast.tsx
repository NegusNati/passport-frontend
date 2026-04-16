import { motion, useReducedMotion } from 'framer-motion'
import { Clock3, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

type PassportPendingToastProps = {
  eyebrow: string
  title: string
  description?: string
  dismissText: string
  dismissLabel: string
  onDismiss: () => void
  className?: string
}

export function PassportPendingToast({
  eyebrow,
  title,
  description,
  dismissText,
  dismissLabel,
  onDismiss,
  className,
}: PassportPendingToastProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'bg-background/96 supports-[backdrop-filter]:bg-background/84 relative w-[min(calc(100vw-1rem),30rem)] overflow-hidden rounded-[1.45rem] border border-amber-200/75 shadow-[0_24px_60px_-34px_rgba(217,119,6,0.42)] backdrop-blur-xl',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            'linear-gradient(132deg, rgba(245,158,11,0.14) 0%, rgba(245,158,11,0.05) 38%, rgba(255,255,255,0) 100%)',
        }}
      />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-400/90" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-12 right-[-2.75rem] h-28 w-28 rounded-full bg-amber-200/45 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-200/85 bg-amber-50/95 text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
          aria-hidden="true"
        >
          <Clock3 className="h-5 w-5" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 3 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.03, duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-full border border-amber-200/80 bg-amber-50/95 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-amber-800 uppercase sm:text-[11px]"
            >
              {eyebrow}
            </motion.p>
            <div className="hidden h-px min-w-8 flex-1 bg-amber-200/70 sm:block" />
          </div>

          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.07, duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="text-foreground mt-3 max-w-[30ch] text-[1rem] leading-[1.14] font-semibold text-balance sm:text-[1.12rem]"
          >
            {title}
          </motion.p>

          {description ? (
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.11, duration: 0.17, ease: [0.23, 1, 0.32, 1] }}
              className="text-muted-foreground mt-2 max-w-[46ch] text-sm leading-6"
            >
              {description}
            </motion.p>
          ) : null}

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="mt-3 sm:mt-4"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-9 rounded-full border border-amber-200/80 bg-amber-50/75 px-3 text-sm font-medium text-amber-900 transition-[transform,background-color,border-color,color] duration-150 ease-out hover:border-amber-300 hover:bg-amber-100/80"
            >
              {dismissText}
            </Button>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent transition-[color,background-color,border-color,transform] duration-150 ease-out hover:border-amber-200 hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
