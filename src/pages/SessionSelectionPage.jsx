import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import { getSessions } from '../api/sessions'
import { useBooking } from '../context/BookingContext'
import Seo from '../lib/seo'
import SessionCard from '../components/SessionCard'
import StepIndicator from '../components/StepIndicator'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/ui/Button'
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
      <PageWrapper>
        <div className="px-4 pt-4 pb-28 sm:pb-8">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-foreground/70" />
            </button>
            <h1 className="font-display font-bold text-xl text-foreground">Choose Session</h1>
          </div>

          <StepIndicator current={1} />

          <p className="text-muted-foreground text-sm mb-6 text-center">
            Pick the round you want to practice — a mentor is assigned after booking.
          </p>

          {loading && (
            <div className="space-y-3 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && error && <ErrorState description={error} onRetry={load} className="mb-8" />}

          {!loading && !error && sessions.length === 0 && (
            <ErrorState
              title="No sessions available right now"
              description="Please check back shortly — we're updating our session lineup."
              className="mb-8"
            />
          )}

          {!loading && !error && sessions.length > 0 && (
            <div className="space-y-3 mb-8">
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

          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 text-sm text-primary-800 flex gap-2.5">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>A mentor will be assigned after booking confirmation. All sessions are 1:1 and confidential.</span>
          </div>

          <div className="hidden sm:block">
            <Button onClick={handleContinue} disabled={!selected} className="w-full h-12">
              Continue
            </Button>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
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
