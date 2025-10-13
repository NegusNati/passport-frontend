import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

import { getAuthToken } from '@/api/client'
import { authKeys } from '@/features/auth/api'
import { useAuthUser } from '@/features/auth/hooks'
import type { User } from '@/features/auth/schemas/user'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
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

const nav: ReadonlyArray<NavItem> = [
  { label: 'Advertise', href: '#advertise' },
  { label: 'Passports', href: '/passports' },
  { label: 'Articles', href: '/articles' },
  { label: 'Ethiopian Calendar', href: '/calendar' },
  { label: 'Official ICS branch offices', href: '/locations' },
  {
    label: 'Download App',
    href: '#download',
    external: true,
    comingSoonMessage: 'Native mobile apps are under construction. Stay tuned for the launch!',
  },
]

function renderNavItem(item: NavItem) {
  const className =
    'text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-semibold transition-colors'

  const handleComingSoonClick = () => {
    if (item.comingSoonMessage) {
      toast('Under construction 🚧', {
        description: item.comingSoonMessage,
      })
    }
  }

  if (item.external || item.href.startsWith('#')) {
    return (
      <a key={item.label} href={item.href} className={className} onClick={handleComingSoonClick}>
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
      onClick={handleComingSoonClick}
    >
      <span>{item.label}</span>
    </Link>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  return (
    <header className="border-border bg-background/95 sm:bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b sm:backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" preload="intent" className="text-foreground font-semibold tracking-tight">
            Passport.ET
          </Link>
          <span className="sr-only">Go to homepage</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">{nav.map(renderNavItem)}</nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button
              variant="outline"
              className="px-4 py-0 font-bold"
              onClick={() => navigate({ to: '/profile' })}
            >
              My profile
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="px-4 py-0 font-bold"
                onClick={() => navigate({ to: '/register' })}
              >
                Register
              </Button>
              <Button onClick={() => navigate({ to: '/login' })}>Login</Button>
            </>
          )}
        </div>

        <button
          aria-label="Open menu"
          className="border-input bg-background text-foreground inline-flex h-10 w-10 items-center justify-center rounded-md border md:hidden"
          onClick={() => setOpen(true)}
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
      </Container>
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        nav={nav}
        isAuthenticated={isAuthenticated}
      />
    </header>
  )
}

export default Header
