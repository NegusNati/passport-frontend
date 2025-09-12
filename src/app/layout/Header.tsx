import React from 'react'
import { Container } from '@/shared/ui/container'
import { Button } from '@/shared/ui/button'
import { MobileMenu } from './MobileMenu'

const nav = [
  { label: 'Advertise', href: '#advertise' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Ethiopian Calendar', href: '#calendar' },
  { label: 'Download App', href: '#download' },
]

export function Header() {
  const [open, setOpen] = React.useState(false)
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-semibold tracking-tight text-neutral-900">
            Passport.ET
          </a>
          <span className="sr-only">Go to homepage</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="text-sm text-neutral-700 hover:text-neutral-900">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline">Register</Button>
          <Button>Login</Button>
        </div>

        <button aria-label="Open menu" className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300" onClick={() => setOpen(true)}>
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

