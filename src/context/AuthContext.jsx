import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, loginUser, registerUser } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('user_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('user_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (data) => {
    const res = await loginUser(data)
    localStorage.setItem('user_token', res.token)
    setUser(res.user)
    return res.user
  }

  const register = async (data) => {
    const res = await registerUser(data)
    localStorage.setItem('user_token', res.token)
    setUser(res.user)
    return res.user
  }

  const logout = () => {
    localStorage.removeItem('user_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
