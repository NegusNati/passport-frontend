import {
  AlertTriangle,
  BarChart,
  Clock,
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
} from 'lucide-react'

import type { AdvertisementStatsData } from '../schemas/stats'

type StatsProps = {
  stats: AdvertisementStatsData
}

export function AdminAdvertisementStats({ stats }: StatsProps) {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BarChart}
          label="Total Active"
          value={stats.total_active.toLocaleString()}
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Eye}
          label="Total Impressions"
          value={stats.total_impressions.toLocaleString()}
          iconColor="text-green-600"
        />
        <StatCard
          icon={MousePointerClick}
          label="Total Clicks"
          value={stats.total_clicks.toLocaleString()}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Average CTR"
          value={`${stats.avg_ctr.toFixed(2)}%`}
          iconColor="text-orange-600"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Clock}
          label="Expiring Soon"
          value={stats.expiring_soon.toLocaleString()}
          iconColor="text-yellow-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Expired (Pending Renewal)"
          value={stats.expired_pending_renewal.toLocaleString()}
          iconColor="text-red-600"
        />
        <StatCard
          icon={DollarSign}
          label="Revenue This Month"
          value={`$${stats.revenue_this_month.toLocaleString()}`}
          iconColor="text-green-600"
        />
      </div>

      {/* Summary Card */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">Summary</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">Total Active Advertisements</p>
            <p className="text-2xl font-bold">{stats.total_active}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Revenue This Month</p>
            <p className="text-2xl font-bold text-green-600">
              ${stats.revenue_this_month.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Engagement Rate</p>
            <p className="text-2xl font-bold">
              {stats.avg_ctr > 0 ? `${stats.avg_ctr.toFixed(2)}%` : 'No data'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Ads Needing Attention</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.expiring_soon + stats.expired_pending_renewal}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

type StatCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  iconColor?: string
}

function StatCard({ icon: Icon, label, value, iconColor = 'text-primary' }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-4">
        <div className={`bg-muted rounded-full p-3 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}
