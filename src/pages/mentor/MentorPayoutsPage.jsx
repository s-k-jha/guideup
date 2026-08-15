import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IndianRupee, Info } from 'lucide-react'
import { getMentorEarnings, createPayoutRequest, getMyPayoutRequests } from '../../api/mentorFinance'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import MentorLayout from '../../components/layout/MentorLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Label from '../../components/ui/Label'
import Badge from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const STATUS_VARIANT = { pending: 'warning', approved: 'secondary', paid: 'success', rejected: 'destructive' }

export default function MentorPayoutsPage() {
  const { toast } = useToast()
  const [earnings, setEarnings] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hasBankDetails, setHasBankDetails] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.allSettled([getMentorEarnings(), getMyPayoutRequests()]).then(([e, r]) => {
      if (e.status === 'fulfilled') setEarnings(e.value)
      if (r.status === 'fulfilled') setRequests(Array.isArray(r.value) ? r.value : [])
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      toast({ title: 'Enter a valid amount', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      await createPayoutRequest(amt)
      toast({ title: 'Payout request submitted', variant: 'success' })
      setAmount('')
      setHasBankDetails(true)
      load()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not submit request'
      if (/bank/i.test(msg)) setHasBankDetails(false)
      toast({ title: msg, variant: 'destructive' })
    }
    setSubmitting(false)
  }

  return (
    <>
      <Seo title="Payouts" path="/mentor/payouts" noindex />
      <MentorLayout title="Payouts">
        {loading ? (
          <Skeleton className="h-32 rounded-xl mb-6" />
        ) : (
          <Card className="p-5 sm:p-6 mb-6">
            <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Available for payout</div>
                <div className="text-2xl font-display font-bold text-foreground flex items-center">
                  <IndianRupee className="w-5 h-5" />{Math.round(earnings?.availableForPayout || 0)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                Net earnings after GuideUp's 40% platform commission
              </div>
            </div>

            {!hasBankDetails && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-4">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Add your <Link to="/mentor/account" className="underline font-medium">bank account details</Link> before requesting a payout.
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount to withdraw"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                icon={IndianRupee}
                className="flex-1"
              />
              <Button onClick={handleSubmit} loading={submitting}>Request Payout</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Approved payouts are transferred manually by our team within 7 working days.
            </p>
          </Card>
        )}

        {!loading && requests.length === 0 && (
          <EmptyState title="No payout requests yet" description="Your payout request history will show up here." />
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
