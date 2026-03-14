import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import { getSessions } from '../api/sessions'
import { useBooking } from '../context/BookingContext'
import SessionCard from '../components/SessionCard'
import PrimaryButton from '../components/PrimaryButton'
import StepIndicator from '../components/StepIndicator'
import PageWrapper from '../components/PageWrapper'

export default function SessionSelectionPage() {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(booking.session)

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(() => setError('Failed to load sessions. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const handleContinue = () => {
    if (!selected) return
    updateBooking({ session: selected })
    navigate('/schedule')
  }

  return (
    <PageWrapper>
      <div className="px-4 pt-4 pb-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <h1 className="font-bold text-xl text-gray-900">
            Choose Session
          </h1>
        </div>

        <StepIndicator current={1} />

        <p className="text-gray-500 text-sm mb-6 text-center">
          Select the type of mentorship session that fits your needs.
        </p>

        {/* Skeleton Loading */}
        {loading && (
          <div className="space-y-3 mb-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse border rounded-xl p-4 bg-white"
              >
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3 mb-8">
            {sessions.map(session => (
              <SessionCard
                key={session._id}
                session={session}
                selected={selected?._id === session._id}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}

        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 text-sm text-primary-700 flex gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            A mentor will be assigned after booking confirmation.
            All sessions are 1:1 and confidential.
          </span>
        </div>

        <PrimaryButton
          onClick={handleContinue}
          disabled={!selected}
          className={!selected ? 'opacity-50' : ''}
        >
          Continue
        </PrimaryButton>

      </div>
    </PageWrapper>
  )
}