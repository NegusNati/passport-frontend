import React from 'react'
import { Container } from '@/shared/ui/container'
import { Button } from '@/shared/ui/button'
import { MobileMenu } from './MobileMenu'
import { ArrowUpRight } from 'lucide-react'
import { ThemeToggle } from '@/shared/components/theme-toggle'

const nav = [
  { label: 'Advertise', href: '#advertise' },
  { label: 'Passports', href: '/passports' },
  { label: 'Articles', href: '/articles' },
  { label: 'Ethiopian Calendar', href: '/calendar' },
  { label: 'Download App', href: '#download', external: true },
]

export function Header() {
  const [open, setOpen] = React.useState(false)
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 sm:bg-background/80 sm:backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-semibold tracking-tight text-foreground">
            Passport.ET
          </a>
          <span className="sr-only">Go to homepage</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>{item.label}</span>
              {item.external ? <ArrowUpRight className="h-4 w-4" aria-hidden /> : null}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="outline"className='font-bold px-4 py-0' >Register</Button>
          <Button>Login</Button>
        </div>

        <button aria-label="Open menu" className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-foreground" onClick={() => setOpen(true)}>
          <div className="i-[menu] size-5">
            <span className="sr-only">Open menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </div>
        </button>
      </Container>
      <MobileMenu open={open} onClose={() => setOpen(false)} nav={nav} />
    </header>
  )
}

export default Header
