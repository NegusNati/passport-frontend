import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { ArrowUpRight, X } from 'lucide-react'

type NavItem = { label: string; href: string; external?: boolean }

export function MobileMenu({ open, onClose, nav }: { open: boolean; onClose: () => void; nav: NavItem[] }) {
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col bg-background shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-6">
              <span className="text-base font-semibold tracking-tight">Passport.ET</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <nav className="flex flex-col gap-1 px-5 py-4">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span>{item.label}</span>
                  {item.external ? <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden /> : null}
                </a>
              ))}
            </nav>

            <div className="mt-auto border-t border-border px-5 py-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex-1 text-sm">
                  Register
                </Button>
                <Button className="flex-1 text-sm">
                  Login
                </Button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default MobileMenu
