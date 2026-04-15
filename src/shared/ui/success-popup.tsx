import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

import { Button } from './button'

type SuccessPopupProps = {
  open: boolean
  contextLabel: string
  title: string
  description?: string
  actionLabel?: string
  dismissText?: string
  dismissLabel?: string
  onAction?: () => void
  onDismiss: () => void
  durationMs?: number
  className?: string
}

export function SuccessPopup({
  open,
  contextLabel,
  title,
  description,
  actionLabel,
  dismissText = 'Keep browsing',
  dismissLabel = 'Dismiss message',
  onAction,
  onDismiss,
  durationMs,
  className,
}: SuccessPopupProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-x-3 top-18 z-[60] flex justify-center sm:inset-x-6 sm:top-22">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="success-popup"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.985 }}
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
            }
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -22, scale: 0.985 }}
            transition={{
              duration: prefersReducedMotion ? 0.12 : 0.3,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={cn(
              'bg-background/94 supports-[backdrop-filter]:bg-background/80 pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-emerald-300/70 shadow-[0_28px_65px_-34px_rgba(5,150,105,0.48)] backdrop-blur-xl',
              className,
            )}
          >
            <div
              className="pointer-events-none absolute -top-16 right-[-3.5rem] h-36 w-36 rounded-full bg-emerald-200/60 blur-2xl"
              aria-hidden="true"
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 left-[-3rem] h-28 w-28 rounded-full bg-emerald-300/45 blur-2xl"
              animate={prefersReducedMotion ? undefined : { x: [0, 6, 0], y: [0, -4, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
              className="absolute inset-0 opacity-90"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(130deg, rgba(5,150,105,0.16) 0%, rgba(5,150,105,0.06) 42%, rgba(255,255,255,0) 100%)',
              }}
            />
            <div className="absolute inset-y-0 left-0 w-1.5 bg-emerald-500/85" aria-hidden="true" />

            <div className="relative flex items-start gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.92 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ delay: 0.04, duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/85 bg-emerald-100/90 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                aria-hidden="true"
              >
                <CheckCircle2 className="h-5 w-5" />
              </motion.div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <motion.p
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    className="rounded-full border border-emerald-200/80 bg-emerald-50/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-800 uppercase sm:text-[11px]"
                  >
                    {contextLabel}
                  </motion.p>
                  <div className="hidden h-px min-w-10 flex-1 bg-emerald-200/70 sm:block" />
                </div>

                <motion.p
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 5 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.09, duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="text-foreground mt-3 max-w-[32ch] text-[1.02rem] leading-[1.12] font-semibold text-balance sm:text-[1.22rem]"
                >
                  {title}
                </motion.p>

                {description ? (
                  <motion.p
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.17, ease: [0.23, 1, 0.32, 1] }}
                    className="text-muted-foreground mt-2 max-w-[54ch] text-sm leading-6 sm:text-[0.95rem]"
                  >
                    {description}
                  </motion.p>
                ) : null}

                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 5 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4"
                >
                  {actionLabel && onAction ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onAction}
                      className="h-9 rounded-full bg-emerald-600 px-3.5 text-sm font-semibold text-white shadow-[0_12px_26px_-16px_rgba(5,150,105,0.75)] transition-[transform,background-color,box-shadow] duration-150 ease-out hover:bg-emerald-700 active:scale-[0.97]"
                      rightIcon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                    >
                      {actionLabel}
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismiss}
                    className="h-9 rounded-full px-3 text-sm font-medium text-emerald-800 transition-[transform,background-color,color] duration-150 ease-out hover:bg-emerald-50 active:scale-[0.97]"
                  >
                    {dismissText}
                  </Button>
                </motion.div>
              </div>

              <button
                type="button"
                onClick={onDismiss}
                aria-label={dismissLabel}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent transition-[color,background-color,border-color,transform] duration-150 ease-out hover:border-emerald-200 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {durationMs && !prefersReducedMotion ? (
              <div
                className="bg-emerald-100/80 absolute inset-x-0 bottom-0 h-[2.5px] overflow-hidden"
                aria-hidden="true"
              >
                <motion.div
                  className="h-full origin-left bg-emerald-500/80"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: durationMs / 1000, ease: 'linear' }}
                />
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
