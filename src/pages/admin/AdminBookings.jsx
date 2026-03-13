import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserCheck, Calendar, Clock, Loader2 } from 'lucide-react'
import { getBookings, assignMentor } from '../../api/admin'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignState, setAssignState] = useState({}) // { [bookingId]: { input, loading } }

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAssign = async (bookingId) => {
    const mentorName = assignState[bookingId]?.input || ''
    if (!mentorName.trim()) return
    setAssignState(s => ({ ...s, [bookingId]: { ...s[bookingId], loading: true } }))
    try {
      await assignMentor(bookingId, mentorName.trim())
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, mentor: mentorName.trim() } : b))
      setAssignState(s => ({ ...s, [bookingId]: { input: '', loading: false } }))
    } catch {
      setAssignState(s => ({ ...s, [bookingId]: { ...s[bookingId], loading: false } }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-xl text-gray-900">Bookings</h1>
        </div>

        {loading && <LoadingSpinner />}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-16 text-gray-400">No bookings yet.</div>
        )}

        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{b.userName || b.name || 'Student'}</div>
                  <div className="text-xs text-gray-400">{b.email}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${b.mentor ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {b.mentor ? 'Assigned' : 'Pending'}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-primary-400" /> {b.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-primary-400" /> {b.startTime || b.slot}
                </div>
                {b.mentor && (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <UserCheck className="w-4 h-4" /> Mentor: {b.mentor}
                  </div>
                )}
              </div>

              {!b.mentor && (
                <div className="flex gap-2">
                  <input
                    value={assignState[b._id]?.input || ''}
                    onChange={e => setAssignState(s => ({ ...s, [b._id]: { ...s[b._id], input: e.target.value } }))}
                    placeholder="Mentor name"
                    className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                  <button
                    onClick={() => handleAssign(b._id)}
                    disabled={assignState[b._id]?.loading}
                    className="h-10 px-4 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition flex items-center gap-1.5"
                  >
                    {assignState[b._id]?.loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><UserCheck className="w-4 h-4" /> Assign</>}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
