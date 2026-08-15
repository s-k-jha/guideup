import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IndianRupee, Info, Clock, CheckCircle2 } from 'lucide-react'
import { getMentorEarnings, createAdvanceRequest, getMyAdvanceRequests } from '../../api/mentorFinance'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import MentorLayout from '../../components/layout/MentorLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const STATUS_VARIANT = { pending: 'warning', approved: 'secondary', paid: 'success', rejected: 'destructive' }

function minutesToHM(mins) {
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function MentorAdvancePage() {
  const { toast } = useToast()
  const [earnings, setEarnings] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.allSettled([getMentorEarnings(), getMyAdvanceRequests()]).then(([e, r]) => {
      if (e.status === 'fulfilled') setEarnings(e.value)
      if (r.status === 'fulfilled') setRequests(Array.isArray(r.value) ? r.value : [])
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const presenceMinutes = earnings?.liveMinutesToday || 0
  const isEligible = presenceMinutes >= 420
  const maxEligible = earnings ? Math.min(earnings.trailingMonthNetEarnings * 0.2, earnings.availableForPayout) : 0

  const handleSubmit = async () => {
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      toast({ title: 'Enter a valid amount', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      await createAdvanceRequest(amt)
      toast({ title: 'Advance request submitted', variant: 'success' })
      setAmount('')
      load()
    } catch (err) {
      toast({ title: err?.response?.data?.message || 'Could not submit request', variant: 'destructive' })
    }
    setSubmitting(false)
  }

  return (
    <>
      <Seo title="Advance" path="/mentor/advance" noindex />
      <MentorLayout title="Advance">
        {loading ? (
          <Skeleton className="h-40 rounded-xl mb-6" />
        ) : (
          <Card className="p-5 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary-600" />
              <div className="text-sm font-semibold text-foreground">Today's presence: {minutesToHM(presenceMinutes)}</div>
              {isEligible ? (
                <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3" /> Eligible</Badge>
              ) : (
                <Badge variant="warning" size="sm">Need 7h+ today</Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Advances are available once you've been online 7+ hours today, up to 20% of your trailing 30-day net earnings.
              Maximum right now: <span className="font-semibold text-foreground">₹{Math.round(maxEligible)}</span>
            </p>

            {!isEligible && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-4">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                Stay online a bit longer today to unlock an advance request.
              </div>
            )}

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Advance amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                icon={IndianRupee}
                disabled={!isEligible}
                className="flex-1"
              />
              <Button onClick={handleSubmit} loading={submitting} disabled={!isEligible}>Request Advance</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Needs <Link to="/mentor/account" className="underline font-medium">bank details</Link> on file. Approved advances are transferred manually within 7 working days.
            </p>
          </Card>
        )}

        {!loading && requests.length === 0 && (
          <EmptyState title="No advance requests yet" description="Your advance request history will show up here." />
        )}

        {!loading && requests.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium text-sm">₹{r.amount}</TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.adminNote || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </MentorLayout>
    </>
  )
}
