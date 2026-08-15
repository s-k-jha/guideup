import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, IndianRupee, MessageCircle } from 'lucide-react'
import { getMyChatOrders } from '../api/chatOrders'
import { useAuth } from '../context/AuthContext'
import Seo from '../lib/seo'
import { Container, Section, SectionHeading } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/States'

const TIER_LABEL = { free: 'Free chat', discount: '₹5 chat', paid: 'Paid chat' }
const STATUS_VARIANT = { confirmed: 'success', completed: 'success', pending: 'warning', payment_processing: 'warning', cancelled: 'destructive' }

export default function MyChatsPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/talk-to-mentor'); return }
    getMyChatOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
  }, [user, authLoading, navigate])

  return (
    <>
      <Seo title="My Chats" path="/my-chats" noindex />
      <Section className="pt-10 sm:pt-14">
        <Container className="max-w-2xl">
          <SectionHeading align="left" title="My Chats" description="Your mentor chat history and offer status." className="mb-8" />

          {(loading || authLoading) && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          )}

          {!loading && !authLoading && orders.length === 0 && (
            <EmptyState
              icon={MessageCircle}
              title="No chats yet"
              description="Connect with a mentor to start your first free chat."
            />
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((o) => (
                <Card key={o._id} className="p-4 flex items-center gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={o.mentorId?.photoUrl} alt={o.mentorId?.name} />
                    <AvatarFallback>{o.mentorId?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-foreground truncate">{o.mentorId?.name || 'Mentor'}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{o.amountPaid} · {TIER_LABEL[o.tier]}</span>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANT[o.status] || 'secondary'} className="shrink-0">{o.status.replace('_', ' ')}</Badge>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
