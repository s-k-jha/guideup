import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle2, Clock } from 'lucide-react'
import { getSocket, disconnectSocket } from '../../lib/socket'
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
 */
export default function ChatRoom({ chatOrderId, token, role, fetchOrder, fetchMessages, backHref, otherPartyLabel }) {
  const [order, setOrder] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [joined, setJoined] = useState(false)
  const [ended, setEnded] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(CHAT_SECONDS)
  const scrollRef = useRef(null)
  const timerRef = useRef(null)

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
    return () => { cancelled = true }
  }, [chatOrderId])

  useEffect(() => {
    if (!token || authError) return
    const socket = getSocket(token)

    socket.emit('chat:join', { chatOrderId }, (ack) => {
      if (ack?.error) {
        setAuthError(ack.error)
        return
      }
      setJoined(true)
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
      }, 1000)
    })

    const onMessage = (msg) => {
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]))
    }
    const onEnded = () => setEnded(true)

    socket.on('chat:message', onMessage)
    socket.on('chat:ended', onEnded)

    return () => {
      socket.off('chat:message', onMessage)
      socket.off('chat:ended', onEnded)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [chatOrderId, token, authError])

  useEffect(() => () => disconnectSocket(), [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || ended || sending) return
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
              {ended ? 'Chat ended' : joined ? 'Connected' : 'Connecting…'}
            </div>
          </div>
          {!ended && joined && (
            <span className="flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full shrink-0">
              <Clock className="w-3 h-3" /> {formatCountdown(secondsLeft)}
            </span>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 py-6 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-10">
            Say hi to start the conversation.
          </div>
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
                placeholder={joined ? 'Type a message…' : 'Connecting…'}
                disabled={!joined}
                rows={1}
                className="flex-1 resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 max-h-28"
              />
              <Button size="icon" onClick={handleSend} disabled={!joined || !input.trim()} loading={sending} aria-label="Send">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
