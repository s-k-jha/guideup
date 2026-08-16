import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/use-toast'
import { getMinRecharge } from '../api/wallet'
import { createChatOrder } from '../api/chatOrders'
import Seo from '../lib/seo'
import ChatRoom from '../components/chat/ChatRoom'
import ChatReviewDialog from '../components/chat/ChatReviewDialog'
import { getChatOrderAsUser, getChatMessagesAsUser } from '../api/chat'
import { LoadingState } from '../components/ui/States'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/Dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import WalletRechargeDialog from '../components/wallet/WalletRechargeDialog'

export default function ChatPage() {
  const { chatOrderId } = useParams()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [endedMentor, setEndedMentor] = useState(null)
  const [promptOpen, setPromptOpen] = useState(false)
  const [checkingBalance, setCheckingBalance] = useState(false)
  const [rechargeOpen, setRechargeOpen] = useState(false)
  const [rechargeInfo, setRechargeInfo] = useState(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewOrder, setReviewOrder] = useState(null)

  useEffect(() => {
    if (loading) return
    if (!user) navigate('/talk-to-mentor')
  }, [user, loading, navigate])

  // Reset the "continue chatting" prompt whenever we land on a fresh chat
  // order (e.g. right after restarting into a new one).
  useEffect(() => {
    setEndedMentor(null)
    setPromptOpen(false)
    setRechargeOpen(false)
    setReviewOpen(false)
    setReviewOrder(null)
  }, [chatOrderId])

  // The review prompt takes priority when the chat ends — it's quick and
  // optional, and only offered for whichever half (mentor/platform) this
  // chat hasn't already collected. The "keep chatting" prompt follows once
  // the student is done with (or skips) the review, so they're never
  // stacked on top of each other.
  const handleChatEnded = (order) => {
    const mentor = order?.mentorId
    if (!mentor?._id) return
    setEndedMentor(mentor)
    if (!order.mentorReviewed || !order.platformReviewed) {
      setReviewOrder(order)
      setReviewOpen(true)
    } else {
      setPromptOpen(true)
    }
  }

  const handleReviewDone = () => {
    setPromptOpen(true)
  }

  const openRecharge = async () => {
    setCheckingBalance(true)
    try {
      const info = await getMinRecharge(endedMentor._id)
      setRechargeInfo(info)
      setPromptOpen(false)
      setRechargeOpen(true)
    } catch {
      toast({ title: 'Could not check your wallet balance. Please try again.', variant: 'destructive' })
    }
    setCheckingBalance(false)
  }

  const handleRechargeSuccess = async () => {
    setRechargeOpen(false)
    try {
      const result = await createChatOrder(endedMentor._id)
      navigate(`/chat/${result.chatOrder._id}`, { replace: true })
    } catch (err) {
      toast({
        title:
          err?.response?.data?.message ||
          `Could not reconnect with ${endedMentor?.name || 'your mentor'}. Please try again from Talk to a Mentor.`,
        variant: 'destructive',
      })
    }
  }

  if (loading || !user) {
    return <LoadingState className="min-h-screen" label="Loading…" />
  }

  return (
    <>
      <Seo title="Chat" path={`/chat/${chatOrderId}`} noindex />
      <ChatRoom
        chatOrderId={chatOrderId}
        token={localStorage.getItem('user_token')}
        role="user"
        fetchOrder={getChatOrderAsUser}
        fetchMessages={getChatMessagesAsUser}
        backHref="/my-chats"
        otherPartyLabel="Your mentor"
        onEnded={handleChatEnded}
      />

      <ChatReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        chatOrder={reviewOrder}
        onDone={handleReviewDone}
      />

      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent>
          <div className="text-center py-2">
            <Avatar className="h-14 w-14 mx-auto mb-4">
              <AvatarImage src={endedMentor?.photoUrl} alt={endedMentor?.name} />
              <AvatarFallback>{endedMentor?.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <DialogTitle className="mb-2">Chat ended</DialogTitle>
            <DialogDescription>
              Your time with {endedMentor?.name || 'your mentor'} is up. Recharge your wallet to keep the
              conversation going, right now.
            </DialogDescription>
            <div className="flex flex-col gap-2 mt-6">
              <Button className="h-11" onClick={openRecharge} loading={checkingBalance}>
                <Wallet className="w-4 h-4" /> Recharge & Continue
              </Button>
              <Button variant="ghost" className="h-11" onClick={() => setPromptOpen(false)}>
                Not now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WalletRechargeDialog
        open={rechargeOpen}
        onOpenChange={setRechargeOpen}
        suggestedAmount={rechargeInfo?.min5MinAmount}
        minAmount={rechargeInfo?.min5MinAmount}
        context={
          rechargeInfo
            ? `Continuing with ${endedMentor?.name} needs at least ₹${rechargeInfo.min5MinAmount} (5 min of talk time). Your wallet has ₹${rechargeInfo.walletBalance}.`
            : undefined
        }
        onSuccess={handleRechargeSuccess}
      />
    </>
  )
}
