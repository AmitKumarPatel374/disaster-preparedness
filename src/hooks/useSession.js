import { useState, useEffect } from 'react'
import { getSession } from '../utils/auth'

export function useSession() {
  const [session, setSession] = useState(() => getSession())

  useEffect(() => {
    const updateSession = () => {
      const newSession = getSession()
      console.log('Session updated:', newSession)
      setSession(newSession)
    }

    // Listen for storage changes (when user logs in/out or changes location)
    window.addEventListener('storage', updateSession)
    
    // Listen for visibility change (when user switches back to tab)
    document.addEventListener('visibilitychange', updateSession)

    // Cleanup
    return () => {
      window.removeEventListener('storage', updateSession)
      document.removeEventListener('visibilitychange', updateSession)
    }
  }, [])

  return session
}
