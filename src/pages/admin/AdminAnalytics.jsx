import { useEffect, useState } from 'react'
import {
  Eye, Users, CalendarClock, Globe, Link2, Monitor, MapPin,
} from 'lucide-react'
import { getAnalytics } from '../../api/analytics'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const RANGE_OPTIONS = [7, 14, 30, 90]

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function formatDay(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function BreakdownCard({ icon: Icon, title, rows, renderLabel }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary-600" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground">No data yet</p>
        ) : (
          rows.map((row, i) => (
            <div key={i}>
              <div className="flex items-center justify-between gap-2 text-xs mb-1">
                <span className="text-foreground/80 truncate">{renderLabel(row)}</span>
                <span className="font-semibold text-foreground shrink-0">{row.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${(row.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)

  useEffect(() => {
    setLoading(true)
    getAnalytics(days)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [days])

  const overview = data?.overview
  const timeseries = data?.timeseries || []
  const maxDailyVisits = Math.max(1, ...timeseries.map((t) => t.visits))

  const METRICS = overview
    ? [
        { icon: Eye, label: 'Total Visits (all time)', value: overview.totalVisits.toLocaleString('en-IN') },
        { icon: Users, label: 'Unique Visitors (all time)', value: overview.totalUniqueVisitors.toLocaleString('en-IN') },
        { icon: CalendarClock, label: "Today's Visits", value: overview.todayVisits.toLocaleString('en-IN') },
        { icon: Users, label: "Today's Unique Visitors", value: overview.todayUniqueVisitors.toLocaleString('en-IN') },
        { icon: Eye, label: 'Last 7 Days Visits', value: overview.last7DaysVisits.toLocaleString('en-IN') },
      ]
    : []

  return (
    <>
      <Seo title="Visitor Analytics" path="/admin/analytics" noindex />
      <AdminLayout
        title="Visitor Analytics"
        actions={
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card text-foreground"
          >
            {RANGE_OPTIONS.map((d) => (
              <option key={d} value={d}>Last {d} days</option>
            ))}
          </select>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            : METRICS.map((m) => (
                <Card key={m.label} className="p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <m.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-display font-bold text-foreground">{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                </Card>
              ))}
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Daily Visits</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-40 rounded-lg" />
            ) : timeseries.length === 0 ? (
              <EmptyState title="No visits yet" description="Traffic will start showing up here once people visit the site." />
            ) : (
              <div className="flex items-end gap-1 sm:gap-1.5 h-40 overflow-x-auto pb-1">
                {timeseries.map((t) => (
                  <div key={t.date} className="flex-1 min-w-[6px] flex flex-col items-center justify-end h-full group relative">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-foreground text-background rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                      {formatDay(t.date)}: {t.visits} visits, {t.uniqueVisitors} unique
                    </div>
                    <div
                      className="w-full bg-primary-400 hover:bg-primary-600 rounded-t transition-colors"
                      style={{ height: `${Math.max(3, (t.visits / maxDailyVisits) * 100)}%` }}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <BreakdownCard icon={Globe} title="Top Pages" rows={data?.topPages || []} renderLabel={(r) => r.path} />
            <BreakdownCard icon={Link2} title="Top Referrers" rows={data?.topReferrers || []} renderLabel={(r) => r.referrer.replace(/^https?:\/\//, '')} />
            <BreakdownCard icon={Monitor} title="Devices" rows={data?.devices || []} renderLabel={(r) => r.device} />
            <BreakdownCard icon={Monitor} title="Browsers" rows={data?.browsers || []} renderLabel={(r) => r.browser} />
            <BreakdownCard icon={MapPin} title="Countries" rows={data?.countries || []} renderLabel={(r) => r.country} />
          </div>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : (data?.recentVisits || []).length === 0 ? (
              <EmptyState title="No activity yet" description="Recent page views will show up here." />
            ) : (
              <div className="divide-y divide-border -mx-1 overflow-x-auto">
                {data.recentVisits.map((v) => (
                  <div key={v._id} className="flex items-center justify-between gap-4 py-3 px-1 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">{v.path}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {[v.city, v.country].filter(Boolean).join(', ') || 'Unknown location'}
                        {v.device ? ` · ${v.device}` : ''}
                        {v.browser ? ` · ${v.browser}` : ''}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{timeAgo(v.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AdminLayout>
    </>
  )
}
