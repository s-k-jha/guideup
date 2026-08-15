import { createContext, lazy, Suspense, useCallback, useContext, useRef, useState } from 'react'
import { useAuth } from './AuthContext'

const AuthDialog = lazy(() => import('../components/auth/AuthDialog'))

const AuthDialogContext = createContext(null)

export function AuthDialogProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const pendingCallback = useRef(null)

  const openAuthDialog = useCallback(() => setOpen(true), [])

  const requireAuth = useCallback((onAuthenticated) => {
    if (isAuthenticated) {
      onAuthenticated?.()
      return
    }
    pendingCallback.current = onAuthenticated
    setOpen(true)
  }, [isAuthenticated])

  const handleSuccess = (user) => {
    const cb = pendingCallback.current
    pendingCallback.current = null
    cb?.(user)
  }

  return (
    <AuthDialogContext.Provider value={{ requireAuth, openAuthDialog }}>
      {children}
      {open && (
        <Suspense fallback={null}>
          <AuthDialog open={open} onOpenChange={setOpen} onSuccess={handleSuccess} />
        </Suspense>
      )}
    </AuthDialogContext.Provider>
  )
}

export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext)
  if (!ctx) throw new Error('useAuthDialog must be used within AuthDialogProvider')
  return ctx
}
