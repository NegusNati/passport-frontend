import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { ArrowUpRight, X } from 'lucide-react'

type NavItem = { label: string; href: string; external?: boolean }

export function MobileMenu({ open, onClose, nav }: { open: boolean; onClose: () => void; nav: NavItem[] }) {
  React.useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
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
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="absolute right-0 top-0 flex h-full w-full flex-col bg-white"
          >
            <header className="flex items-center justify-between px-5 py-6 border-b border-neutral-100">
              <span className="text-lg font-semibold tracking-tight">Passport.ET</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <nav className="flex flex-col gap-1 px-5 py-4">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 border-b border-neutral-100 last:border-b-0"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                </a>
              ))}
            </nav>

            <div className="mt-auto border-t border-neutral-100 px-5 py-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex-1 h-11 text-sm font-medium">
                  Register
                </Button>
                <Button className="flex-1 h-11 text-sm font-medium bg-neutral-900 hover:bg-neutral-800">
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
