import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { register } from '../api/auth'
import { ApiError } from '../api/client'
import { AuthCard } from '../components/AuthCard'
import { Field } from '../components/Field'
import { useForm } from '../lib/useForm'
import { validateEmail, validateNewPassword, validateRepeat, type Errors } from '../lib/validation'
import { useToast } from '../toast/ToastContext'
import styles from './RegisterPage.module.css'

type RegisterValues = { email: string; password: string; repeat: string; privacy: boolean }

function validate(values: RegisterValues): Errors<RegisterValues> {
  return {
    email: validateEmail(values.email),
    password: validateNewPassword(values.password),
    repeat: validateRepeat(values.password, values.repeat),
    privacy: values.privacy ? '' : 'Bitte akzeptiere die Datenschutzerklärung.',
  }
}

export function RegisterPage() {
  const location = useLocation()
  const showToast = useToast()
  const prefilledEmail = (location.state as { email?: string } | null)?.email ?? ''
  const { values, errors, handleChange, handleBlur, checkAll } = useForm<RegisterValues>(
    { email: prefilledEmail, password: '', repeat: '', privacy: false },
    validate,
  )
  const [pending, setPending] = useState(false)
  const [sentTo, setSentTo] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!checkAll()) return

    setPending(true)
    try {
      await register(values.email.trim(), values.password.trim(), values.repeat.trim())
      setSentTo(values.email.trim())
    } catch (error) {
      // The backend answers every input problem (e.g. email taken) with one generic message
      showToast(
        'error',
        error instanceof ApiError
          ? 'Registrierung fehlgeschlagen. Ist die E-Mail vielleicht schon registriert?'
          : 'Keine Verbindung zum Server.',
      )
    } finally {
      setPending(false)
    }
  }

  if (sentTo) {
    return (
      <AuthCard title="Prüfe dein Postfach." lead={`Wir haben einen Aktivierungslink an ${sentTo} geschickt.`}>
        <p className={styles.hint}>
          Klicke auf den Link in der E-Mail, um dein Konto zu aktivieren. Danach kannst du dich anmelden.
          Schau auch im Spam-Ordner nach.
        </p>
        <Link to="/login" className="btn btn-brand">
          Zur Anmeldung
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Konto erstellen" lead="Nur noch ein paar Angaben, dann kann es losgehen.">
      <form onSubmit={handleSubmit} noValidate>
        <Field
          id="email"
          name="email"
          type="email"
          label="E-Mail"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          error={errors.email}
        />
        <Field
          id="password"
          name="password"
          type="password"
          label="Passwort"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />
        <Field
          id="repeat"
          name="repeat"
          type="password"
          label="Passwort wiederholen"
          autoComplete="new-password"
          value={values.repeat}
          onChange={handleChange}
          onBlur={() => handleBlur('repeat')}
          error={errors.repeat}
        />

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="privacy"
            checked={values.privacy}
            onChange={handleChange}
            aria-invalid={Boolean(errors.privacy)}
          />
          <span>
            Ich habe die <Link to="/privacy">Datenschutzerklärung</Link> gelesen.
          </span>
        </label>
        {errors.privacy && <p className={styles.checkboxError}>{errors.privacy}</p>}

        <button type="submit" className="btn btn-brand" disabled={pending}>
          {pending ? 'Wird erstellt...' : 'Registrieren'}
        </button>
      </form>

      <p className="links">
        Schon ein Konto? <Link to="/login">Anmelden</Link>
      </p>
    </AuthCard>
  )
}
