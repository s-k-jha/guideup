import { useEffect, useState } from 'react'
import { RefreshCw, AlertTriangle, Sparkles } from 'lucide-react'
import { getAdminChatOrders, getBusyMentors, refreshBusyMentor } from '../../api/chatOrders'
import { getSettings, updateSettings } from '../../api/settings'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Switch from '../../components/ui/Switch'
import { Card } from '../../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/States'

const TIER_VARIANT = { free: 'success', discount: 'warning', paid: 'secondary' }
const STATUS_VARIANT = { confirmed: 'success', completed: 'success', pending: 'warning', payment_processing: 'warning', cancelled: 'destructive' }

function timeAgo(date) {
  if (!date) return '—'
  const mins = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m ago`
}

function AiChatToggleCard() {
  const { toast } = useToast()
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => getSettings().then(setSettings).catch(() => {})

  useEffect(() => { load() }, [])

  const handleToggle = async (next) => {
    setSaving(true)
    const previous = settings
    setSettings((s) => ({ ...s, aiChatEnabled: next }))
    try {
      const updated = await updateSettings({ aiChatEnabled: next })
      setSettings(updated)
      toast({ title: next ? 'AI Mentor Chat enabled' : 'AI Mentor Chat disabled', variant: 'success' })
    } catch (err) {
      setSettings(previous)
      toast({
        title: err?.response?.data?.message || 'Could not update AI Mentor Chat setting',
        variant: 'destructive',
      })
    }
    setSaving(false)
  }

  if (!settings) return <Skeleton className="h-24 rounded-xl mb-6" />

  return (
    <Card className="p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Mentor Chat</h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
            When on, new "Talk to a Mentor" chats are answered by an AI assistant instead of requiring the
            mentor to be online — clearly disclosed to the student in the chat itself.
          </p>
          {!settings.aiConfigured && (
            <Badge variant="warning" size="sm" className="mt-2">
              No AI provider configured — set ANTHROPIC_API_KEY or OPENAI_API_KEY on the server
            </Badge>
          )}
          {settings.aiConfigured && (
            <p className="text-[11px] text-muted-foreground mt-1.5">Active provider: {settings.aiProvider}</p>
          )}
        </div>
      </div>
      <Switch
        checked={settings.aiChatEnabled}
        onCheckedChange={handleToggle}
        disabled={saving || (!settings.aiChatEnabled && !settings.aiConfigured)}
      />
    </Card>
  )
}

function BusyMentorsQueue() {
  const { toast } = useToast()
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshingId, setRefreshingId] = useState(null)

  const load = () => {
    setLoading(true)
    getBusyMentors().then(setMentors).catch(() => setMentors([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRefresh = async (mentor) => {
    setRefreshingId(mentor._id)
    try {
      await refreshBusyMentor(mentor._id)
      setMentors((prev) => prev.filter((m) => m._id !== mentor._id))
      toast({ title: `${mentor.name} is back online`, variant: 'success' })
    } catch {
      toast({ title: `Could not refresh ${mentor.name}. Please try again.`, variant: 'destructive' })
    }
    setRefreshingId(null)
  }

  return (
    <Card className="p-5 mb-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" /> Busy Mentors Queue
        </h3>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh list
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Mentors currently showing as busy. If a chat ended but a mentor is stuck, use "Refresh Mentor" to
        force them back online — this doesn't delete anything, it just resets their live status.
      </p>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      )}

      {!loading && mentors.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">No mentors are busy right now.</p>
      )}

      {!loading && mentors.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mentor</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Order status</TableHead>
              <TableHead>Busy since</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentors.map((m) => (
              <TableRow key={m._id}>
                <TableCell className="text-sm font-medium text-foreground">{m.name}</TableCell>
                <TableCell>
                  <div className="text-sm text-foreground">{m.activeChatOrderId?.userId?.name || '—'}</div>
                  <div className="text-xs text-muted-foreground">{m.activeChatOrderId?.userId?.email}</div>
                </TableCell>
                <TableCell>
                  {m.activeChatOrderId?.tier ? (
                    <Badge variant={TIER_VARIANT[m.activeChatOrderId.tier]}>{m.activeChatOrderId.tier}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">no linked order</span>
                  )}
                </TableCell>
                <TableCell>
                  {m.activeChatOrderId?.status ? (
                    <Badge variant={STATUS_VARIANT[m.activeChatOrderId.status]}>{m.activeChatOrderId.status.replace('_', ' ')}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {timeAgo(m.activeChatOrderId?.createdAt || m.lastActiveAt)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRefresh(m)}
                    loading={refreshingId === m._id}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Mentor
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}

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
        <AiChatToggleCard />
        <BusyMentorsQueue />

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
                <TableHead>Handling</TableHead>
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
      </AdminLayout>
    </>
  )
}
