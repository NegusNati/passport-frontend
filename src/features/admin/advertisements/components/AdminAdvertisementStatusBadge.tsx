import { Badge } from '@/shared/ui/badge'

import type { AdStatus } from '../schemas/advertisement'

type StatusBadgeProps = {
  status: AdStatus
}

export function AdminAdvertisementStatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<AdStatus, 'default' | 'secondary' | 'success' | 'outline'> = {
    active: 'success',
    paused: 'secondary',
    scheduled: 'default',
    expired: 'outline',
  }

  const labels: Record<AdStatus, string> = {
    active: 'Active',
    paused: 'Paused',
    scheduled: 'Scheduled',
    expired: 'Expired',
  }

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}
