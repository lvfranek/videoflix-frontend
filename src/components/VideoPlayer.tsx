import { useEffect, useRef, useState } from 'react'
import { getStreamUrl, RESOLUTIONS, type Resolution, type Video } from '../api/videos'
import { useHls } from '../lib/useHls'
import styles from './VideoPlayer.module.css'

/** Full-screen player with a quality switch that keeps the playback position. */
export function VideoPlayer({ video, onClose }: { video: Video; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const resumeAt = useRef(0)
  const [resolution, setResolution] = useState<Resolution>('720p')
  const [failed, setFailed] = useState(false)

  useHls(videoRef, getStreamUrl(video.id, resolution), {
    onReady: () => {
      const player = videoRef.current
      if (!player) return
      player.currentTime = resumeAt.current
      player.play().catch(() => {
        // Autoplay blocked: the user starts it with the controls
      })
    },
    onError: () => setFailed(true),
  })

  // Esc closes the player, the page behind it must not scroll
  useEffect(() => {
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  function changeResolution(next: Resolution) {
    resumeAt.current = videoRef.current?.currentTime ?? 0
    setFailed(false)
    setResolution(next)
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={video.title}>
      <div className={styles.topBar}>
        <button ref={closeRef} type="button" className="btn btn-glass" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Zurück
        </button>
        <h2>{video.title}</h2>
        <div className={styles.quality} role="group" aria-label="Qualität">
          {RESOLUTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={option === resolution ? styles.active : undefined}
              aria-pressed={option === resolution}
              onClick={() => changeResolution(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <video ref={videoRef} className={styles.video} controls playsInline poster={video.thumbnail_url} />

      {failed && (
        <p className={styles.error} role="alert">
          Das Video konnte nicht geladen werden. Versuch eine andere Qualität oder später noch einmal.
        </p>
      )}
    </div>
  )
}
