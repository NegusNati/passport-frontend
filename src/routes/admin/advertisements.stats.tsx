import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { useAdvertisementStatsQuery } from '@/features/admin/advertisements/api/get-stats'
import { AdminAdvertisementStats } from '@/features/admin/advertisements/components/AdminAdvertisementStats'

export const Route = createFileRoute('/admin/advertisements/stats')({
  component: AdminAdvertisementStatsPage,
})

function AdminAdvertisementStatsPage() {
  const query = useAdvertisementStatsQuery()

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="bg-muted h-8 w-64 rounded" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="space-y-6">
        <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6">
          <p className="text-destructive font-medium">Failed to load statistics</p>
          <p className="text-muted-foreground text-sm">{query.error?.message || 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Advertisement Statistics</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Performance metrics and insights for all advertisements
          </p>
        </div>
        <a
          href="/admin/advertisements"
          className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Advertisements
        </a>
      </div>

      <AdminAdvertisementStats stats={query.data} />
    </div>
  )
}
