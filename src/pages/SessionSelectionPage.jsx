import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  IndianRupee,
  Info,
  ShieldCheck,
  Users,
  MessageSquare,
  Award,
  Wallet,
} from 'lucide-react'
import { getSessions } from '../api/sessions'
import { useBooking } from '../context/BookingContext'
import Seo from '../lib/seo'
import SessionCard from '../components/SessionCard'
import StepIndicator from '../components/StepIndicator'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SkeletonCard } from '../components/ui/Skeleton'
import { ErrorState } from '../components/ui/States'

const SELECTION_PERKS = [
  { icon: Users, title: '1:1 with experienced mentors', text: 'Personalized mentors from top companies' },
  { icon: MessageSquare, title: 'Personalized feedback', text: 'Actionable insights to improve' },
  { icon: ShieldCheck, title: 'Safe & confidential', text: 'Your data is always secure' },
]

const TRUST_STRIP = [
  { icon: Users, title: 'Personalized mentors, not scripts', text: 'Talk to working professionals' },
  { icon: MessageSquare, title: 'Detailed feedback', text: 'Know exactly where to improve' },
  { icon: Wallet, title: 'Affordable & flexible', text: 'High quality at student pricing' },
  { icon: Award, title: 'Trusted by students', text: '500+ successful mock interviews' },
]

export default function SessionSelectionPage() {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(booking.session)

  const load = () => {
    setLoading(true)
    setError('')
    getSessions()
      .then(setSessions)
      .catch(() => setError('Failed to load sessions. Please try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    if (window.gtag) window.gtag('event', 'view_sessions')
  }, [])

  // Default to the most-popular (or first) session once loaded, so a
  // first-time visitor already sees a selection rather than an empty state.
  useEffect(() => {
    if (selected || sessions.length === 0) return
    setSelected(sessions.find((s) => s.isPromo) || sessions[0])
  }, [sessions])

  const pricePerMinute = selected ? selected.price / selected.durationMinutes : null

  const handleContinue = () => {
    if (!selected) return
    updateBooking({ session: selected })
    navigate('/schedule')
  }

  return (
    <>
      <Seo title="Choose a Mock Interview Session" path="/sessions" noindex />
      <PageWrapper maxWidth="max-w-6xl">
        <div id="session-grid-top" className="px-4 sm:px-6 pt-4 pb-28 lg:pb-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors shrink-0" aria-label="Back">
                <ArrowLeft className="w-5 h-5 text-foreground/70" />
              </button>
              <div>
                <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground">Choose Your Session</h1>
                <p className="hidden sm:block text-muted-foreground text-sm mt-0.5">
                  Pick the round you want to practice — a mentor is assigned after booking.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-start gap-2.5 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-snug">
                <div className="font-semibold text-primary-800">500+ mock interviews completed</div>
                <div className="text-primary-700/80">by students like you</div>
              </div>
            </div>
          </div>

          <StepIndicator current={1} showDescriptions align="left" />

          <p className="text-muted-foreground text-sm mb-6 text-center sm:hidden">
            Pick the round you want to practice — a mentor is assigned after booking.
          </p>

          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            <div>
              {loading && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {!loading && error && <ErrorState description={error} onRetry={load} />}

              {!loading && !error && sessions.length === 0 && (
                <ErrorState
                  title="No sessions available right now"
                  description="Please check back shortly — we're updating our session lineup."
                />
              )}

              {!loading && !error && sessions.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {sessions.map((session, i) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      index={i}
                      pricePerMinute={session.price / session.durationMinutes}
                      selected={selected?._id === session._id}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              )}

              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mt-5 text-sm text-primary-800 flex gap-2.5">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>A mentor will be assigned after booking confirmation. All sessions are 1:1 and confidential.</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-border">
                {TRUST_STRIP.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground leading-tight">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.text}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Desktop sticky summary */}
            <Card className="hidden lg:block sticky top-24 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Your Selection</h3>

              {selected ? (
                <>
                  <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-border">
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground text-sm truncate">{selected.title}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selected.durationMinutes} min</span>
                        <span className="flex items-center gap-0.5"><IndianRupee className="w-3 h-3" />{selected.price}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('session-grid-top')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700 shrink-0"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-3 pb-4 mb-4 border-b border-border">
                    {SELECTION_PERKS.map((perk) => {
                      const Icon = perk.icon
                      return (
                        <div key={perk.title} className="flex items-start gap-2.5">
                          <Icon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground leading-tight">{perk.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{perk.text}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-2 mb-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Duration</span>
                      <span className="font-medium text-foreground">{selected.durationMinutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium text-foreground flex items-center gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5" />{selected.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Effective Price</span>
                      <span className="font-semibold text-success">₹{pricePerMinute.toFixed(2)}/min</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground mb-5">Select a session to continue.</p>
              )}

              <Button onClick={handleContinue} disabled={!selected} className="w-full h-11 mb-4">
                Continue to Schedule <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-start gap-2.5 bg-secondary/50 rounded-lg p-3">
                <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <div className="text-xs leading-snug">
                  <div className="font-semibold text-foreground">100% Secure Booking</div>
                  <div className="text-muted-foreground">Easy refunds &amp; hassle free support</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="max-w-lg mx-auto">
            <Button onClick={handleContinue} disabled={!selected} className="w-full h-auto min-h-12 py-3 whitespace-normal text-center leading-snug">
              {selected ? `Continue with ${selected.title}` : 'Select a session to continue'}
            </Button>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
