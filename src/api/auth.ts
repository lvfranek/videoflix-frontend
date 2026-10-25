import { request } from './client'

export function register(email: string, password: string, confirmedPassword: string) {
  return request<{ user: { id: number; email: string } }>('register/', {
    method: 'POST',
    body: { email, password, confirmed_password: confirmedPassword },
  })
}

export function activate(uid: string, token: string) {
  return request<{ message: string }>(`activate/${uid}/${token}/`)
}

export function login(email: string, password: string) {
  return request<{ detail: string }>('login/', { method: 'POST', body: { email, password } })
}

export function logout() {
  return request<{ detail: string }>('logout/', { method: 'POST' })
}

export function requestPasswordReset(email: string) {
  return request<{ detail: string }>('password_reset/', { method: 'POST', body: { email } })
}

export function confirmPasswordReset(
  uid: string,
  token: string,
  newPassword: string,
  confirmPassword: string,
) {
  return request<{ detail: string }>(`password_confirm/${uid}/${token}/`, {
    method: 'POST',
    body: { new_password: newPassword, confirm_password: confirmPassword },
  })
}
