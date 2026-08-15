import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Seo from '../lib/seo'
import ChatRoom from '../components/chat/ChatRoom'
import { getChatOrderAsUser, getChatMessagesAsUser } from '../api/chat'
import { LoadingState } from '../components/ui/States'

export default function ChatPage() {
  const { chatOrderId } = useParams()
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!user) navigate('/talk-to-mentor')
  }, [user, loading, navigate])

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
      />
    </>
  )
}
