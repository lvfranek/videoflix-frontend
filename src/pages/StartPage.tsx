import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../lib/validation'
import styles from './StartPage.module.css'

export function StartPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const message = validateEmail(email)
    setError(message)
    if (!message) navigate('/register', { state: { email: email.trim() } })
  }

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Filme und Dokus. Jederzeit.</h1>
        <p>Streame alle Videos in 480p, 720p oder 1080p, passend zu deiner Verbindung.</p>

        <form className={styles.signup} onSubmit={handleSubmit} noValidate>
          <label htmlFor="start-email" className={styles.srOnly}>
            E-Mail-Adresse
          </label>
          <input
            id="start-email"
            type="email"
            placeholder="E-Mail-Adresse"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'start-email-error' : undefined}
          />
          <button type="submit" className="btn btn-brand">
            Jetzt registrieren
          </button>
        </form>
        {error && (
          <p id="start-email-error" className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
