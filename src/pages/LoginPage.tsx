import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { ApiError } from '../api/client'
import { AuthCard } from '../components/AuthCard'
import { Field } from '../components/Field'
import { setCurrentUser } from '../lib/storage'
import { useForm } from '../lib/useForm'
import { validateEmail, validateRequired, type Errors } from '../lib/validation'
import { useToast } from '../toast/ToastContext'

type LoginValues = { email: string; password: string }

function validate(values: LoginValues): Errors<LoginValues> {
  return { email: validateEmail(values.email), password: validateRequired(values.password) }
}

const LOGIN_ERRORS: Record<string, string> = {
  'Invalid email or password.': 'E-Mail oder Passwort ist falsch.',
  'Please activate your account first.': 'Bitte aktiviere zuerst dein Konto über den Link in der E-Mail.',
}

export function LoginPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const { values, errors, handleChange, handleBlur, checkAll } = useForm<LoginValues>(
    { email: '', password: '' },
    validate,
  )
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!checkAll()) return

    setPending(true)
    try {
      const { user } = await login(values.email.trim(), values.password)
      setCurrentUser(user.id)
      navigate('/videos')
    } catch (error) {
      const message =
        error instanceof ApiError
          ? (LOGIN_ERRORS[error.message] ?? 'Anmeldung fehlgeschlagen.')
          : 'Keine Verbindung zum Server.'
      showToast('error', message)
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthCard title="Anmelden">
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
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />
        <button type="submit" className="btn btn-brand" disabled={pending}>
          {pending ? 'Anmelden...' : 'Anmelden'}
        </button>
      </form>

      <p className="links">
        <Link to="/forgot-password">Passwort vergessen?</Link>
      </p>
      <p className="links">
        Neu bei Videoflix? <Link to="/register">Jetzt registrieren</Link>
      </p>
    </AuthCard>
  )
}
