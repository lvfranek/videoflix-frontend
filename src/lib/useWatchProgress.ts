import { useCallback, useState } from 'react'
import { readJson, userKey, writeJson } from './storage'

export type Progress = { time: number; duration: number; updatedAt: number }
export type ProgressMap = Record<number, Progress>

const MIN_SECONDS = 5
const FINISHED_TAIL_SECONDS = 20

/** Remembers how far each video was watched, per user, in localStorage. */
export function useWatchProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => readJson(userKey('progress'), {}))

  const saveProgress = useCallback((videoId: number, time: number, duration: number) => {
    if (!duration) return
    setProgress((current) => {
      const next = { ...current }
      const finished = time >= duration - FINISHED_TAIL_SECONDS
      // Barely started or watched to the end: nothing to continue
      if (time < MIN_SECONDS || finished) delete next[videoId]
      else next[videoId] = { time, duration, updatedAt: Date.now() }
      writeJson(userKey('progress'), next)
      return next
    })
  }, [])

  return { progress, saveProgress }
}
