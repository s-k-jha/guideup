import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    session: null,      // { _id, title, durationMinutes, price }
    date: '',           // 'YYYY-MM-DD'
    slot: '',           // '18:30'
    userDetails: null,  // { name, email, phone }
    coupon: null,       // { code, discount }
    orderId: null,
    paymentId: null,
  })

  const updateBooking = (updates) =>
    setBooking(prev => ({ ...prev, ...updates }))

  const resetBooking = () =>
    setBooking({ session: null, date: '', slot: '', userDetails: null, coupon: null, orderId: null, paymentId: null })

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
