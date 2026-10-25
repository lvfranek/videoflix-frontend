import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { confirmPasswordReset } from '../api/auth'
import { ApiError } from '../api/client'
import { AuthCard } from '../components/AuthCard'
import { Field } from '../components/Field'
import { useForm } from '../lib/useForm'
import { validateNewPassword, validateRepeat, type Errors } from '../lib/validation'
import { useToast } from '../toast/ToastContext'

type PasswordValues = { password: string; repeat: string }

function validate(values: PasswordValues): Errors<PasswordValues> {
  return {
    password: validateNewPassword(values.password),
    repeat: validateRepeat(values.password, values.repeat),
  }
}

const RESET_ERRORS: Record<string, string> = {
  'This reset link is invalid or has expired.': 'Der Link ist ungültig oder abgelaufen. Fordere einfach einen neuen an.',
  'Passwords do not match.': 'Die Passwörter stimmen nicht überein.',
}

/** Opened from the reset email: /pages/auth/confirm_password.html?uid=...&token=... */
export function ConfirmPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const uid = params.get('uid')
  const token = params.get('token')
  const { values, errors, handleChange, handleBlur, checkAll } = useForm<PasswordValues>(
    { password: '', repeat: '' },
    validate,
  )
  const [pending, setPending] = useState(false)

  if (!uid || !token) {
    return (
      <AuthCard title="Ungültiger Link." lead="Dieser Link ist unvollständig. Fordere einfach einen neuen an.">
        <Link to="/forgot-password" className="btn btn-brand">
          Neuen Link anfordern
        </Link>
      </AuthCard>
    )
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!checkAll() || !uid || !token) return

    setPending(true)
    try {
      await confirmPasswordReset(uid, token, values.password.trim(), values.repeat.trim())
      showToast('success', 'Dein Passwort wurde geändert. Du kannst dich jetzt anmelden.')
      navigate('/login')
    } catch (error) {
      const message =
        error instanceof ApiError
          ? (RESET_ERRORS[error.message] ?? 'Das Passwort ist zu einfach. Bitte wähle ein anderes.')
          : 'Keine Verbindung zum Server.'
      showToast('error', message)
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthCard title="Neues Passwort" lead="Wähle ein neues Passwort mit mindestens 8 Zeichen.">
      <form onSubmit={handleSubmit} noValidate>
        <Field
          id="password"
          name="password"
          type="password"
          label="Neues Passwort"
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
        <button type="submit" className="btn btn-brand" disabled={pending}>
          {pending ? 'Wird gespeichert...' : 'Passwort speichern'}
        </button>
      </form>
    </AuthCard>
  )
}
