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
    setMentor(res.mentor)
    return res.mentor
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
