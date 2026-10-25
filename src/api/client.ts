export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown) {
    super(getMessage(data) ?? `Request failed (${status})`)
    this.status = status
    this.data = data
  }
}

/** Reads the error text from {detail}, {message} or DRF field errors like {non_field_errors: [...]}. */
function getMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  for (const value of Object.values(data)) {
    if (typeof value === 'string') return value
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  }
  return undefined
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
}

function send(endpoint: string, { method = 'GET', body }: RequestOptions = {}) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (!response.ok) throw new ApiError(response.status, data)
  return data as T
}

/** Request without token refresh, for the auth endpoints. */
export async function request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return parse<T>(await send(endpoint, options))
}

async function refreshToken(): Promise<boolean> {
  try {
    const response = await send('token/refresh/', { method: 'POST' })
    return response.ok
  } catch {
    return false
  }
}

const isAuthError = (status: number) => status === 401 || status === 403

/**
 * Request for protected endpoints. On 401/403 it refreshes the token once
 * and retries; if that fails too, the user is sent to the login page.
 */
export async function apiFetch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  let response = await send(endpoint, options)

  if (isAuthError(response.status)) {
    if (await refreshToken()) response = await send(endpoint, options)
    if (isAuthError(response.status)) {
      window.location.assign('/login')
      throw new ApiError(response.status, null)
    }
  }

  return parse<T>(response)
}
