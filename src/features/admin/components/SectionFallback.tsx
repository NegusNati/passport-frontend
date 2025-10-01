import { AlertCircle } from 'lucide-react'

import { Skeleton } from '@/shared/ui/skeleton'

export function SectionLoading({ loading }: { loading: boolean }) {
  if (!loading) return null
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

export function SectionError({ error }: { error: Error | null }) {
  if (!error) return null
  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
      <div>
        <p className="font-medium">{error.message}</p>
        <p className="text-xs text-destructive/80">Try reloading or contact support if the issue persists.</p>
      </div>
    </div>
  )
}
