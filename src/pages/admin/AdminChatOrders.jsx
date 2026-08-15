import { useEffect, useState } from 'react'
import { getAdminChatOrders } from '../../api/chatOrders'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const TIER_VARIANT = { free: 'success', discount: 'warning', paid: 'secondary' }
const STATUS_VARIANT = { confirmed: 'success', completed: 'success', pending: 'warning', payment_processing: 'warning', cancelled: 'destructive' }

export default function AdminChatOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminChatOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Seo title="Chat Orders" path="/admin/chat-orders" noindex />
      <AdminLayout title="Talk-to-Mentor Chats">
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <EmptyState title="No chat orders yet" description="Chat leads from the Talk to a Mentor page will show up here." />
        )}

        {!loading && orders.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>
                    <div className="font-medium text-foreground text-sm">{o.userId?.name}</div>
                    <div className="text-xs text-muted-foreground">{o.userId?.email} · {o.userId?.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">{o.mentorId?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.mentorId?.freeOrdersUsedToday ?? 0}/{o.mentorId?.dailyFreeQuota ?? 20} free today
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={TIER_VARIANT[o.tier]}>{o.tier}</Badge></TableCell>
                  <TableCell className="text-sm font-medium">₹{o.amountPaid}</TableCell>
                  <TableCell><Badge variant={STATUS_VARIANT[o.status]}>{o.status.replace('_', ' ')}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('en-IN')}
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
