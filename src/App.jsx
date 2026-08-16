import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { BookingProvider } from './context/BookingContext'
import { AuthProvider } from './context/AuthContext'
import { AuthDialogProvider } from './context/AuthDialogContext'
import { MentorAuthProvider } from './context/MentorAuthContext'
import PublicLayout from './components/layout/PublicLayout'
import ScrollToTop from './components/ScrollToTop'
import Toaster from './components/ui/Toaster'
import { LoadingState } from './components/ui/States'
import RequireAdminAuth from './components/admin/RequireAdminAuth'
import RequireMentorAuth from './components/mentorship/RequireMentorAuth'

const MentorLoginPage = lazy(() => import('./pages/mentor/MentorLoginPage'))
const MentorDashboardPage = lazy(() => import('./pages/mentor/MentorDashboardPage'))
const MentorSelfProfilePage = lazy(() => import('./pages/mentor/MentorProfilePage'))
const MentorAccountPage = lazy(() => import('./pages/mentor/MentorAccountPage'))
const MentorOrdersPage = lazy(() => import('./pages/mentor/MentorOrdersPage'))
const MentorPayoutsPage = lazy(() => import('./pages/mentor/MentorPayoutsPage'))
const MentorAdvancePage = lazy(() => import('./pages/mentor/MentorAdvancePage'))

const TalkToMentorPage = lazy(() => import('./pages/TalkToMentorPage'))
const MyChatsPage = lazy(() => import('./pages/MyChatsPage'))
const MyWalletPage = lazy(() => import('./pages/MyWalletPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const MentorChatPage = lazy(() => import('./pages/mentor/MentorChatPage'))

const SessionSelectionPage = lazy(() => import('./pages/SessionSelectionPage'))
const DateSlotPage = lazy(() => import('./pages/DateSlotPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'))
const MeetingPage = lazy(() => import('./pages/MeetingPage'))

const MentorsPage = lazy(() => import('./pages/MentorsPage'))
const MentorProfilePage = lazy(() => import('./pages/MentorProfilePage'))
const BecomeMentorPage = lazy(() => import('./pages/BecomeMentorPage'))
const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogArticlePage = lazy(() => import('./pages/BlogArticlePage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const RefundPage = lazy(() => import('./pages/RefundPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminSessions = lazy(() => import('./pages/admin/AdminSessions'))
const AdminMentors = lazy(() => import('./pages/admin/AdminMentors'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'))
const AdminBlogEditor = lazy(() => import('./pages/admin/AdminBlogEditor'))
const AdminChatOrders = lazy(() => import('./pages/admin/AdminChatOrders'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'))

function PageFallback() {
  return <LoadingState className="min-h-[60vh]" label="" />
}

export default function App() {
  return (
    <BookingProvider>
      <AuthProvider>
      <AuthDialogProvider>
      <MentorAuthProvider>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public marketing site — shared Navbar + Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/mentors/:slug" element={<MentorProfilePage />} />
            <Route path="/talk-to-mentor" element={<TalkToMentorPage />} />
            <Route path="/my-chats" element={<MyChatsPage />} />
            <Route path="/wallet" element={<MyWalletPage />} />
            <Route path="/become-a-mentor" element={<BecomeMentorPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
          </Route>

          {/* Live chat — full-screen, no marketing chrome */}
          <Route path="/chat/:chatOrderId" element={<ChatPage />} />

          {/* Booking flow — minimal chrome to keep focus on conversion */}
          <Route path="/sessions" element={<SessionSelectionPage />} />
          <Route path="/schedule" element={<DateSlotPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<PaymentSuccessPage />} />
          <Route path="/meeting/:bookingId" element={<MeetingPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} />
          <Route path="/admin/bookings" element={<RequireAdminAuth><AdminBookings /></RequireAdminAuth>} />
          <Route path="/admin/sessions" element={<RequireAdminAuth><AdminSessions /></RequireAdminAuth>} />
          <Route path="/admin/mentors" element={<RequireAdminAuth><AdminMentors /></RequireAdminAuth>} />
          <Route path="/admin/blog" element={<RequireAdminAuth><AdminBlog /></RequireAdminAuth>} />
          <Route path="/admin/blog/new" element={<RequireAdminAuth><AdminBlogEditor /></RequireAdminAuth>} />
          <Route path="/admin/blog/:id" element={<RequireAdminAuth><AdminBlogEditor /></RequireAdminAuth>} />
          <Route path="/admin/chat-orders" element={<RequireAdminAuth><AdminChatOrders /></RequireAdminAuth>} />
          <Route path="/admin/reviews" element={<RequireAdminAuth><AdminReviews /></RequireAdminAuth>} />

          {/* Mentor self-service portal */}
          <Route path="/mentor/login" element={<MentorLoginPage />} />
          <Route path="/mentor/dashboard" element={<RequireMentorAuth><MentorDashboardPage /></RequireMentorAuth>} />
          <Route path="/mentor/orders" element={<RequireMentorAuth><MentorOrdersPage /></RequireMentorAuth>} />
          <Route path="/mentor/payouts" element={<RequireMentorAuth><MentorPayoutsPage /></RequireMentorAuth>} />
          <Route path="/mentor/advance" element={<RequireMentorAuth><MentorAdvancePage /></RequireMentorAuth>} />
          <Route path="/mentor/profile" element={<RequireMentorAuth><MentorSelfProfilePage /></RequireMentorAuth>} />
          <Route path="/mentor/account" element={<RequireMentorAuth><MentorAccountPage /></RequireMentorAuth>} />
          <Route path="/mentor/chat/:chatOrderId" element={<RequireMentorAuth><MentorChatPage /></RequireMentorAuth>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
      </MentorAuthProvider>
      </AuthDialogProvider>
      </AuthProvider>
    </BookingProvider>
  )
}
