import { useRef, useState } from 'react'
import { getStreamUrl, type Video } from '../api/videos'
import { categoryLabel } from '../lib/categories'
import type { Progress } from '../lib/useWatchProgress'
import { useHls } from '../lib/useHls'
import { CheckIcon, PlayIcon, PlusIcon } from './icons'
import styles from './Hero.module.css'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type HeroProps = {
  video: Video
  /** Saved position, turns the button into "Weiterschauen" */
  watched?: Progress
  inMyList: boolean
  onPlay: () => void
  onToggleMyList: () => void
}

/** Featured video: thumbnail first, then a muted preview in 480p fades in. */
export function Hero({ video, watched, inMyList, onPlay, onToggleMyList }: HeroProps) {
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
        <div className={styles.actions}>
          <button type="button" className="btn btn-play" onClick={onPlay}>
            <PlayIcon size={18} />
            {watched ? 'Weiterschauen' : 'Abspielen'}
          </button>
          <button type="button" className="btn btn-glass" onClick={onToggleMyList} aria-pressed={inMyList}>
            {inMyList ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
            Meine Liste
          </button>
        </div>
        {watched && (
          <div className={styles.resume}>
            <span className={styles.resumeBar}>
              <span style={{ width: `${(watched.time / watched.duration) * 100}%` }} />
            </span>
            Noch {Math.max(1, Math.round((watched.duration - watched.time) / 60))} Min.
          </div>
        )}
      </div>
    </section>
  )
}
