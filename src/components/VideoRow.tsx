import type { Video } from '../api/videos'
import type { VideoRow as Row } from '../lib/categories'
import styles from './VideoRow.module.css'

type VideoRowProps = {
  row: Row
  selectedId?: number
  onSelect: (video: Video) => void
}

/** One horizontally scrolling row of video cards. */
export function VideoRow({ row, selectedId, onSelect }: VideoRowProps) {
  return (
    <section className={styles.row} aria-label={row.title}>
      <h2>{row.title}</h2>
      <ul className={styles.list}>
        {row.videos.map((video) => (
          <li key={video.id}>
            <button
              type="button"
              className={video.id === selectedId ? `${styles.card} ${styles.selected}` : styles.card}
              onClick={() => onSelect(video)}
              aria-pressed={video.id === selectedId}
            >
              <span className={styles.thumb}>
                <img src={video.thumbnail_url} alt="" loading="lazy" />
              </span>
              <span className={styles.title}>{video.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
