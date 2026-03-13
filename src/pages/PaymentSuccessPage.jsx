import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Calendar, Clock, Mail, ArrowRight } from 'lucide-react'
import { useBooking } from '../context/BookingContext'
import PrimaryButton from '../components/PrimaryButton'
import PageWrapper from '../components/PageWrapper'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const { booking, resetBooking } = useBooking()

  const handleNewBooking = () => {
    resetBooking()
    navigate('/sessions')
  }

  return (
    <PageWrapper>
      <div className="px-4 pt-10 pb-8 text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-green-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
            ✓
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your session has been booked. A mentor will be assigned within 24 hours.
        </p>

        {/* Booking details card */}
        {booking.session && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card mb-6 text-left space-y-3">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">Booking Details</h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Date</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {booking.date ? new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : '—'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Time</div>
                  <div className="text-sm font-semibold text-gray-800">{booking.slot} · {booking.session.durationMinutes} minutes</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Confirmation sent to</div>
                  <div className="text-sm font-semibold text-gray-800">{booking.userDetails?.email || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order ID */}
        {booking.orderId && (
          <div className="bg-gray-50 rounded-xl p-3 mb-6">
            <div className="text-xs text-gray-400 mb-1">Order Reference</div>
            <div className="text-sm font-mono text-gray-700">{booking.orderId}</div>
          </div>
        )}

        <div className="space-y-3">
          <PrimaryButton onClick={handleNewBooking}>
            Book Another Session <ArrowRight className="w-4 h-4" />
          </PrimaryButton>
          <PrimaryButton variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </PrimaryButton>
        </div>
      </div>
    </PageWrapper>
  )
}
