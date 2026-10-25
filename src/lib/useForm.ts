import { useState, type ChangeEvent } from 'react'
import { hasErrors, type Errors } from './validation'

type Values = Record<string, string | boolean>

/** Small form helper: values, errors on blur and a submit check. */
export function useForm<T extends Values>(initial: T, validate: (values: T) => Errors<T>) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Errors<T>>({})

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = event.target
    const next = { ...values, [name]: type === 'checkbox' ? checked : value }
    setValues(next)
    // Checkboxes have no blur moment that matters, so validate them right away
    if (type === 'checkbox') setErrors({ ...errors, [name]: validate(next)[name as keyof T] })
  }

  function handleBlur(name: keyof T) {
    setErrors({ ...errors, [name]: validate(values)[name] })
  }

  /** Validates everything and returns true when the form can be sent. */
  function checkAll() {
    const nextErrors = validate(values)
    setErrors(nextErrors)
    return !hasErrors(nextErrors)
  }

  return { values, errors, handleChange, handleBlur, checkAll }
}
