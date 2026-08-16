import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle2, Check, Clock, Loader2, MessageCircle } from 'lucide-react'
import { getSocket, disconnectSocket } from '../../lib/socket'
import { useToast } from '../../hooks/use-toast'
import { cn } from '../../lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import Button from '../ui/Button'
import { Skeleton } from '../ui/Skeleton'
import { ErrorState } from '../ui/States'

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
    return (
      <div className="h-dvh flex flex-col bg-secondary/20">
        <header className="bg-card border-b border-border shrink-0">
          <div className="max-w-2xl mx-auto px-3 sm:px-4 h-16 flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </header>
        <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-12 w-2/3 rounded-2xl rounded-bl-md" />
          <Skeleton className="h-9 w-1/2 rounded-2xl rounded-br-md ml-auto" />
          <Skeleton className="h-16 w-3/4 rounded-2xl rounded-bl-md" />
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="h-dvh flex flex-col bg-secondary/20">
        <header className="bg-card border-b border-border shrink-0">
          <div className="max-w-2xl mx-auto px-3 sm:px-4 h-16 flex items-center gap-3">
            <Link to={backHref} className="p-2 -ml-2 rounded-full hover:bg-secondary active:scale-95 transition-all" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-foreground/70" />
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <ErrorState title="Can't open this chat" description={authError} />
        </div>
      </div>
    )
  }

  const otherName = role === 'user' ? order?.mentorId?.name : order?.userId?.name
  const otherPhoto = role === 'user' ? order?.mentorId?.photoUrl : undefined

  const statusLabel = ended ? 'Chat ended' : chatActive ? 'Connected' : joined ? `Waiting for ${waitingLabel}…` : 'Connecting…'
  const statusDotClass = ended ? 'bg-muted-foreground/40' : chatActive ? 'bg-success' : joined ? 'bg-primary' : 'bg-muted-foreground/40'
  const timerUrgent = secondsLeft <= 20

  return (
    <div className="h-dvh flex flex-col bg-secondary/20">
      <header className="bg-card/95 backdrop-blur-sm border-b border-border shrink-0 z-10">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 h-16 flex items-center gap-3">
          <Link to={backHref} className="p-2 -ml-2 rounded-full hover:bg-secondary active:scale-95 transition-all shrink-0" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-foreground/70" />
          </Link>

          <div className="relative shrink-0">
            <Avatar className="h-10 w-10 ring-2 ring-card shadow-sm">
              <AvatarImage src={otherPhoto} alt={otherName} />
              <AvatarFallback>{otherName?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <span className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card', statusDotClass)}>
              {chatActive && <span className="absolute inset-0 rounded-full bg-success animate-ping" />}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground truncate">{otherName || otherPartyLabel}</div>
            <div className="text-xs text-muted-foreground truncate">{statusLabel}</div>
          </div>

          {chatActive && (
            <span
              className={cn(
                'flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 tabular-nums transition-colors',
                timerUrgent ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary-50 text-primary-700'
              )}
            >
              <Clock className="w-3.5 h-3.5" /> {formatCountdown(secondsLeft)}
            </span>
          )}
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage: 'radial-gradient(rgba(17,24,39,0.05) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      >
        <div className="max-w-2xl w-full mx-auto px-3 sm:px-4 py-6 min-h-full">
          {!joined && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Connecting…</p>
            </div>
          )}

          {joined && !endsAt && !ended && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-fade-in">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-4 ring-card shadow-card">
                  <AvatarImage src={otherPhoto} alt={otherName} />
                  <AvatarFallback className="text-lg">{otherName?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Waiting for {waitingLabel} to join…</p>
                <p className="text-xs text-muted-foreground mt-1">Your timer starts the moment they're in</p>
              </div>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {(chatActive || ended) && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-[220px]">
                Say hi to {otherName || waitingLabel} to start the conversation
              </p>
            </div>
          )}

          <div className="space-y-0.5">
            {messages.map((m, i) => {
              const isMine = m.senderRole === role
              const prev = messages[i - 1]
              const next = messages[i + 1]
              const groupedWithPrev = prev && prev.senderRole === m.senderRole
              const groupedWithNext = next && next.senderRole === m.senderRole

              return (
                <div
                  key={m._id}
                  className={cn('flex items-end gap-2 animate-fade-in', isMine ? 'justify-end' : 'justify-start', groupedWithPrev ? 'mt-0.5' : 'mt-3')}
                >
                  {!isMine &&
                    (groupedWithNext ? (
                      <div className="w-6 shrink-0" />
                    ) : (
                      <Avatar className="h-6 w-6 shrink-0 mb-0.5">
                        <AvatarImage src={otherPhoto} alt={otherName} />
                        <AvatarFallback className="text-[10px]">{otherName?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                    ))}
                  <div
                    className={cn(
                      'max-w-[75%] sm:max-w-[65%] px-4 py-2.5 text-sm shadow-sm rounded-2xl',
                      isMine
                        ? cn('bg-gradient-to-br from-primary to-primary-600 text-primary-foreground', !groupedWithNext && 'rounded-br-md')
                        : cn('bg-card border border-border text-foreground', !groupedWithNext && 'rounded-bl-md')
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{m.text}</p>
                    {!groupedWithNext && (
                      <span
                        className={cn(
                          'flex items-center gap-1 mt-1 text-[10px]',
                          isMine ? 'text-primary-foreground/70 justify-end' : 'text-muted-foreground'
                        )}
                      >
                        {formatTime(m.createdAt)}
                        {isMine && <Check className="w-3 h-3" />}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-card/95 backdrop-blur-sm border-t border-border shrink-0">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3">
          {ended ? (
            <div className="flex items-center gap-2 justify-center text-sm font-medium text-success bg-success/10 rounded-full py-3">
              <CheckCircle2 className="w-4 h-4" /> This chat has ended
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <div
                className={cn(
                  'flex-1 flex items-end rounded-3xl border bg-background transition-colors',
                  chatActive ? 'border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/25' : 'border-border bg-secondary/40'
                )}
              >
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
                  className="flex-1 resize-none bg-transparent px-4 py-2.5 text-sm focus-visible:outline-none disabled:opacity-60 max-h-28 placeholder:text-muted-foreground"
                />
              </div>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!chatActive || !input.trim()}
                loading={sending}
                aria-label="Send"
                className="h-11 w-11 rounded-full shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
