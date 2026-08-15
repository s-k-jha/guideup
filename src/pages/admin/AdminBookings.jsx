import { useEffect, useMemo, useState } from 'react'
import { Search, UserCheck, Loader2 } from 'lucide-react'
import { getBookings, assignMentor, getMentors } from '../../api/admin'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/Select'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

export default function AdminBookings() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState([])
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pendingAssign, setPendingAssign] = useState({})
  const [assigning, setAssigning] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await getBookings()
        setBookings(bookingsRes.data.bookings || [])
        const mentorsRes = await getMentors()
        setMentors(mentorsRes.data.mentors || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAssign = async (bookingId) => {
    const mentorId = pendingAssign[bookingId]
    if (!mentorId) return
    setAssigning((s) => ({ ...s, [bookingId]: true }))
    try {
      await assignMentor(bookingId, mentorId)
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, mentorId } : b)))
      toast({ title: 'Mentor assigned', variant: 'success' })
    } catch {
      toast({ title: 'Could not assign mentor', variant: 'destructive' })
    }
    setAssigning((s) => ({ ...s, [bookingId]: false }))
  }

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter === 'assigned' && !b.mentorId) return false
      if (statusFilter === 'pending' && b.mentorId) return false
      if (search) {
        const q = search.toLowerCase()
        const haystack = `${b.userId?.name || ''} ${b.userId?.email || ''} ${b.sessionId?.title || ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [bookings, search, statusFilter])

  return (
    <>
      <Seo title="Manage Bookings" path="/admin/bookings" noindex />
      <AdminLayout title="Bookings">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <Input icon={Search} placeholder="Search by student, email, or session…" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <EmptyState title="No bookings found" description="Try a different search or filter." />
        )}

        {!loading && filtered.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mentor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>
                    <div className="font-medium text-foreground text-sm">{b.userId?.name}</div>
                    <div className="text-xs text-muted-foreground">{b.userId?.email}</div>
                  </TableCell>
                  <TableCell className="text-sm">{b.sessionId?.title}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {b.date} <span className="text-muted-foreground">· {b.startTime}</span>
                  </TableCell>
                  <TableCell className="text-sm font-medium">₹{b.amountPaid}</TableCell>
                  <TableCell>
                    <Badge variant={b.mentorId ? 'success' : 'warning'}>{b.mentorId ? 'Assigned' : 'Pending'}</Badge>
                  </TableCell>
                  <TableCell>
                    {b.mentorId ? (
                      <span className="text-sm text-muted-foreground">
                        {mentors.find((m) => m._id === b.mentorId)?.name || '—'}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 min-w-[180px]">
                        <Select value={pendingAssign[b._id] || ''} onValueChange={(v) => setPendingAssign((s) => ({ ...s, [b._id]: v }))}>
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="Select mentor" />
                          </SelectTrigger>
                          <SelectContent>
                            {mentors.map((m) => (
                              <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="secondary" onClick={() => handleAssign(b._id)} disabled={!pendingAssign[b._id] || assigning[b._id]}>
                          {assigning[b._id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    )}
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
