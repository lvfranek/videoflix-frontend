import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../api/auth'
import { AuthCard } from '../components/AuthCard'
import { Field } from '../components/Field'
import { useForm } from '../lib/useForm'
import { validateEmail, type Errors } from '../lib/validation'
import { useToast } from '../toast/ToastContext'

type ForgotValues = { email: string }

function validate(values: ForgotValues): Errors<ForgotValues> {
  return { email: validateEmail(values.email) }
}

export function ForgotPasswordPage() {
  const showToast = useToast()
  const { values, errors, handleChange, handleBlur, checkAll } = useForm<ForgotValues>({ email: '' }, validate)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!checkAll()) return

    setPending(true)
    try {
      await requestPasswordReset(values.email.trim())
      setSent(true)
    } catch {
      showToast('error', 'Das hat nicht geklappt. Bitte versuch es später noch einmal.')
    } finally {
      setPending(false)
    }
  }

  if (sent) {
    return (
      <AuthCard
        title="E-Mail ist unterwegs."
        lead="Wenn zu dieser Adresse ein Konto existiert, bekommst du gleich einen Link zum Zurücksetzen."
      >
        <Link to="/login" className="btn btn-brand">
          Zur Anmeldung
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Passwort vergessen?" lead="Gib deine E-Mail ein. Wir schicken dir einen Link für ein neues Passwort.">
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
        <button type="submit" className="btn btn-brand" disabled={pending}>
          {pending ? 'Wird gesendet...' : 'Link senden'}
        </button>
      </form>
      <p className="links">
        <Link to="/login">Zurück zur Anmeldung</Link>
      </p>
    </AuthCard>
  )
}
