import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { env } from '@/shared/lib/env'
import { Seo } from '@/shared/ui/Seo'

function HorizonRedirect() {
  useEffect(() => {
    // Send admins to the Laravel Horizon dashboard on the backend host
    window.location.replace(env.HORIZON_URL)
  }, [])

  return (
    <div className="container mx-auto max-w-xl p-6 text-center">
      <Seo title="Redirecting to Horizon" noindex />
      <p className="text-muted-foreground text-sm">Redirecting to Horizon…</p>
      <p className="text-muted-foreground text-xs">
        If nothing happens,{' '}
        <a className="underline" href={env.HORIZON_URL}>
          click here
        </a>
        .
      </p>
    </div>
  )
}

export const Route = createFileRoute('/admin/horizon/dashboard')({
  component: HorizonRedirect,
})
