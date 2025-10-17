import { useRouterState } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { prefersReducedMotion } from '@/features/admin/lib/a11y'
import type { AdminPrimaryRole } from '@/features/admin/lib/roles'
import type { User } from '@/features/auth/schemas/user'
import { Seo } from '@/shared/ui/Seo'

import { AdminUnauthorized } from '../components/AdminUnauthorized'
import { AdminHeader } from './Header'
import { Sidebar } from './Sidebar'

type AllowedRoute = {
  path: string
  includeChildren: boolean
}

type AdminShellContextValue = {
  user: User
  role: AdminPrimaryRole
  allowedRoutes: AllowedRoute[]
  isPathAllowed: (targetPath: string) => boolean
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null)

export function useAdminShellContext() {
  const ctx = useContext(AdminShellContext)
  if (!ctx) {
    throw new Error('useAdminShellContext must be used within AdminShell')
  }
  return ctx
}

type AdminShellProps = {
  user: User
  role: AdminPrimaryRole
  children: React.ReactNode
}

const ROLE_ALLOWED_ROUTES: Record<AdminPrimaryRole, AllowedRoute[]> = {
  admin: [{ path: '/admin', includeChildren: true }],
  editor: [
    { path: '/admin', includeChildren: false },
    { path: '/admin/articles', includeChildren: true },
  ],
  user: [],
}

export function AdminShell({ user, role, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  const closeSidebar = () => setSidebarOpen(false)
  const openSidebar = () => setSidebarOpen(true)

  useEffect(() => {
    setReduceMotion(prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (!sidebarOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [sidebarOpen])

  const allowedRoutes = useMemo(() => ROLE_ALLOWED_ROUTES[role] ?? [], [role])

  const isPathAllowed = useMemo(() => {
    const normalize = (input: string) => (input !== '/' ? input.replace(/\/+$/, '') : input)
    if (role === 'admin') {
      return (targetPath: string) => normalize(targetPath).startsWith('/admin')
    }

    return (targetPath: string) => {
      const normalizedTarget = normalize(targetPath)
      return allowedRoutes.some(({ path, includeChildren }) => {
        const normalizedPath = normalize(path)
        if (normalizedTarget === normalizedPath) return true
        return includeChildren && normalizedTarget.startsWith(`${normalizedPath}/`)
      })
    }
  }, [allowedRoutes, role])

  const contextValue = useMemo<AdminShellContextValue>(
    () => ({ user, role, allowedRoutes, isPathAllowed }),
    [user, role, allowedRoutes, isPathAllowed],
  )

  if (role === 'user') {
    return <AdminUnauthorized user={user} />
  }

  const isAllowed = isPathAllowed(pathname)

  if (!isAllowed) {
    return <AdminUnauthorized user={user} variant="restricted" />
  }

  return (
    <AdminShellContext.Provider value={contextValue}>
      <Seo title="Admin dashboard" description="Manage content and users." noindex />
      <div className="bg-background flex min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          reduceMotion={reduceMotion}
          role={role}
        />
        <div className="flex w-full flex-1 flex-col">
          <AdminHeader onMenuClick={openSidebar} />
          <main className="bg-background flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </AdminShellContext.Provider>
  )
}
