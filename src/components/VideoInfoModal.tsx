import { useEffect, useRef } from 'react'
import type { Video } from '../api/videos'
import { categoryLabel } from '../lib/categories'
import type { Progress } from '../lib/useWatchProgress'
import { CheckIcon, CloseIcon, PlayIcon, PlusIcon } from './icons'
import styles from './VideoInfoModal.module.css'

const MORE_COUNT = 3

type VideoInfoModalProps = {
  video: Video
  videos: Video[]
  watched?: Progress
  inMyList: boolean
  onPlay: (video: Video) => void
  onToggleMyList: (video: Video) => void
  onShow: (video: Video) => void
  onClose: () => void
}

/** Details of one video in a native <dialog>: focus trap and Esc come for free. */
export function VideoInfoModal({
  video,
  videos,
  watched,
  inMyList,
  onPlay,
  onToggleMyList,
  onShow,
  onClose,
}: VideoInfoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const more = videos.filter((other) => other.category === video.category && other.id !== video.id).slice(0, MORE_COUNT)
  const added = new Date(video.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      dialog.close()
    }
  }, [])

  // Switching to another video inside the modal starts at the top again
  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 })
  }, [video.id])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="video-info-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the dark backdrop (the dialog itself, not its content) closes it
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className={styles.panel}>
        <div className={styles.media}>
          <img src={video.thumbnail_url} alt="" />
          <button type="button" className={styles.close} onClick={onClose} aria-label="Schließen">
            <CloseIcon size={22} />
          </button>
          <div className={styles.headline}>
            <h2 id="video-info-title">{video.title}</h2>
            <div className={styles.actions}>
              <button type="button" className="btn btn-play" onClick={() => onPlay(video)}>
                <PlayIcon size={18} />
                {watched ? 'Weiterschauen' : 'Abspielen'}
              </button>
              <button
                type="button"
                className="btn btn-glass"
                onClick={() => onToggleMyList(video)}
                aria-pressed={inMyList}
              >
                {inMyList ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
                Meine Liste
              </button>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.meta}>
            <span className={styles.category}>{categoryLabel(video.category)}</span>
            <span>Hinzugefügt am {added}</span>
            <span>480p · 720p · 1080p</span>
          </p>

          {watched && (
            <div className={styles.progress}>
              <span className={styles.bar}>
                <span style={{ width: `${(watched.time / watched.duration) * 100}%` }} />
              </span>
              Noch {Math.max(1, Math.round((watched.duration - watched.time) / 60))} Min.
            </div>
          )}

          <p className={styles.description}>{video.description}</p>

          {more.length > 0 && (
            <section className={styles.more}>
              <h3>Mehr aus {categoryLabel(video.category)}</h3>
              <ul>
                {more.map((other) => (
                  <li key={other.id}>
                    <button type="button" onClick={() => onShow(other)}>
                      <img src={other.thumbnail_url} alt="" loading="lazy" />
                      <span>{other.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </dialog>
  )
}
