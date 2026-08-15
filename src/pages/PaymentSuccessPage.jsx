import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Calendar, Clock, Mail, ArrowRight, Bell } from 'lucide-react'
import { useBooking } from '../context/BookingContext'
import Seo from '../lib/seo'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const { booking, resetBooking } = useBooking()

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'payment_success', {
        value: booking.session?.price || 0,
        currency: 'INR',
      })
    }
  }, [booking.session])

  const handleNewBooking = () => {
    resetBooking()
    navigate('/sessions')
  }

  return (
    <>
      <Seo title="Booking Confirmed" path="/success" noindex />
      <PageWrapper>
        <div className="px-4 pt-10 pb-10 text-center max-w-xl mx-auto">
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-11 h-11 text-success" />
            </div>
          </div>

          <h1 className="text-h2 font-display text-foreground mb-2">Booking confirmed</h1>

          <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 text-primary-800 rounded-xl p-3 mb-6 text-sm text-left">
            <Bell className="w-4 h-4 flex-shrink-0" />
            <span>Your session details and meeting link will arrive by email within a few minutes.</span>
          </div>

          {booking.session && (
            <Card className="p-5 mb-6 text-left">
              <h3 className="font-semibold text-foreground text-sm border-b border-border pb-2.5 mb-3.5">
                Booking Details
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Date</div>
                    <div className="text-sm font-semibold text-foreground">
                      {booking.date
                        ? new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                          })
                        : '—'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Time</div>
                    <div className="text-sm font-semibold text-foreground">
                      {booking.slot} · {booking.session.durationMinutes} minutes
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Confirmation sent to</div>
                    <div className="text-sm font-semibold text-foreground">{booking.userDetails?.email || '—'}</div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {booking.orderId && (
            <div className="bg-secondary/40 rounded-xl p-3 mb-6">
              <div className="text-xs text-muted-foreground mb-1">Order Reference</div>
              <div className="text-sm font-mono text-foreground">{booking.orderId}</div>
            </div>
          )}

          <div className="bg-secondary/40 border border-border rounded-xl p-4 text-left text-sm text-muted-foreground mb-6">
            <div className="font-semibold text-foreground mb-2">What happens next?</div>
            <ul className="space-y-1">
              <li>• A mentor will be assigned to your session</li>
              <li>• You will receive a confirmation email</li>
              <li>• The email will contain your meeting link</li>
              <li>• Join the session at the scheduled time</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={handleNewBooking} className="w-full h-12">
              Book Another Session
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full h-12">
              Back to Home
            </Button>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
