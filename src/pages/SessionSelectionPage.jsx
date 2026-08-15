import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, IndianRupee, Info } from 'lucide-react'
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

  const handleContinue = () => {
    if (!selected) return
    updateBooking({ session: selected })
    navigate('/schedule')
  }

  return (
    <>
      <Seo title="Choose a Mock Interview Session" path="/sessions" noindex />
      <PageWrapper maxWidth="max-w-5xl">
        <div className="px-4 sm:px-6 pt-4 pb-28 lg:pb-8">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-foreground/70" />
            </button>
            <h1 className="font-display font-bold text-xl text-foreground">Choose Session</h1>
          </div>

          <StepIndicator current={1} />

          <p className="text-muted-foreground text-sm mb-6 text-center lg:hidden">
            Pick the round you want to practice — a mentor is assigned after booking.
          </p>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div>
              <p className="hidden lg:block text-muted-foreground text-sm mb-5">
                Pick the round you want to practice — a mentor is assigned after booking.
              </p>

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
                  {sessions.map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
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
            </div>

            {/* Desktop sticky summary */}
            <Card className="hidden lg:block sticky top-24 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Your Selection</h3>
              {selected ? (
                <div className="space-y-3 mb-5">
                  <div className="font-semibold text-foreground text-sm">{selected.title}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selected.durationMinutes} min</span>
                    <span className="flex items-center gap-0.5 font-semibold text-foreground"><IndianRupee className="w-3.5 h-3.5" />{selected.price}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-5">Select a session to continue.</p>
              )}
              <Button onClick={handleContinue} disabled={!selected} className="w-full h-11">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="max-w-lg mx-auto">
            <Button onClick={handleContinue} disabled={!selected} className="w-full h-12">
              {selected ? `Continue with ${selected.title}` : 'Select a session to continue'}
            </Button>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
