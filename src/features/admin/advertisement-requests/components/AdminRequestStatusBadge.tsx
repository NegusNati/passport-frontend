import { Badge } from '@/shared/ui/badge'

type Status = 'pending' | 'contacted' | 'approved' | 'rejected' | null

interface AdminRequestStatusBadgeProps {
  status: Status
}

const statusConfig: Record<
  NonNullable<Status>,
  { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' }
> = {
  pending: { label: 'Pending', variant: 'default' },
  contacted: { label: 'Contacted', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

export function AdminRequestStatusBadge({ status }: AdminRequestStatusBadgeProps) {
  if (!status) {
    return <Badge variant="outline">Unknown</Badge>
  }
  const config = statusConfig[status] ?? { label: status, variant: 'default' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
