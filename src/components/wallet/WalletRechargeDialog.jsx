import { useEffect, useState } from 'react'
import { IndianRupee, Wallet, CheckCircle2 } from 'lucide-react'
import { createRechargeOrder, verifyRecharge } from '../../api/wallet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog'
import Button from '../ui/Button'
import Input from '../ui/Input'

const QUICK_AMOUNTS = [49, 99, 199, 499]

/**
 * Generic wallet top-up dialog. If `suggestedAmount` is passed (e.g. the
 * shortfall needed for a specific mentor's 5-minute minimum), it's
 * pre-filled and explained; otherwise the user picks a free amount.
 */
export default function WalletRechargeDialog({ open, onOpenChange, suggestedAmount, context, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState('form')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setAmount(suggestedAmount ? String(suggestedAmount) : '')
      setStep('form')
      setError('')
    }
  }, [open, suggestedAmount])

  const launchRazorpay = (result, amt) => {
    const options = {
      key: result.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: result.amount,
      currency: result.currency || 'INR',
      order_id: result.orderId,
      name: 'GuideUp Wallet',
      description: `Wallet recharge of ₹${amt}`,
      theme: { color: '#f97316' },
      modal: {
        ondismiss: () => {
          setError('Payment cancelled. You can try again.')
          setStep('form')
        },
      },
      handler: async (response) => {
        try {
          await verifyRecharge({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })
          setStep('success')
          onSuccess?.()
        } catch {
          setError('Payment verification failed. Contact support.')
          setStep('form')
        }
      },
    }

    const launch = () => {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.')
        setStep('form')
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
        setStep('form')
      }
      document.body.appendChild(script)
    }
  }

  const handleRecharge = async () => {
    const amt = Number(amount)
    if (!amt || amt < 10) {
      setError('Enter at least ₹10')
      return
    }
    setError('')
    setStep('processing')
    try {
      const result = await createRechargeOrder(amt)
      launchRazorpay(result, amt)
    } catch {
      setError('Could not start recharge. Please try again.')
      setStep('form')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {step === 'success' ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <DialogTitle className="mb-2">Wallet recharged!</DialogTitle>
            <DialogDescription>You're all set to connect with a mentor.</DialogDescription>
            <Button className="w-full h-11 mt-6" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary-600" /> Recharge Wallet
              </DialogTitle>
              <DialogDescription>
                {context || 'Add money to your GuideUp wallet to start chatting with mentors.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(String(a))}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${String(a) === amount ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-border text-muted-foreground hover:bg-secondary'}`}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>

              <Input
                type="number"
                icon={IndianRupee}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <DialogFooter>
              <Button onClick={handleRecharge} loading={step === 'processing'} className="w-full h-11">
                Recharge ₹{amount || '0'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
