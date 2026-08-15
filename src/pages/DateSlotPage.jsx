import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import { getSlots } from '../api/slots'
import { useBooking } from '../context/BookingContext'
import Seo from '../lib/seo'
import DatePicker from '../components/DatePicker'
import SlotButton from '../components/SlotButton'
import StepIndicator from '../components/StepIndicator'
import PageWrapper from '../components/PageWrapper'
import Button from '../components/ui/Button'
import { LoadingState } from '../components/ui/States'

function parseHour(time) {
  const [h] = time.split(':').map(Number)
  return h
}

function groupSlots(slots) {
  const groups = { Morning: [], Afternoon: [], Evening: [] }
  for (const slot of slots) {
    const h = parseHour(slot.time)
    if (h < 12) groups.Morning.push(slot)
    else if (h < 17) groups.Afternoon.push(slot)
    else groups.Evening.push(slot)
  }
  return Object.entries(groups).filter(([, list]) => list.length > 0)
}

export default function DateSlotPage() {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()
  const [date, setDate] = useState(booking.date || '')
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(booking.slot || '')

  useEffect(() => {
    if (!booking.session) { navigate('/sessions'); return }
  }, [booking.session, navigate])

  useEffect(() => {
    if (!date) return
    setLoadingSlots(true)
    setSelectedSlot('')
    getSlots(date, booking.session?._id)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [date, booking.session?._id])

  const handleContinue = () => {
    if (!date || !selectedSlot) return
    updateBooking({ date, slot: selectedSlot })
    navigate('/checkout')
  }

  const availableCount = slots.filter((s) => s.available).length
  const grouped = useMemo(() => groupSlots(slots), [slots])

  if (!booking.session) return null

  return (
    <>
      <Seo title="Pick Date & Time" path="/schedule" noindex />
      <PageWrapper>
        <div className="px-4 pt-4 pb-28 sm:pb-8">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/sessions')} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-foreground/70" />
            </button>
            <h1 className="font-display font-bold text-xl text-foreground">Pick Date &amp; Time</h1>
          </div>

          <StepIndicator current={2} />

          {booking.session && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-primary-600 font-medium">Selected session</div>
                <div className="text-sm font-semibold text-foreground truncate">{booking.session.title}</div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-primary-500" />
              <h2 className="font-semibold text-foreground text-sm">Select date</h2>
            </div>
            <DatePicker selected={date} onSelect={setDate} />
          </div>

          {date && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <h2 className="font-semibold text-foreground text-sm">Available slots</h2>
                </div>
                {!loadingSlots && slots.length > 0 && (
                  <span className="text-xs text-muted-foreground">{availableCount} available</span>
                )}
              </div>

              {loadingSlots && <LoadingState size="sm" label="Checking availability…" className="py-10" />}

              {!loadingSlots && slots.length === 0 && (
                <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border">
                  <p className="text-sm font-medium text-foreground mb-1">No sessions available for this date.</p>
                  <p className="text-xs text-muted-foreground">Try another date to find available mentorship sessions.</p>
                </div>
              )}

              {!loadingSlots && slots.length > 0 && (
                <>
                  <div className="space-y-5">
                    {grouped.map(([label, list]) => (
                      <div key={label}>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{label}</div>
                        <div className="grid grid-cols-4 gap-2">
                          {list.map((slot) => (
                            <SlotButton
                              key={slot.time}
                              time={slot.time}
                              available={slot.available}
                              selected={selectedSlot === slot.time}
                              onSelect={setSelectedSlot}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-card border border-border inline-block" /> Available
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-primary inline-block" /> Selected
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-secondary inline-block" /> Booked
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="hidden sm:block">
            <Button onClick={handleContinue} disabled={!date || !selectedSlot} className="w-full h-12">
              Continue to Checkout
            </Button>
          </div>
        </div>

        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="max-w-lg mx-auto">
            <Button onClick={handleContinue} disabled={!date || !selectedSlot} className="w-full h-12">
              Continue to Checkout
            </Button>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
