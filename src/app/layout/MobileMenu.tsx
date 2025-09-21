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
          <div className="absolute inset-0 bg-black/20" onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-xs flex-col border-l border-neutral-200 bg-white"
          >
            <header className="flex items-center justify-between px-5 py-6">
              <span className="text-base font-semibold tracking-tight">Passport.ET</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <nav className="flex flex-col gap-2 px-5">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
                >
                  <span>{item.label}</span>
                  {item.external ? <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" /> : null}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 px-5 py-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="w-full text-sm">
                  Register
                </Button>
                <Button className="w-full text-sm">
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
