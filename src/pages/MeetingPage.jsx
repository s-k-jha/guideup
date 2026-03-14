import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMeetingInfo } from "../api/meeting"

export default function MeetingPage() {

  const { bookingId } = useParams()

  const [meetingLink, setMeetingLink] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [canJoin, setCanJoin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMeetingInfo()
  }, [])

  const fetchMeetingInfo = async () => {
    try {

      const res = await getMeetingInfo(bookingId)

      const { meetingLink, date, startTime } = res.data

      setMeetingLink(meetingLink)

      const sessionStart = new Date(`${date}T${startTime}`)
      setStartTime(sessionStart)

    } catch (err) {

      setError("Unable to load session")

    }
  }

  useEffect(() => {

    if (!startTime) return

    const interval = setInterval(() => {

      const now = new Date()

      const diff = startTime - now

      const joinAllowed = startTime - (5 * 60 * 1000)

      if (now >= joinAllowed) {
        setCanJoin(true)
      }

      if (diff <= 0) {
        setTimeLeft("Session started")
      } else {

        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)

        setTimeLeft(`${minutes}m ${seconds}s`)

      }

    }, 1000)

    return () => clearInterval(interval)

  }, [startTime])

  const handleJoin = () => {

    if (!canJoin) return

    window.location.href = meetingLink

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          GuideUp Session
        </h1>

        {timeLeft && (
          <p className="text-gray-500 mb-6">
            Session starts in {timeLeft}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleJoin}
          disabled={!canJoin}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            canJoin
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {canJoin ? "Join Session" : "Join available 5 minutes before"}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Please do not share this session link with anyone.
        </p>

      </div>

    </div>

  )
}