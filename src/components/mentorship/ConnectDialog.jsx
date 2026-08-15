import { useEffect, useState } from 'react'
import { CheckCircle2, IndianRupee, Sparkles, Clock } from 'lucide-react'
import { getChatPricing, createChatOrder, verifyChatPayment } from '../../api/chatOrders'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import Button from '../ui/Button'
import { LoadingState } from '../ui/States'

const TIER_LABEL = {
  free: 'Your first chat is free',
  discount: 'Special ₹5 second-chat offer',
  paid: 'Standard pricing',
}

export default function ConnectDialog({ mentor, open, onOpenChange }) {
  const [step, setStep] = useState('loading')
  const [pricing, setPricing] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !mentor) return
    setStep('loading')
    setError('')
    getChatPricing(mentor._id)
      .then((data) => {
        setPricing(data)
        setStep('confirm')
      })
      .catch(() => {
        setError('Could not load pricing. Please try again.')
        setStep('error')
      })
  }, [open, mentor])

  const handleConfirm = async () => {
    setStep('processing')
    setError('')
    try {
      const result = await createChatOrder(mentor._id)

      if (!result.requiresPayment) {
        setStep('success')
        return
      }

      const options = {
        key: result.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.amount,
        currency: result.currency || 'INR',
        order_id: result.orderId,
        name: 'GuideUp',
        description: `Chat with ${mentor.name}`,
        theme: { color: '#f97316' },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. You can try again.')
            setStep('confirm')
          },
        },
        handler: async (response) => {
          try {
            await verifyChatPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
            setStep('success')
          } catch {
            setError('Payment verification failed. Contact support.')
            setStep('error')
          }
        },
      }

      const launch = () => {
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', () => {
          setError('Payment failed. Please try again.')
          setStep('confirm')
        })
        rzp.open()
      }

      if (window.Razorpay) {
        launch()
      } else {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = launch
        script.onerror = () => {
          setError('Could not load payment gateway. Please refresh.')
          setStep('error')
        }
        document.body.appendChild(script)
      }
    } catch {
      setError('Could not start the chat. Please try again.')
      setStep('error')
    }
  }

  if (!mentor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {step === 'success' ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <DialogTitle className="mb-2">You're connected!</DialogTitle>
            <DialogDescription>
              {mentor.name} will reach out to you shortly to start your chat. Keep an eye on your email and phone.
            </DialogDescription>
            <Button className="w-full h-11 mt-6" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Connect with {mentor.name}</DialogTitle>
              <DialogDescription>A 2-minute chat to get you started.</DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mentor.photoUrl} alt={mentor.name} />
                <AvatarFallback>{mentor.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-foreground text-sm">{mentor.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 2 min chat
                </div>
              </div>
            </div>

            {step === 'loading' && <LoadingState label="Checking your pricing…" className="py-6" />}

            {(step === 'confirm' || step === 'processing') && pricing && (
              <div className="rounded-xl bg-secondary/40 p-4 mb-2">
                {pricing.tier !== 'paid' && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-success mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> {TIER_LABEL[pricing.tier]}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chat price</span>
                  <div className="flex items-baseline gap-2">
                    {pricing.tier !== 'paid' && (
                      <span className="text-sm text-muted-foreground line-through flex items-center">
                        <IndianRupee className="w-3 h-3" />{pricing.originalPrice}
                      </span>
                    )}
                    <span className="text-lg font-bold text-foreground flex items-center">
                      {pricing.effectivePrice === 0 ? 'FREE' : <><IndianRupee className="w-4 h-4" />{pricing.effectivePrice}</>}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive text-center mb-2">{error}</p>}

            <DialogFooter>
              <Button
                onClick={handleConfirm}
                loading={step === 'processing'}
                disabled={step === 'loading' || !pricing}
                className="w-full h-11"
              >
                {pricing?.effectivePrice === 0 ? 'Confirm Free Chat' : 'Confirm & Pay'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
