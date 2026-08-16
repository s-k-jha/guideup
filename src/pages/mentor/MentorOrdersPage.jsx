import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { getMentorOrders } from '../../api/mentorFinance'
import Seo from '../../lib/seo'
import MentorLayout from '../../components/layout/MentorLayout'
import Badge from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const TIER_VARIANT = { free: 'success', discount: 'warning', paid: 'secondary' }
const STATUS_VARIANT = { confirmed: 'success', completed: 'success', pending: 'warning', payment_processing: 'warning', cancelled: 'destructive' }

export default function MentorOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMentorOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Seo title="My Orders" path="/mentor/orders" noindex />
      <MentorLayout title="Orders">
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <EmptyState title="No chats yet" description="Chats students book with you will show up here." />
        )}

        {!loading && orders.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Handling</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>
                    <div className="font-medium text-foreground text-sm">{o.userId?.name}</div>
                    <div className="text-xs text-muted-foreground">{o.userId?.email}</div>
                  </TableCell>
                  <TableCell><Badge variant={TIER_VARIANT[o.tier]}>{o.tier}</Badge></TableCell>
                  <TableCell className="text-sm font-medium">₹{o.amountPaid}</TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[o.status]}>{o.status.replace('_', ' ')}</Badge></TableCell>
                  <TableCell>
                    {o.aiHandled && (
                      <Badge size="sm" className="flex items-center gap-1 w-fit">
                        <Sparkles className="w-3 h-3" /> AI
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </MentorLayout>
    </>
  )
}
