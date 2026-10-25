import { useState, type InputHTMLAttributes } from 'react'
import styles from './Field.module.css'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
}

/** Labeled input with error text. Password fields get a show/hide toggle. */
export function Field({ id, label, error, type = 'text', ...inputProps }: FieldProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const errorId = `${id}-error`

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.control}>
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
          >
            {visible ? 'Verbergen' : 'Zeigen'}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
