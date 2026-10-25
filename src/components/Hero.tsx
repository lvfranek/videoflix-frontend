import { useRef, useState } from 'react'
import { getStreamUrl, type Video } from '../api/videos'
import { categoryLabel } from '../lib/categories'
import { useHls } from '../lib/useHls'
import styles from './Hero.module.css'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Featured video: thumbnail first, then a muted preview in 480p fades in. */
export function Hero({ video, onPlay }: { video: Video; onPlay: () => void }) {
  const previewRef = useRef<HTMLVideoElement>(null)
  const [reduced] = useState(prefersReducedMotion)
  const [previewing, setPreviewing] = useState<number | null>(null)

  useHls(previewRef, reduced ? null : getStreamUrl(video.id, '480p'), {
    onReady: () => {
      previewRef.current?.play().catch(() => {
        // Autoplay can be blocked; the thumbnail simply stays visible
      })
    },
  })

  return (
    <section className={styles.hero}>
      <img className={styles.backdrop} src={video.thumbnail_url} alt="" />
      {!reduced && (
        <video
          key={video.id}
          ref={previewRef}
          className={previewing === video.id ? `${styles.preview} ${styles.visible}` : styles.preview}
          muted
          loop
          playsInline
          aria-hidden="true"
          onPlaying={() => setPreviewing(video.id)}
        />
      )}

      <div className={styles.content}>
        <p className={styles.tag}>
          <span>{categoryLabel(video.category)}</span>
        </p>
        <h1>{video.title}</h1>
        <p className={styles.description}>{video.description}</p>
        <button type="button" className="btn btn-play" onClick={onPlay}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
          </svg>
          Abspielen
        </button>
      </div>
    </section>
  )
}
