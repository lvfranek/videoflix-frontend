// localStorage can be blocked (private mode, settings), so every access is guarded

const USER_KEY = 'videoflix:user'

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Not saved; the app keeps working without it
  }
}

/** The logged-in user's id, so several accounts on one browser keep separate data. */
export function setCurrentUser(id: number) {
  writeJson(USER_KEY, id)
}

/** Builds a storage key that belongs to the current user. */
export function userKey(name: string) {
  return `videoflix:${name}:${readJson<number | 'guest'>(USER_KEY, 'guest')}`
}
