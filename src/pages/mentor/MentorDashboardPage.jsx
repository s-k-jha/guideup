import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Circle, Loader2, IndianRupee, CalendarCheck, Clock, PhoneOff, ArrowRight } from 'lucide-react'
import { useMentorAuth } from '../../context/MentorAuthContext'
import { updateMentorStatus } from '../../api/mentorAuth'
import { getMentorEarnings, endActiveChat } from '../../api/mentorFinance'
import { useToast } from '../../hooks/use-toast'
import Seo from '../../lib/seo'
import MentorLayout from '../../components/layout/MentorLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { cn } from '../../lib/utils'

const STATUS_OPTIONS = [
  { value: 0, label: 'Offline', dot: 'bg-muted-foreground', active: 'border-foreground/30 bg-secondary text-foreground' },
  { value: 1, label: 'Online', dot: 'bg-success', active: 'border-success bg-success/10 text-success' },
]

function minutesToHM(mins) {
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function MentorDashboardPage() {
  const { mentor, setMentor } = useMentorAuth()
  const { toast } = useToast()
  const [statusSaving, setStatusSaving] = useState(false)
  const [ending, setEnding] = useState(false)
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadEarnings = () => {
    getMentorEarnings().then(setEarnings).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadEarnings() }, [])

  const isBusy = mentor?.availabilityStatus === 2

  const handleStatusChange = async (value) => {
    if (value === mentor.availabilityStatus) return
    setStatusSaving(true)
    try {
      const updated = await updateMentorStatus(value)
      setMentor(updated)
      toast({ title: `You're now ${STATUS_OPTIONS.find((s) => s.value === value).label.toLowerCase()}`, variant: 'success' })
    } catch (err) {
      toast({ title: err?.response?.data?.message || 'Could not update status', variant: 'destructive' })
    }
    setStatusSaving(false)
  }

  const handleEndChat = async () => {
    setEnding(true)
    try {
      const updated = await endActiveChat()
      setMentor(updated)
      toast({ title: 'Chat ended — you\'re back online', variant: 'success' })
      loadEarnings()
    } catch {
      toast({ title: 'Could not end chat', variant: 'destructive' })
    }
    setEnding(false)
  }

  if (!mentor) return null

  const STATS = earnings ? [
    { icon: CalendarCheck, label: "Today's Orders", value: earnings.todayOrders },
    { icon: IndianRupee, label: "Today's Revenue", value: `₹${earnings.todayRevenue}` },
    { icon: CalendarCheck, label: 'Total Orders', value: earnings.totalOrders },
    { icon: IndianRupee, label: 'Net Earnings', value: `₹${Math.round(earnings.netEarnings)}` },
    { icon: IndianRupee, label: 'Available for Payout', value: `₹${Math.round(earnings.availableForPayout)}` },
    { icon: Clock, label: 'Online Today', value: minutesToHM(earnings.liveMinutesToday || 0) },
  ] : []

  return (
    <>
      <Seo title="Mentor Overview" path="/mentor/dashboard" noindex />
      <MentorLayout title="Overview">
        <h1 className="text-h2 font-display text-foreground mb-1">Welcome, {mentor.name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground mb-8">Here's how you're doing today.</p>

        <Card className="p-5 sm:p-6 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">Availability</h3>
          <p className="text-xs text-muted-foreground mb-4">
            You only appear on the "Talk to a Mentor" page while you're Online.
          </p>

          {isBusy ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-destructive">
                <Circle className="w-2.5 h-2.5 rounded-full bg-destructive" fill="currentColor" />
                You're in an active chat
              </span>
              <Button size="sm" variant="destructive" onClick={handleEndChat} loading={ending}>
                <PhoneOff className="w-3.5 h-3.5" /> End Chat
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isActive = mentor.availabilityStatus === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                    disabled={statusSaving}
                    className={cn(
                      'flex items-center justify-center gap-2 h-11 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60',
                      isActive ? opt.active : 'border-border text-muted-foreground hover:bg-secondary'
                    )}
                  >
                    {statusSaving && isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Circle className={cn('w-2.5 h-2.5 rounded-full', opt.dot)} fill="currentColor" />}
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
            : STATS.map((s) => (
                <Card key={s.label} className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-display font-bold text-foreground truncate">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </Card>
              ))}
        </div>

        {!loading && earnings && (
          <Card className="p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm font-semibold text-foreground">Ready to withdraw?</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ₹{Math.round(earnings.availableForPayout)} available after GuideUp's platform commission.
              </p>
            </div>
            <Button asChild size="sm">
              <Link to="/mentor/payouts">
                Request Payout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </Card>
        )}
      </MentorLayout>
    </>
  )
}
