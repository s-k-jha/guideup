import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { getSocket, disconnectSocket } from '../../lib/socket'
import { useToast } from '../../hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import Button from '../ui/Button'
import { LoadingState, ErrorState } from '../ui/States'

const CHAT_SECONDS = 120

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Shared real-time chat UI for both the student and mentor side. The caller
 * supplies the role-appropriate token + REST fetchers; this component owns
 * the socket connection, message list, and send flow.
 *
 * The 2-minute timer is server-authoritative (see socketService.js): it only
 * starts once BOTH participants have joined the room, so whoever arrives
 * first waits without burning down the clock, and it can't be skipped by a
 * disconnect. `onEnded` fires once, with the last known order, when the chat
 * transitions to ended — the student page uses it to offer a wallet top-up.
 */
export default function ChatRoom({ chatOrderId, token, role, fetchOrder, fetchMessages, backHref, otherPartyLabel, onEnded }) {
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [joined, setJoined] = useState(false)
  const [endsAt, setEndsAt] = useState(null)
  const [ended, setEnded] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(CHAT_SECONDS)
  const scrollRef = useRef(null)
  const orderRef = useRef(null)

  useEffect(() => {
    orderRef.current = order
  }, [order])

  const chatActive = !!endsAt && !ended
  const waitingLabel = role === 'user' ? 'your mentor' : 'the student'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchOrder(chatOrderId), fetchMessages(chatOrderId)])
      .then(([orderData, messagesData]) => {
        if (cancelled) return
        setOrder(orderData)
        setMessages(messagesData)
        setEnded(orderData.status === 'completed')
      })
      .catch(() => !cancelled && setAuthError('Could not load this chat. You may not have access to it.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [chatOrderId])

  useEffect(() => {
    if (!token || authError) return
    const socket = getSocket(token)

    const onMessage = (msg) => {
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]))
    }

    const onPartnerJoined = ({ endsAt: newEndsAt } = {}) => {
      const partnerName =
        role === 'user' ? orderRef.current?.mentorId?.name : orderRef.current?.userId?.name
      toast({
        title: `${partnerName || (role === 'user' ? 'Your mentor' : 'The student')} joined the chat`,
        variant: 'success',
      })
      if (newEndsAt) setEndsAt(newEndsAt)
    }

    const onChatEnded = () => setEnded(true)

    socket.on('chat:message', onMessage)
    socket.on('chat:partnerJoined', onPartnerJoined)
    socket.on('chat:ended', onChatEnded)

    socket.emit('chat:join', { chatOrderId }, (ack) => {
      if (ack?.error) {
        setAuthError(ack.error)
        return
      }
      setJoined(true)
      if (ack?.ended) {
        setEnded(true)
        return
      }
      if (ack?.endsAt) setEndsAt(ack.endsAt)
    })

    return () => {
      socket.off('chat:message', onMessage)
      socket.off('chat:partnerJoined', onPartnerJoined)
      socket.off('chat:ended', onChatEnded)
      disconnectSocket()
    }
  }, [chatOrderId, token, authError])

  // Countdown is derived from the server's endsAt on every tick rather than
  // a locally-armed decrement, so it can't drift and stays paused (no badge
  // shown at all) until endsAt exists — i.e. until both sides have joined.
  useEffect(() => {
    if (!endsAt || ended) return
    const tick = () => {
      const remaining = Math.max(0, Math.round((endsAt - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining <= 0) setEnded(true)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [endsAt, ended])

  useEffect(() => {
    if (ended) onEnded?.(orderRef.current)
  }, [ended])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || sending || ended) return
    if (!chatActive) {
      toast({ title: `Please wait — ${waitingLabel} hasn't joined yet`, variant: 'destructive' })
      return
    }
    setSending(true)
    const socket = getSocket(token)
    socket.emit('chat:message', { chatOrderId, text }, (ack) => {
      setSending(false)
      if (ack?.error) return
      setInput('')
      if (ack?.message) {
        setMessages((prev) => (prev.some((m) => m._id === ack.message._id) ? prev : [...prev, ack.message]))
      }
    })
  }

  if (loading) {
    return <LoadingState className="min-h-[60vh]" label="Loading chat…" />
  }

  if (authError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <ErrorState title="Can't open this chat" description={authError} />
      </div>
    )
  }

  const otherName = role === 'user' ? order?.mentorId?.name : order?.userId?.name
  const otherPhoto = role === 'user' ? order?.mentorId?.photoUrl : undefined

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to={backHref} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-foreground/70" />
          </Link>
          <Avatar className="h-9 w-9">
            <AvatarImage src={otherPhoto} alt={otherName} />
            <AvatarFallback>{otherName?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground truncate">{otherName || otherPartyLabel}</div>
            <div className="text-xs text-muted-foreground">
              {ended ? 'Chat ended' : chatActive ? 'Connected' : joined ? `Waiting for ${waitingLabel}…` : 'Connecting…'}
            </div>
          </div>
          {chatActive && (
            <span className="flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full shrink-0">
              <Clock className="w-3 h-3" /> {formatCountdown(secondsLeft)}
            </span>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 py-6 space-y-3">
        {joined && !endsAt && !ended && (
          <div className="text-center text-sm text-muted-foreground py-10 flex flex-col items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Waiting for {waitingLabel} to join…
          </div>
        )}
        {(chatActive || ended) && messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-10">Say hi to start the conversation.</div>
        )}
        {messages.map((m) => {
          const isMine = m.senderRole === role
          return (
            <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={
                  isMine
                    ? 'max-w-[75%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 text-sm'
                    : 'max-w-[75%] rounded-2xl rounded-bl-md bg-card border border-border text-foreground px-4 py-2.5 text-sm'
                }
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <span className={`block text-[10px] mt-1 ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {formatTime(m.createdAt)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-card border-t border-border sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {ended ? (
            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground py-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> This chat has ended.
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={chatActive ? 'Type a message…' : joined ? `Waiting for ${waitingLabel}…` : 'Connecting…'}
                rows={1}
                className="flex-1 resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 max-h-28"
              />
              <Button size="icon" onClick={handleSend} disabled={!chatActive || !input.trim()} loading={sending} aria-label="Send">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
