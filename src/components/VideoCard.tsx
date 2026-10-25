import type { Video } from '../api/videos'
import type { Progress } from '../lib/useWatchProgress'
import { CheckIcon, PlusIcon } from './icons'
import styles from './VideoCard.module.css'

type VideoCardProps = {
  video: Video
  watched?: Progress
  showRemaining?: boolean
  inMyList: boolean
  onSelect: (video: Video) => void
  onToggleMyList: (video: Video) => void
}

/** Thumbnail card with progress bar and a +/check button for "Meine Liste". */
export function VideoCard({
  video,
  watched,
  showRemaining = false,
  inMyList,
  onSelect,
  onToggleMyList,
}: VideoCardProps) {
  return (
    <div className={styles.item}>
      <button
        type="button"
        className={styles.card}
        onClick={() => onSelect(video)}
      >
        <span className={styles.thumb}>
          <img src={video.thumbnail_url} alt="" loading="lazy" />
          {watched && (
            <span className={styles.progress} aria-hidden="true">
              <span style={{ width: `${(watched.time / watched.duration) * 100}%` }} />
            </span>
          )}
        </span>
        <span className={styles.title}>{video.title}</span>
        {showRemaining && watched && (
          <span className={styles.remaining}>
            Noch {Math.max(1, Math.round((watched.duration - watched.time) / 60))} Min.
          </span>
        )}
      </button>
      <button
        type="button"
        className={inMyList ? `${styles.listButton} ${styles.inList}` : styles.listButton}
        onClick={() => onToggleMyList(video)}
        aria-pressed={inMyList}
        aria-label={inMyList ? `${video.title} aus Meiner Liste entfernen` : `${video.title} zu Meiner Liste hinzufügen`}
      >
        {inMyList ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
      </button>
    </div>
  )
}
