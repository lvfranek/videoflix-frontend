// Same rules as the original Videoflix frontend

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const MIN_PASSWORD_LENGTH = 8

export type Errors<T> = Partial<Record<keyof T, string>>

export function hasErrors<T>(errors: Errors<T>) {
  return Object.values(errors).some(Boolean)
}

export function validateEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim()) ? '' : 'Bitte eine gültige E-Mail-Adresse eingeben.'
}

export function validateNewPassword(value: string) {
  return value.trim().length >= MIN_PASSWORD_LENGTH ? '' : 'Mindestens 8 Zeichen.'
}

export function validateRepeat(password: string, repeat: string) {
  return password.trim() === repeat.trim() ? '' : 'Die Passwörter stimmen nicht überein.'
}

export function validateRequired(value: string) {
  return value.trim() ? '' : 'Bitte ausfüllen.'
}
