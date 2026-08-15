import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, IndianRupee, Sparkles, Clock, Wallet, MessageCircle } from 'lucide-react'
import { getChatPricing, createChatOrder } from '../../api/chatOrders'
import { getMinRecharge } from '../../api/wallet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import Button from '../ui/Button'
import { LoadingState } from '../ui/States'
import WalletRechargeDialog from '../wallet/WalletRechargeDialog'

const TIER_LABEL = {
  free: 'Your first chat is free',
  discount: 'Special ₹5 second-chat offer',
  paid: 'Standard pricing',
}

export default function ConnectDialog({ mentor, open, onOpenChange }) {
  const navigate = useNavigate()
  const [step, setStep] = useState('loading')
  const [pricing, setPricing] = useState(null)
  const [error, setError] = useState('')
  const [rechargeOpen, setRechargeOpen] = useState(false)
  const [rechargeInfo, setRechargeInfo] = useState(null)
  const [chatOrderId, setChatOrderId] = useState(null)

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
      setChatOrderId(result.chatOrder?._id)
      setStep('success')
    } catch (err) {
      if (err?.response?.status === 402) {
        // Wallet balance isn't enough for this chat — offer a recharge
        // sized for at least 5 minutes at this mentor's rate so they
        // don't have to top up again right away.
        try {
          const info = await getMinRecharge(mentor._id)
          setRechargeInfo(info)
          setRechargeOpen(true)
          setStep('confirm')
        } catch {
          setError('Could not check your wallet balance. Please try again.')
          setStep('error')
        }
        return
      }
      setError('Could not start the chat. Please try again.')
      setStep('error')
    }
  }

  const handleRechargeSuccess = () => {
    setRechargeOpen(false)
    // Wallet now has enough — automatically complete the connect.
    handleConfirm()
  }

  if (!mentor) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          {step === 'success' ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-success" />
              </div>
              <DialogTitle className="mb-2">You're connected!</DialogTitle>
              <DialogDescription>
                {mentor.name} has been notified and can join the chat right now.
              </DialogDescription>
              <Button
                className="w-full h-11 mt-6"
                onClick={() => {
                  onOpenChange(false)
                  if (chatOrderId) navigate(`/chat/${chatOrderId}`)
                }}
                disabled={!chatOrderId}
              >
                <MessageCircle className="w-4 h-4" /> Open Chat
              </Button>
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
                  {pricing.effectivePrice > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                      <Wallet className="w-3.5 h-3.5" /> Paid from your GuideUp wallet
                    </div>
                  )}
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
                  {pricing?.effectivePrice === 0 ? 'Confirm Free Chat' : 'Confirm & Connect'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <WalletRechargeDialog
        open={rechargeOpen}
        onOpenChange={setRechargeOpen}
        suggestedAmount={rechargeInfo?.min5MinAmount}
        context={
          rechargeInfo
            ? `You need at least ₹${rechargeInfo.min5MinAmount} (5 min of talk time) to start this chat. Your wallet has ₹${rechargeInfo.walletBalance}.`
            : undefined
        }
        onSuccess={handleRechargeSuccess}
      />
    </>
  )
}
