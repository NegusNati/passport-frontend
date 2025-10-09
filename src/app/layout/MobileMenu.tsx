import { Link, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { useEffect } from 'react'

import { ThemeToggle } from '@/shared/components/theme-toggle'
import { Button } from '@/shared/ui/button'
import { toast } from '@/shared/ui/sonner'

type NavItem = { label: string; href: string; external?: boolean; comingSoonMessage?: string }

type AppPath = '/passports' | '/articles' | '/calendar'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  nav: readonly NavItem[]
  isAuthenticated: boolean
}

export function MobileMenu({ open, onClose, nav, isAuthenticated }: MobileMenuProps) {
  const navigate = useNavigate()

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const authButtonGroup = isAuthenticated ? (
    <Button
      variant="outline"
      className="flex-1 text-sm"
      onClick={() => {
        onClose()
        navigate({ to: '/profile' })
      }}
    >
      My profile
    </Button>
  ) : (
    <>
      <Button
        variant="outline"
        className="flex-1 text-sm"
        onClick={() => {
          onClose()
          navigate({ to: '/register' })
        }}
      >
        Register
      </Button>
      <Button
        className="flex-1 text-sm"
        onClick={() => {
          onClose()
          navigate({ to: '/login' })
        }}
      >
        Login
      </Button>
    </>
  )

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClose()
              }
            }}
            tabIndex={-1}
            role="button"
            aria-label="Close menu"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="bg-background absolute top-0 right-0 flex h-full w-full max-w-xs flex-col shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
          >
            <header className="border-border flex items-center justify-between border-b px-5 py-6">
              <span className="text-base font-semibold tracking-tight">Passport.ET</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>
            <nav className="flex flex-col gap-1 px-5 py-4">
              {nav.map((item) => {
                const className =
                  'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                const handleComingSoonClick = () => {
                  if (item.comingSoonMessage) {
                    toast('Under construction 🚧', {
                      description: item.comingSoonMessage,
                    })
                  }
                }

                if (item.external || item.href.startsWith('#')) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        handleComingSoonClick()
                        onClose()
                      }}
                      className={className}
                    >
                      <span>{item.label}</span>
                      {item.external ? (
                        <ArrowUpRight className="text-muted-foreground h-4 w-4" aria-hidden />
                      ) : null}
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.label}
                    to={item.href as AppPath}
                    preload="intent"
                    onClick={() => {
                      handleComingSoonClick()
                      onClose()
                    }}
                    className={className}
                  >
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="flex items-center gap-3 ">
                <ThemeToggle className="h-10 w-20" />
              </div>
            </nav>

            <div className="border-border mt-auto border-t px-5 py-6">
              <div className="flex items-center gap-3">{authButtonGroup}</div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default MobileMenu
