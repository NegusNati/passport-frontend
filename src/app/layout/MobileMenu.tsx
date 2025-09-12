import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/ui/button'

type NavItem = { label: string; href: string }

export function MobileMenu({ open, onClose, nav }: { open: boolean; onClose: () => void; nav: NavItem[] }) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <span className="font-semibold">Passport.ET</span>
              <button aria-label="Close menu" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="M6 6l12 12M18 6l-12 12"/></svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {nav.map((n) => (
                <a key={n.label} href={n.href} className="rounded-md px-3 py-2 text-base hover:bg-neutral-100">
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto flex items-center gap-2 p-4">
              <Button variant="outline" className="w-full">Register</Button>
              <Button className="w-full">Login</Button>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default MobileMenu

