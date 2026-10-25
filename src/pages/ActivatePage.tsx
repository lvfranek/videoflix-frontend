import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { activate } from '../api/auth'
import { AuthCard } from '../components/AuthCard'

type Status = 'loading' | 'success' | 'error'

/** Opened from the activation email: /pages/auth/activate.html?uid=...&token=... */
export function ActivatePage() {
  const [params] = useSearchParams()
  const uid = params.get('uid')
  const token = params.get('token')
  const [status, setStatus] = useState<Status>(uid && token ? 'loading' : 'error')

  // An activation link works only once, so never send it twice (React dev mode runs effects twice)
  const started = useRef(false)

  useEffect(() => {
    if (!uid || !token || started.current) return
    started.current = true
    activate(uid, token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [uid, token])

  if (status === 'loading') {
    return <AuthCard title="Konto wird aktiviert..." lead="Einen Moment bitte." />
  }

  if (status === 'error') {
    return (
      <AuthCard
        title="Aktivierung fehlgeschlagen."
        lead="Der Link ist ungültig oder wurde schon benutzt. Ist dein Konto schon aktiv, kannst du dich einfach anmelden."
      >
        <Link to="/login" className="btn btn-brand">
          Zur Anmeldung
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Konto aktiviert." lead="Alles bereit. Melde dich an und leg los.">
      <Link to="/login" className="btn btn-brand">
        Jetzt anmelden
      </Link>
    </AuthCard>
  )
}
