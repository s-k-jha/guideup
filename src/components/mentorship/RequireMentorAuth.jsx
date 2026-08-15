import { Navigate } from 'react-router-dom'
import { useMentorAuth } from '../../context/MentorAuthContext'
import { LoadingState } from '../ui/States'

export default function RequireMentorAuth({ children }) {
  const { mentor, loading } = useMentorAuth()

  if (loading) return <LoadingState className="min-h-[60vh]" label="Loading…" />
  if (!mentor) return <Navigate to="/mentor/login" replace />
  return children
}
