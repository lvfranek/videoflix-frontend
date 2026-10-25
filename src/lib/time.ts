/** Seconds as "4:07" or "1:02:45". */
export function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00'
  const seconds = Math.floor(totalSeconds % 60)
  const minutes = Math.floor((totalSeconds / 60) % 60)
  const hours = Math.floor(totalSeconds / 3600)
  const ss = String(seconds).padStart(2, '0')
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${ss}` : `${minutes}:${ss}`
}
