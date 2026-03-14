import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Tag, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react'
import { validateCoupon } from '../api/coupons'
import { createOrder } from '../api/payment'
import { verifyPayment } from '../api/payment'
import { useBooking } from '../context/BookingContext'
import PriceSummary from '../components/PriceSummary'
import PrimaryButton from '../components/PrimaryButton'
import StepIndicator from '../components/StepIndicator'
import PageWrapper from '../components/PageWrapper'


const schema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
})

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(booking.coupon || null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: booking.userDetails || {},
  })

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    setCoupon(null)
    try {
      const response = await validateCoupon({
        code: couponCode.trim(),
        sessionId: booking.session._id
      })

      const couponData = response.data

      if (couponData.valid) {

        setCoupon({
          code: couponData.code,
          discount: couponData.discountAmount
        })

        setCouponError("")

      } else {

        setCouponError(couponData.message || "Invalid coupon")

      }
    } catch {
      setCouponError('Could not validate coupon. Try again.')
    } finally {
      setCouponLoading(false)
    }
  }

  const onSubmit = async (userDetails) => {
    setPayLoading(true)
    setPayError('')
    updateBooking({ userDetails, coupon })
    try {
      const orderData = await createOrder({
        sessionId: booking.session._id,
        date: booking.date,
        startTime: booking.slot,
        couponCode: coupon?.code || undefined,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
      })
      

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SQPzPASvxdIIrr',
        amount: orderData.data.amount || orderData.amount,
        currency: "INR",
        order_id: orderData.data?.orderId || orderData.orderId, 
        name: "GuideUp",
        description: booking.session.title,
        handler: async (response) => {
          try {

            // console.log("RAZORPAY RESPONSE:", response)

            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })

            updateBooking({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id
            })

            setPayLoading(false)

            navigate('/success')

          } catch (err) {

            console.error(err)

            setPayLoading(false)

            setPayError('Payment verification failed. Contact support.')
          }
        }
      }
      console.log('option order data>>>>', options);

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Load Razorpay script dynamically
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => { new window.Razorpay(options).open() }
        script.onerror = () => setPayError('Could not load payment gateway. Please refresh.')
        document.body.appendChild(script)
      }
    } catch (e) {
      setPayError('Failed to create order. Please try again.')
      setPayLoading(false)
    }
  }

  if (!booking.session) {
    navigate('/sessions')
    return null
  }

  return (
    <PageWrapper>
      <div className="px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/schedule')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-xl text-gray-900">Checkout</h1>
        </div>

        <StepIndicator current={3} />

        {/* Booking summary */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-card mb-5">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4 text-primary-400" />
              <span className="font-medium text-gray-900">{booking.session.title}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-primary-400" />
              <span>{new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-primary-400" />
              <span>{booking.slot} • {booking.session.durationMinutes} minutes</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-card mb-5">
          <h3 className="font-semibold text-sm text-gray-700 mb-4">Your Details</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {[
              { name:'name', label:'Full Name', placeholder:'Rahul Sharma', type:'text' },
              { name:'email', label:'Email Address', placeholder:'rahul@example.com', type:'email' },
              { name:'phone', label:'Phone Number', placeholder:'9876543210', type:'tel' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input
                  {...register(f.name)}
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition"
                />
                {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name].message}</p>}
              </div>
            ))}

            {/* Coupon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); if (!e.target.value) setCoupon(null) }}
                  placeholder="FIRST100"
                  className="flex-1 h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponCode}
                  className="h-12 px-4 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 disabled:opacity-50 transition whitespace-nowrap"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
              {coupon && (
                <div className="flex items-center gap-1.5 mt-1.5 text-green-600 text-xs font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Coupon applied! ₹{coupon.discount} off
                </div>
              )}
              {couponError && (
                <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                  <XCircle className="w-3.5 h-3.5" />
                  {couponError}
                </div>
              )}
            </div>

            {/* Price summary */}
            <PriceSummary session={booking.session} coupon={coupon} />

            {payError && <p className="text-sm text-red-500 text-center">{payError}</p>}

            <PrimaryButton type="submit" loading={payLoading}>
              {payLoading ? 'Processing...' : 'Pay & Confirm Booking'}
            </PrimaryButton>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400">
          Secured by Razorpay. Your data is safe and encrypted.
        </p>
      </div>
    </PageWrapper>
  )
}
