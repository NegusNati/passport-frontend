import { Link, useRouterState } from '@tanstack/react-router'
import {
  FileText,
  Home,
  ImageIcon,
  Megaphone,
  Newspaper,
  UploadCloud,
  Users,
} from 'lucide-react'
import type { ComponentType, ReactNode, SVGProps } from 'react'

import type { AdminPrimaryRole } from '@/features/admin/lib/roles'
import { cn } from '@/shared/lib/utils'

const navItems: Array<{
  label: string
  to: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  roles: AdminPrimaryRole[]
}> = [
  { label: 'Overview', to: '/admin', icon: Home, roles: ['admin', 'editor'] },
  { label: 'Users', to: '/admin/users', icon: Users, roles: ['admin'] },
  { label: 'Passports', to: '/admin/passports', icon: FileText, roles: ['admin'] },
  { label: 'Articles', to: '/admin/articles', icon: Newspaper, roles: ['admin', 'editor'] },
  { label: 'Ad Requests', to: '/admin/advertisement-requests', icon: Megaphone, roles: ['admin'] },
  { label: 'Advertisements', to: '/admin/advertisements', icon: ImageIcon, roles: ['admin'] },
  { label: 'PDF import', to: '/admin/pdf-import', icon: UploadCloud, roles: ['admin'] },
] as const

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  reduceMotion: boolean
  role: AdminPrimaryRole
}

export function Sidebar({ isOpen, onClose, reduceMotion, role }: SidebarProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const filteredItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <>
      <aside className="hidden w-64 flex-col border-r bg-background/95 pb-6 lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-lg font-semibold tracking-tight">Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4 text-sm">
          {filteredItems.map((item) => (
            <SidebarLink key={item.to} href={item.to} icon={item.icon} active={pathname === item.to}>
              {item.label}
            </SidebarLink>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      <div
        role="presentation"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background pb-6 shadow-lg transition-transform lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          reduceMotion && 'transition-none',
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <span className="text-lg font-semibold tracking-tight">Admin</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-input px-2 py-1 text-sm"
          >
            Close
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4 text-sm">
          {filteredItems.map((item) => (
            <SidebarLink
              key={item.to}
              href={item.to}
              icon={item.icon}
              active={pathname === item.to}
              onClick={onClose}
            >
              {item.label}
            </SidebarLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

type SidebarLinkProps = {
  href: string
  icon: ComponentType<React.SVGProps<SVGSVGElement>>
  active: boolean
  children: ReactNode
  onClick?: () => void
}

function SidebarLink({ href, icon: Icon, active, children, onClick }: SidebarLinkProps) {
  const baseClasses = 'flex items-center gap-3 rounded-md px-3 py-2 transition-colors'
  const activeClasses = active
    ? 'bg-primary/10 text-primary'
    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'

  return (
    <Link
      to={href}
      className={cn(baseClasses, activeClasses)}
      onClick={onClick}
      preload="intent"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{children}</span>
    </Link>
  )
}
