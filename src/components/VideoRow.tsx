import { useCallback, useEffect, useRef, useState } from 'react'
import type { Video } from '../api/videos'
import type { VideoRow as Row } from '../lib/categories'
import type { ProgressMap } from '../lib/useWatchProgress'
import { BackIcon, CheckIcon, ChevronRightIcon, PlusIcon } from './icons'
import styles from './VideoRow.module.css'

type VideoRowProps = {
  row: Row
  selectedId?: number
  progress: ProgressMap
  myList: number[]
  onSelect: (video: Video) => void
  onToggleMyList: (video: Video) => void
}

/** One horizontally scrolling row with arrows and faded edges where more videos are hidden. */
export function VideoRow({ row, selectedId, progress, myList, onSelect, onToggleMyList }: VideoRowProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateEdges = useCallback(() => {
    const list = listRef.current
    if (!list) return
    setCanLeft(list.scrollLeft > 4)
    setCanRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 4)
  }, [])

  // Recheck when the window or the number of videos changes
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(list)
    return () => observer.disconnect()
  }, [updateEdges, row.videos.length])

  function scrollByPage(direction: 1 | -1) {
    const list = listRef.current
    if (!list) return
    list.scrollBy({ left: direction * list.clientWidth * 0.85, behavior: 'smooth' })
  }

  const viewportClass = [styles.viewport, canLeft && styles.fadeLeft, canRight && styles.fadeRight]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={styles.row} aria-label={row.title}>
      <h2>{row.title}</h2>
      <div className={viewportClass}>
        {canLeft && (
          <button type="button" className={`${styles.arrow} ${styles.left}`} onClick={() => scrollByPage(-1)} aria-label="Zurückblättern">
            <BackIcon size={28} />
          </button>
        )}
        <ul ref={listRef} className={styles.list} onScroll={updateEdges}>
          {row.videos.map((video) => {
            const watched = progress[video.id]
            const saved = myList.includes(video.id)
            return (
              <li key={video.id} className={styles.item}>
                <button
                  type="button"
                  className={video.id === selectedId ? `${styles.card} ${styles.selected}` : styles.card}
                  onClick={() => onSelect(video)}
                  aria-pressed={video.id === selectedId}
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
                  {row.resume && watched && (
                    <span className={styles.remaining}>
                      Noch {Math.max(1, Math.round((watched.duration - watched.time) / 60))} Min.
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className={saved ? `${styles.listButton} ${styles.inList}` : styles.listButton}
                  onClick={() => onToggleMyList(video)}
                  aria-pressed={saved}
                  aria-label={saved ? `${video.title} aus Meiner Liste entfernen` : `${video.title} zu Meiner Liste hinzufügen`}
                >
                  {saved ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
                </button>
              </li>
            )
          })}
        </ul>
        {canRight && (
          <button type="button" className={`${styles.arrow} ${styles.right}`} onClick={() => scrollByPage(1)} aria-label="Weiterblättern">
            <ChevronRightIcon size={28} />
          </button>
        )}
      </div>
    </section>
  )
}
