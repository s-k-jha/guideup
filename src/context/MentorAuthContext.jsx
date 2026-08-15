import { createContext, useContext, useEffect, useState } from 'react'
import { getMentorMe, loginMentor } from '../api/mentorAuth'

const MentorAuthContext = createContext(null)

export function MentorAuthProvider({ children }) {
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = () => getMentorMe().then(setMentor).catch(() => {})

  useEffect(() => {
    const token = localStorage.getItem('mentor_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMentorMe()
      .then(setMentor)
      .catch(() => localStorage.removeItem('mentor_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (data) => {
    const res = await loginMentor(data)
    localStorage.setItem('mentor_token', res.token)
    // The login response only carries a minimal subset (id/name/email/type/
    // status) — fetch the full profile so the dashboard form isn't blank.
    const full = await getMentorMe()
    setMentor(full)
    return full
  }

  const logout = () => {
    localStorage.removeItem('mentor_token')
    setMentor(null)
  }

  return (
    <MentorAuthContext.Provider value={{ mentor, setMentor, loading, login, logout, refresh, isAuthenticated: !!mentor }}>
      {children}
    </MentorAuthContext.Provider>
  )
}

export function useMentorAuth() {
  const ctx = useContext(MentorAuthContext)
  if (!ctx) throw new Error('useMentorAuth must be used within MentorAuthProvider')
  return ctx
}
