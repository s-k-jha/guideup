import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarCheck, IndianRupee, Users, Newspaper, UserPlus, ArrowRight, Calendar, Clock,
} from 'lucide-react'
import { getBookings, getMentors } from '../../api/admin'
import { getMentorApplications } from '../../api/mentors'
import { getAdminArticles } from '../../api/articles'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [mentorCount, setMentorCount] = useState(0)
  const [pendingApplications, setPendingApplications] = useState(0)
  const [publishedArticles, setPublishedArticles] = useState(0)

  useEffect(() => {
    Promise.allSettled([
      getBookings(),
      getMentors(),
      getMentorApplications('pending'),
      getAdminArticles(),
    ]).then(([bookingsRes, mentorsRes, applicationsRes, articlesRes]) => {
      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data?.bookings || [])
      if (mentorsRes.status === 'fulfilled') setMentorCount((mentorsRes.value.data?.mentors || []).length)
      if (applicationsRes.status === 'fulfilled') setPendingApplications(applicationsRes.value.length)
      if (articlesRes.status === 'fulfilled') setPublishedArticles(articlesRes.value.filter((a) => a.status === 'published').length)
    }).finally(() => setLoading(false))
  }, [])

  const revenue = bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + (b.amountPaid || 0) : sum), 0)
  const uniqueStudents = new Set(bookings.map((b) => b.userId?._id).filter(Boolean)).size
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const METRICS = [
    { icon: CalendarCheck, label: 'Total Bookings', value: bookings.length },
    { icon: IndianRupee, label: 'Revenue', value: `₹${revenue.toLocaleString('en-IN')}` },
    { icon: Users, label: 'Active Mentors', value: mentorCount },
    { icon: Users, label: 'Students', value: uniqueStudents },
    { icon: Newspaper, label: 'Published Articles', value: publishedArticles },
    { icon: UserPlus, label: 'Pending Applications', value: pendingApplications, href: '/admin/mentors' },
  ]

  return (
    <>
      <Seo title="Admin Dashboard" path="/admin" noindex />
      <AdminLayout title="Dashboard">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            : METRICS.map((m) => {
                const content = (
                  <Card className="p-5 flex items-center gap-4" hover={!!m.href}>
                    <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <m.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-display font-bold text-foreground">{m.value}</div>
                      <div className="text-xs text-muted-foreground">{m.label}</div>
                    </div>
                  </Card>
                )
                return m.href ? <Link key={m.label} to={m.href}>{content}</Link> : <div key={m.label}>{content}</div>
              })}
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <h2 className="text-h3 text-foreground">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : recentBookings.length === 0 ? (
              <EmptyState title="No bookings yet" description="New bookings will show up here as students book sessions." />
            ) : (
              <div className="divide-y divide-border -mx-1">
                {recentBookings.map((b) => (
                  <div key={b._id} className="flex items-center justify-between gap-4 py-3.5 px-1">
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">{b.userId?.name || 'Student'}</div>
                      <div className="text-xs text-muted-foreground truncate">{b.sessionId?.title}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.startTime}</span>
                    </div>
                    <Badge variant={b.mentorId ? 'success' : 'warning'} className="shrink-0">
                      {b.mentorId ? 'Assigned' : 'Pending'}
                    </Badge>
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
