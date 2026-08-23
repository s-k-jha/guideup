import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackVisit } from '../lib/trackVisit'

export default function VisitorTracker() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    trackVisit(pathname + search)
  }, [pathname, search])
  return null
}
