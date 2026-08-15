import { useParams } from 'react-router-dom'
import Seo from '../../lib/seo'
import ChatRoom from '../../components/chat/ChatRoom'
import { getChatOrderAsMentor, getChatMessagesAsMentor } from '../../api/chat'

export default function MentorChatPage() {
  const { chatOrderId } = useParams()

  return (
    <>
      <Seo title="Chat" path={`/mentor/chat/${chatOrderId}`} noindex />
      <ChatRoom
        chatOrderId={chatOrderId}
        token={localStorage.getItem('mentor_token')}
        role="mentor"
        fetchOrder={getChatOrderAsMentor}
        fetchMessages={getChatMessagesAsMentor}
        backHref="/mentor/dashboard"
        otherPartyLabel="Student"
      />
    </>
  )
}
