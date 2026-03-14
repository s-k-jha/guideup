import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserCheck, Calendar, Clock, Loader2 } from 'lucide-react'
import { getBookings, assignMentor, getMentors } from '../../api/admin'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminBookings() {

  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  const [assignState, setAssignState] = useState({})

  useEffect(() => {

    const fetchData = async () => {

      try {

        const bookingsRes = await getBookings()
        setBookings(bookingsRes.data.bookings || [])

        const mentorsRes = await getMentors()
        setMentors(mentorsRes.data.mentors || [])

      } catch (err) {

        console.error(err)

      } finally {

        setLoading(false)

      }

    }

    fetchData()

  }, [])


  const handleAssign = async (bookingId) => {

    const mentorId = assignState[bookingId]?.input || ''

    if (!mentorId) return

    setAssignState(s => ({
      ...s,
      [bookingId]: { ...s[bookingId], loading: true }
    }))

    try {

      await assignMentor(bookingId, mentorId)

      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId
            ? { ...b, mentorId }
            : b
        )
      )

      setAssignState(s => ({
        ...s,
        [bookingId]: { input: '', loading: false }
      }))

    } catch {

      setAssignState(s => ({
        ...s,
        [bookingId]: { ...s[bookingId], loading: false }
      }))

    }

  }


  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-lg mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-6">

          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <h1 className="font-bold text-xl text-gray-900">
            Bookings
          </h1>

        </div>


        {loading && <LoadingSpinner />}


        {!loading && bookings.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            No bookings yet.
          </div>
        )}


        <div className="space-y-4">

          {bookings.map(b => (

            <div
              key={b._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card space-y-4"
            >

              {/* Student Info */}

              <div className="flex justify-between items-start">

                <div>

                  <div className="font-semibold text-gray-900">
                    {b.userId?.name}
                  </div>

                  <div className="text-xs text-gray-500">
                    {b.userId?.email}
                  </div>

                  <div className="text-xs text-gray-400">
                    {b.userId?.phone}
                  </div>

                </div>


                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full
                    ${b.mentorId
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }
                  `}
                >
                  {b.mentorId ? 'Assigned' : 'Pending'}
                </span>

              </div>


              {/* Session Info */}

              <div className="text-sm font-medium text-gray-800">
                {b.sessionId?.title}
              </div>


              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  {b.date}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-400" />
                  {b.startTime} - {b.endTime}
                </div>

                <div>
                  Duration: {b.sessionId?.durationMinutes} min
                </div>

                <div>
                  Paid: ₹{b.amountPaid}
                </div>

              </div>


              {/* Mentor Assign */}

              {!b.mentorId && (

                <div className="flex gap-2">

                  <select
                    value={assignState[b._id]?.input || ''}
                    onChange={e =>
                      setAssignState(s => ({
                        ...s,
                        [b._id]: {
                          ...s[b._id],
                          input: e.target.value
                        }
                      }))
                    }
                    className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >

                    <option value="">
                      Select mentor
                    </option>

                    {mentors.map(m => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}

                  </select>


                  <button
                    onClick={() => handleAssign(b._id)}
                    disabled={assignState[b._id]?.loading}
                    className="h-10 px-4 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition flex items-center gap-1.5"
                  >

                    {assignState[b._id]?.loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <>
                          <UserCheck className="w-4 h-4" />
                          Assign
                        </>
                    }

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
