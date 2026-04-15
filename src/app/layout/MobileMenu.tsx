import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ThemeToggle } from '@/shared/components/theme-toggle'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet'
import { toast } from '@/shared/ui/sonner'

type NavItem = { label: string; href: string; external?: boolean; comingSoonMessage?: string }

type AppPath = '/passports' | '/articles' | '/calendar' | '/locations'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  nav: readonly NavItem[]
  isAuthenticated: boolean
}

export function MobileMenu({ open, onClose, nav, isAuthenticated }: MobileMenuProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (!open || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        onClose()
      }
    }

    handleViewportChange(mediaQuery)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleViewportChange)
      return () => mediaQuery.removeEventListener('change', handleViewportChange)
    }

    mediaQuery.addListener(handleViewportChange)
    return () => mediaQuery.removeListener(handleViewportChange)
  }, [onClose, open])

  // Memoized navigation handlers
  const handleProfileClick = useCallback(() => {
    onClose()
    navigate({ to: '/profile' })
  }, [onClose, navigate])

  const handleRegisterClick = useCallback(() => {
    onClose()
    navigate({ to: '/register' })
  }, [onClose, navigate])

  const handleLoginClick = useCallback(() => {
    onClose()
    navigate({ to: '/login' })
  }, [onClose, navigate])

  const authButtonGroup = useMemo(
    () =>
      isAuthenticated ? (
        <Button variant="outline" className="flex-1 text-sm" onClick={handleProfileClick}>
          {t('nav.myProfile')}
        </Button>
      ) : (
        <>
          <Button variant="outline" className="flex-1 text-sm" onClick={handleRegisterClick}>
            {t('nav.register')}
          </Button>
          <Button className="flex-1 text-sm" onClick={handleLoginClick}>
            {t('nav.login')}
          </Button>
        </>
      ),
    [isAuthenticated, handleProfileClick, handleRegisterClick, handleLoginClick, t],
  )

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <SheetContent side="right" className="flex h-full w-full max-w-xs flex-col p-0 md:hidden">
        <SheetHeader className="border-border border-b px-5 py-6 text-left">
          <SheetTitle>Passport.ET</SheetTitle>
          <SheetDescription className="sr-only">
            {t('nav.passports')} navigation and account actions.
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-5 py-4">
          {nav.map((item) => {
            const className =
              'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex min-h-11 items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            const handleComingSoonClick = () => {
              if (item.comingSoonMessage) {
                toast(t('underConstruction'), {
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

          <div className="mt-2 flex items-center justify-between rounded-lg px-3 py-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="border-border mt-auto border-t px-5 py-6">
          <div className="flex items-center gap-3">{authButtonGroup}</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
