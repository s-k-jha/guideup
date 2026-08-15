import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Tag, Calendar, Clock, ShieldCheck, Lock } from 'lucide-react'

import { validateCoupon } from '../api/coupons'
import { createOrder, verifyPayment } from '../api/payment'
import { useBooking } from '../context/BookingContext'
import Seo from '../lib/seo'

import PriceSummary from '../components/PriceSummary'
import StepIndicator from '../components/StepIndicator'
import PageWrapper from '../components/PageWrapper'
import CouponInput from '../components/checkout/CouponInput'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/Form'
import { Card } from '../components/ui/Card'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
})

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { booking, updateBooking } = useBooking()

  const [coupon, setCoupon] = useState(booking.coupon || null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: booking.userDetails || {},
  })

  const applyCoupon = async (code) => {
    setCouponLoading(true)
    setCouponError('')
    setCoupon(null)

    try {
      const response = await validateCoupon({ code, sessionId: booking.session._id })
      const couponData = response.data

      if (couponData.valid) {
        setCoupon({ code: couponData.code, discount: couponData.discountAmount })
        setCouponError('')
      } else {
        setCouponError(couponData.message || 'Invalid coupon')
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

      const order = orderData.data || orderData

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SQPzPASvxdIIrr',
        amount: order.amount,
        currency: 'INR',
        order_id: order.orderId,
        name: 'Guideup',
        description: booking.session.title,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: { color: '#f97316' },
        modal: {
          ondismiss: function () {
            setPayLoading(false)
            setPayError('Payment cancelled. You can try again.')
          },
        },
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })

            updateBooking({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
            })

            setPayLoading(false)
            navigate('/success')
          } catch (err) {
            console.error(err)
            setPayLoading(false)
            setPayError('Payment verification failed. Contact support.')
          }
        },
      }

      const loadRazorpay = () => {
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function () {
          setPayLoading(false)
          setPayError('Payment failed. Please try again.')
        })
        rzp.open()
      }

      if (window.Razorpay) {
        loadRazorpay()
      } else {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = loadRazorpay
        script.onerror = () => {
          setPayLoading(false)
          setPayError('Could not load payment gateway. Please refresh.')
        }
        document.body.appendChild(script)
      }
    } catch {
      setPayError('Failed to create order. Please try again.')
      setPayLoading(false)
    }
  }

  if (!booking.session) {
    navigate('/sessions')
    return null
  }

  return (
    <>
      <Seo title="Checkout" path="/checkout" noindex />
      <PageWrapper maxWidth="max-w-4xl">
        <div className="px-4 pt-4 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/schedule')} className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-foreground/70" />
            </button>
            <h1 className="font-display font-bold text-xl text-foreground">Checkout</h1>
          </div>

          <StepIndicator current={3} />

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start mt-2">
            {/* Left column — details form */}
            <Card className="p-5 sm:p-6">
              <h3 className="font-semibold text-sm text-foreground mb-4">Your Details</h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Rahul Sharma" error={!!form.formState.errors.name} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="rahul@example.com" error={!!form.formState.errors.email} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="9876543210" error={!!form.formState.errors.phone} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CouponInput
                    coupon={coupon}
                    loading={couponLoading}
                    error={couponError}
                    onApply={applyCoupon}
                    onRemove={() => { setCoupon(null); setCouponError('') }}
                  />

                  {/* Order summary — mobile only, shown inline before pay button */}
                  <div className="lg:hidden space-y-4 pt-1">
                    <PriceSummary session={booking.session} coupon={coupon} />
                  </div>

                  {payError && <p className="text-sm text-destructive text-center">{payError}</p>}

                  <Button type="submit" loading={payLoading} className="w-full h-12">
                    {payLoading ? 'Processing…' : 'Pay & Confirm Booking'}
                  </Button>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    Secured by Razorpay. Your data is safe and encrypted.
                  </p>
                </form>
              </Form>
            </Card>

            {/* Right column — order summary (desktop, sticky) */}
            <div className="hidden lg:block sticky top-24 space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-sm text-foreground mb-4">Booking Summary</h3>
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="w-4 h-4 text-primary-400" />
                    <span className="font-medium text-foreground">{booking.session.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    <span>
                      {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary-400" />
                    <span>{booking.slot} • {booking.session.durationMinutes} minutes</span>
                  </div>
                </div>
                <PriceSummary session={booking.session} coupon={coupon} />
              </Card>

              <div className="flex items-center gap-2.5 text-xs text-muted-foreground px-1">
                <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                Free rescheduling up to 24 hours before your session.
              </div>
            </div>

            {/* Booking summary — mobile only, shown above the form */}
            <Card className="p-4 lg:hidden order-first">
              <h3 className="font-semibold text-sm text-foreground mb-3">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4 text-primary-400" />
                  <span className="font-medium text-foreground">{booking.session.title}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  <span>
                    {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary-400" />
                  <span>{booking.slot} • {booking.session.durationMinutes} minutes</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
