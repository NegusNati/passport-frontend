import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const reduceMotion = useReducedMotion()
  React.useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

  if (!mounted) {
    return (
      <span
        className={[
          'border-input bg-muted/60 relative inline-flex h-10 w-16 items-center rounded-full border p-1',
          className,
        ].join(' ')}
      >
        <span
          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/40 to-orange-200/30"
          aria-hidden
        />
        <span className="bg-background relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full shadow">
          <Sun className="h-4 w-4" aria-hidden />
        </span>
      </span>
    )
  }

  return (
    <motion.button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={[
        'border-input bg-muted/60 text-foreground relative inline-flex h-10 w-16 items-center rounded-full border p-1',
        'focus-visible:ring-ring ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      ].join(' ')}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      animate={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(59,130,246,0.28) 0%, rgba(29,78,216,0.28) 100%)'
          : 'linear-gradient(135deg, rgba(253,224,71,0.3) 0%, rgba(251,191,36,0.2) 100%)',
      }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut' }}
    >
      <motion.span
        layout
        className="bg-background relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
        animate={{ x: isDark ? 24 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }
        }
      >
        <AnimatePresence initial={false} mode="wait">
          {isDark ? (
            <motion.span
              key="sun-icon"
              initial={{ rotate: -50, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 45, scale: 0.5, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' }}
              className="flex"
            >
              <Sun className="h-4 w-4 text-amber-400" aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="moon-icon"
              initial={{ rotate: 50, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -45, scale: 0.5, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' }}
              className="flex"
            >
              <Moon className="h-4 w-4 text-slate-600" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  )
}

export default ThemeToggle
