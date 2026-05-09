import {
  AlertTriangle,
  BarChart,
  CalendarClock,
  Clock,
  DollarSign,
  Eye,
  MousePointerClick,
  Receipt,
  TrendingUp,
} from 'lucide-react'

import { cn } from '@/shared/lib/utils'

import type { AdvertisementStatsData } from '../schemas/stats'

type StatsProps = {
  stats: AdvertisementStatsData
}

const numberFormatter = new Intl.NumberFormat('en-US')
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export function AdminAdvertisementStats({ stats }: StatsProps) {
  const totalAdvertisements = stats.total_advertisements || stats.total_active
  const adsNeedingAttention = stats.expiring_soon + stats.expired_pending_renewal
  const inactiveAds =
    totalAdvertisements - stats.total_active - stats.total_scheduled - stats.total_draft

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BarChart}
          label="Total Ads"
          value={formatNumber(totalAdvertisements)}
          detail={`${formatNumber(stats.total_active)} active`}
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Eye}
          label="Total Impressions"
          value={formatNumber(stats.total_impressions)}
          detail="All tracked ad views"
          iconColor="text-green-600"
        />
        <StatCard
          icon={MousePointerClick}
          label="Total Clicks"
          value={formatNumber(stats.total_clicks)}
          detail={`${formatPercent(stats.avg_ctr)} average CTR`}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Average CTR"
          value={formatPercent(stats.avg_ctr)}
          detail={
            stats.total_impressions > 0 ? 'Clicks divided by impressions' : 'No impressions yet'
          }
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Expiring Soon"
          value={formatNumber(stats.expiring_soon)}
          detail="Next 3 days"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Pending Renewal"
          value={formatNumber(stats.expired_pending_renewal)}
          detail={`${formatNumber(adsNeedingAttention)} need attention`}
          iconColor="text-red-600"
        />
        <StatCard
          icon={DollarSign}
          label="Revenue This Month"
          value={formatCurrency(stats.revenue_this_month)}
          detail={`${formatCurrency(stats.revenue_last_30_days)} last 30 days`}
          iconColor="text-green-600"
        />
        <StatCard
          icon={Receipt}
          label="Paid Ads"
          value={formatNumber(stats.paid_advertisements)}
          detail={`${formatNumber(stats.pending_payment)} pending payment`}
          iconColor="text-teal-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1.4fr)]">
        <div className="bg-card rounded-lg border p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="bg-muted rounded-full p-2 text-blue-600">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Inventory Health</h3>
              <p className="text-muted-foreground text-sm">Status and payment distribution</p>
            </div>
          </div>
          <div className="space-y-4">
            <StatusRow label="Active" value={stats.total_active} total={totalAdvertisements} />
            <StatusRow
              label="Scheduled"
              value={stats.total_scheduled}
              total={totalAdvertisements}
            />
            <StatusRow label="Draft" value={stats.total_draft} total={totalAdvertisements} />
            <StatusRow
              label="Paused / other"
              value={Math.max(inactiveAds, stats.total_paused)}
              total={totalAdvertisements}
            />
          </div>
        </div>

        <div className="bg-card overflow-hidden rounded-lg border">
          <div className="border-b p-6">
            <h3 className="font-semibold">Top Performers</h3>
            <p className="text-muted-foreground mt-1 text-sm">Ranked by clicks, then impressions</p>
          </div>
          {stats.top_performers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <Th>Advertisement</Th>
                    <Th>Status</Th>
                    <Th align="right">Impressions</Th>
                    <Th align="right">Clicks</Th>
                    <Th align="right">CTR</Th>
                    <Th align="right">Revenue</Th>
                  </tr>
                </thead>
                <tbody>
                  {stats.top_performers.map((ad) => (
                    <tr key={ad.id} className="border-t">
                      <td className="max-w-[260px] px-4 py-3">
                        <p className="truncate font-medium">{ad.ad_title}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {ad.slot_code ?? 'No slot'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-muted rounded-full px-2 py-1 text-xs capitalize">
                          {ad.status}
                        </span>
                      </td>
                      <Td align="right">{formatNumber(ad.impressions_count)}</Td>
                      <Td align="right">{formatNumber(ad.clicks_count)}</Td>
                      <Td align="right">{formatPercent(ad.ctr)}</Td>
                      <Td align="right">{formatCurrency(ad.payment_amount)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-muted-foreground p-6 text-sm">
              No advertisement performance yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type StatCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  detail?: string
  iconColor?: string
}

function StatCard({ icon: Icon, label, value, detail, iconColor = 'text-primary' }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-start gap-4">
        <div className={cn('bg-muted rounded-full p-3', iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl leading-tight font-bold break-words">{value}</p>
          {detail ? <p className="text-muted-foreground mt-1 text-xs">{detail}</p> : null}
        </div>
      </div>
    </div>
  )
}

type Align = 'left' | 'right'

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: Align }) {
  return (
    <th className={cn('px-4 py-3 font-medium', align === 'right' && 'text-right')}>{children}</th>
  )
}

function Td({ children, align = 'left' }: { children: React.ReactNode; align?: Align }) {
  return <td className={cn('px-4 py-3', align === 'right' && 'text-right')}>{children}</td>
}

function StatusRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {formatNumber(value)} · {percent}%
        </span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function formatNumber(value: number) {
  return numberFormatter.format(value)
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`
}
