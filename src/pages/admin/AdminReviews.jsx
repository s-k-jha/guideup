import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { getAdminReviews } from '../../api/reviews'
import { cn } from '../../lib/utils'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn('w-3.5 h-3.5', n <= rating ? 'fill-primary-500 text-primary-500' : 'fill-transparent text-muted-foreground/30')} />
      ))}
    </div>
  )
}

export default function AdminReviews() {
  const [type, setType] = useState('mentor')
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({ avgRating: 0, count: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAdminReviews(type)
      .then((data) => {
        setReviews(data.reviews || [])
        setStats(data.stats || { avgRating: 0, count: 0 })
      })
      .catch(() => {
        setReviews([])
        setStats({ avgRating: 0, count: 0 })
      })
      .finally(() => setLoading(false))
  }, [type])

  return (
    <>
      <Seo title="Reviews" path="/admin/reviews" noindex />
      <AdminLayout title="Reviews">
        <Tabs value={type} onValueChange={setType}>
          <TabsList className="mb-5">
            <TabsTrigger value="mentor">Mentor Reviews</TabsTrigger>
            <TabsTrigger value="platform">Platform Reviews</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="p-5 mb-6 flex items-center gap-6 flex-wrap">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Average rating</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold text-foreground">{stats.avgRating.toFixed(1)}</span>
              <StarRow rating={Math.round(stats.avgRating)} />
            </div>
          </div>
          <div className="h-9 w-px bg-border" />
          <div>
            <div className="text-xs text-muted-foreground mb-1">Total reviews</div>
            <div className="text-2xl font-display font-bold text-foreground">{stats.count}</div>
          </div>
        </Card>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <EmptyState
            title="No reviews yet"
            description={type === 'mentor' ? 'Reviews students leave for mentors will show up here.' : 'Reviews students leave for the GuideUp platform will show up here.'}
          />
        )}

        {!loading && reviews.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                {type === 'mentor' && <TableHead>Mentor</TableHead>}
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>
                    <div className="font-medium text-foreground text-sm">{r.userId?.name || 'Student'}</div>
                    <div className="text-xs text-muted-foreground">{r.userId?.email}</div>
                  </TableCell>
                  {type === 'mentor' && (
                    <TableCell className="text-sm text-foreground">{r.mentorId?.name || '—'}</TableCell>
                  )}
                  <TableCell><StarRow rating={r.rating} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    {r.comment || <span className="italic text-muted-foreground/60">No comment</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AdminLayout>
    </>
  )
}
