import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import { getSlots } from '../api/slots'
import { useBooking } from '../context/BookingContext'
import DatePicker from '../components/DatePicker'
import SlotButton from '../components/SlotButton'
import PrimaryButton from '../components/PrimaryButton'
import LoadingSpinner from '../components/LoadingSpinner'
import StepIndicator from '../components/StepIndicator'
import PageWrapper from '../components/PageWrapper'

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

  const availableCount = slots.filter(s => s.available).length

  return (
    <PageWrapper>
      <div className="px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/sessions')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-xl text-gray-900">Pick Date & Time</h1>
        </div>

        <StepIndicator current={2} />

        {/* Session summary */}
        {booking.session && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 mb-5 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-primary-500 font-medium">Selected Session</div>
              <div className="text-sm font-semibold text-gray-900">{booking.session.title}</div>
            </div>
          </div>
        )}

        {/* Date */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold text-gray-800 text-sm">Select Date</h2>
          </div>
          <DatePicker selected={date} onSelect={setDate} />
        </div>

        {/* Slots */}
        {date && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <h2 className="font-semibold text-gray-800 text-sm">Available Slots</h2>
              </div>
              {!loadingSlots && slots.length > 0 && (
                <span className="text-xs text-gray-400">{availableCount} available</span>
              )}
            </div>

            {loadingSlots && <LoadingSpinner size="sm" />}

            {!loadingSlots && slots.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No slots available for this date.
              </div>
            )}

            {!loadingSlots && slots.length > 0 && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map(slot => (
                    <SlotButton
                      key={slot.time}
                      time={slot.time}
                      available={slot.available}
                      selected={selectedSlot === slot.time}
                      onSelect={setSelectedSlot}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-white border border-gray-200 inline-block" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-primary-500 inline-block" /> Selected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Booked
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        <PrimaryButton onClick={handleContinue} disabled={!date || !selectedSlot}>
          Continue to Checkout
        </PrimaryButton>
      </div>
    </PageWrapper>
  )
}
