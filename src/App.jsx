import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SessionSelectionPage from './pages/SessionSelectionPage'
import DateSlotPage from './pages/DateSlotPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBookings from './pages/admin/AdminBookings'
import AdminSessions from './pages/admin/AdminSessions'
import MeetingPage from './pages/MeetingPage'
import { BookingProvider } from './context/BookingContext'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'

export default function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sessions" element={<SessionSelectionPage />} />
        <Route path="/schedule" element={<DateSlotPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<PaymentSuccessPage />} />
       <Route path="/meeting/:bookingId" element={<MeetingPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/sessions" element={<AdminSessions />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />
      </Routes>
    </BookingProvider>
  )
}
