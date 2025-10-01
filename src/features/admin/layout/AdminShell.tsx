import * as React from 'react'

import { prefersReducedMotion } from '@/features/admin/lib/a11y'

import { AdminHeader } from './Header'
import { Sidebar } from './Sidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  const closeSidebar = React.useCallback(() => setSidebarOpen(false), [])
  const openSidebar = React.useCallback(() => setSidebarOpen(true), [])

  React.useEffect(() => {
    setReduceMotion(prefersReducedMotion())
  }, [])

  React.useEffect(() => {
    if (!sidebarOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [sidebarOpen, closeSidebar])

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} reduceMotion={reduceMotion} />
      <div className="flex w-full flex-1 flex-col">
        <AdminHeader onMenuClick={openSidebar} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
