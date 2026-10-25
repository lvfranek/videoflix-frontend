import { useCallback, useState } from 'react'
import { readJson, userKey, writeJson } from './storage'

/** Videos the user saved for later, newest first, per user in localStorage. */
export function useMyList() {
  const [ids, setIds] = useState<number[]>(() => readJson(userKey('my-list'), []))

  const toggle = useCallback((videoId: number) => {
    setIds((current) => {
      const next = current.includes(videoId) ? current.filter((id) => id !== videoId) : [videoId, ...current]
      writeJson(userKey('my-list'), next)
      return next
    })
  }, [])

  return { myList: ids, toggleMyList: toggle }
}
