import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getAuthToken } from '@/api/client'
import { authKeys } from '@/features/auth/api'
import { useAuthUser } from '@/features/auth/hooks'
import type { User } from '@/features/auth/schemas/user'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { usePWAInstall } from '@/shared/hooks/usePWAInstall'
import { useAnalytics } from '@/shared/lib/analytics'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { InstallInstructionsDialog } from '@/shared/ui/InstallInstructionsDialog'
import { toast } from '@/shared/ui/sonner'

import { MobileMenu } from './MobileMenu'

type NavItem = {
  label: string
  href: string
  external?: boolean
  comingSoonMessage?: string
}

// Supported internal paths used in header navigation
type AppPath = '/passports' | '/articles' | '/calendar' | '/locations'

// Nav items defined as keys; labels resolved via useTranslation in component
const navKeys = [
  { labelKey: 'nav.passports', href: '/passports' },
  { labelKey: 'nav.articles', href: '/articles' },
  { labelKey: 'nav.advertise', href: '/advertisment' },
  { labelKey: 'nav.locations', href: '/locations' },
] as const

function renderNavItem(item: NavItem, customOnClick?: () => void, underConstructionLabel?: string) {
  const className =
    'text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-semibold transition-colors'

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (customOnClick) {
      e.preventDefault()
      customOnClick()
    } else if (item.comingSoonMessage && underConstructionLabel) {
      toast(underConstructionLabel, {
        description: item.comingSoonMessage,
      })
    }
  }

  if (item.external || item.href.startsWith('#')) {
    return (
      <a key={item.label} href={item.href} className={className} onClick={handleClick}>
        <span>{item.label}</span>
        {item.external ? <ArrowUpRight className="h-4 w-4" aria-hidden /> : null}
      </a>
    )
  }

  return (
    <Link
      key={item.label}
      to={item.href as AppPath}
      preload="intent"
      className={className}
      onClick={handleClick}
    >
      <span>{item.label}</span>
    </Link>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [showIOSDialog, setShowIOSDialog] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { canInstall, isStandalone, platform, promptInstall } = usePWAInstall()
  const { capture } = useAnalytics()
  const { t } = useTranslation()

  // Build nav with translated labels
  const nav: ReadonlyArray<NavItem> = navKeys.map((item) => ({
    label: t(item.labelKey),
    href: item.href,
  }))
  const underConstructionLabel = t('underConstruction')

  const cachedUser = queryClient.getQueryData(authKeys.user()) as User | undefined
  const token = getAuthToken()

  const { data: fetchedUser } = useAuthUser({
    enabled: Boolean(token),
    initialData: cachedUser,
    placeholderData: () => cachedUser,
    retry: false,
  })

  const user = fetchedUser ?? cachedUser ?? null
  const isAuthenticated = Boolean(user)

  // Memoized navigation handlers to prevent re-renders
  const handleNavigateToProfile = useCallback(() => {
    navigate({ to: '/profile' })
  }, [navigate])

  // const handleNavigateToRegister = useCallback(() => {
  //   navigate({ to: '/register' })
  // }, [navigate])

  const handleNavigateToLogin = useCallback(() => {
    navigate({ to: '/login' })
  }, [navigate])

  const handleOpenMobileMenu = useCallback(() => {
    setOpen(true)
  }, [])

  const handleCloseMobileMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const handleDownloadAppClick = useCallback(async () => {
    // Defer analytics to not block the interaction
    queueMicrotask(() => {
      capture('pwa_install_attempt', {
        source: 'header-nav',
        platform,
        'can-install': canInstall,
        'is-standalone': isStandalone,
      })
    })

    if (isStandalone) {
      toast(t('pwa.alreadyInstalled'), {
        description: t('pwa.alreadyInstalledDesc'),
      })
      return
    }

    if (canInstall) {
      const result = await promptInstall()
      if (result === 'accepted') {
        toast(t('pwa.appInstalled'), {
          description: t('pwa.appInstalledDesc'),
        })
      } else if (result === 'dismissed') {
        toast(t('pwa.installCancelled'), {
          description: t('pwa.installCancelledDesc'),
        })
      }
      return
    }

    if (platform === 'ios') {
      queueMicrotask(() => {
        capture('pwa_install_ios_instructions_shown', { source: 'header-nav' })
      })
      setShowIOSDialog(true)
      return
    }

    toast(t('pwa.installNotAvailable'), {
      description: t('pwa.installNotAvailableDesc'),
    })
  }, [capture, platform, canInstall, isStandalone, promptInstall, t])

  return (
    <header className="border-border bg-background/95 sm:bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b sm:backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" preload="intent" className="text-foreground font-semibold tracking-tight">
            Passport.ET
          </Link>
          <span className="sr-only">Go to homepage</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) =>
            item.label === 'Download App'
              ? renderNavItem(item, handleDownloadAppClick, underConstructionLabel)
              : renderNavItem(item, undefined, underConstructionLabel),
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div>
            <LanguageSwitcher className="text-sm" />
          </div>
          <ThemeToggle />
          {isAuthenticated ? (
            <Button
              variant="outline"
              className="px-4 py-0 font-bold"
              onClick={handleNavigateToProfile}
            >
              {t('nav.myProfile')}
            </Button>
          ) : (
            <Button onClick={handleNavigateToLogin}>{t('nav.login')}</Button>
          )}
        </div>

        {/* Mobile: Language switcher + hamburger menu */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher compact />
          <button
            aria-label="Open menu"
            className="border-input bg-background text-foreground inline-flex h-10 w-10 items-center justify-center rounded-md border"
            onClick={handleOpenMobileMenu}
          >
            <div className="i-[menu] size-5">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-5"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </div>
          </button>
        </div>
      </Container>
      <MobileMenu
        open={open}
        onClose={handleCloseMobileMenu}
        nav={nav}
        isAuthenticated={isAuthenticated}
      />
      <InstallInstructionsDialog
        open={showIOSDialog}
        onOpenChange={setShowIOSDialog}
        platform={platform}
      />
    </header>
  )
}

export default Header
