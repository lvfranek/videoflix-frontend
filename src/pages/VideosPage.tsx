import { useCallback, useEffect, useMemo, useState } from 'react'
import { getVideos, type Video } from '../api/videos'
import { Hero } from '../components/Hero'
import { VideoPlayer } from '../components/VideoPlayer'
import { VideoRow } from '../components/VideoRow'
import { buildRows } from '../lib/categories'
import { useToast } from '../toast/ToastContext'
import styles from './VideosPage.module.css'

export function VideosPage() {
  const showToast = useToast()
  const [videos, setVideos] = useState<Video[] | null>(null)
  const [selected, setSelected] = useState<Video | null>(null)
  const [playing, setPlaying] = useState<Video | null>(null)

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch(() => {
        setVideos([])
        showToast('error', 'Die Videos konnten nicht geladen werden.')
      })
  }, [showToast])

  const rows = useMemo(() => buildRows(videos ?? []), [videos])
  const featured = selected ?? videos?.[0] ?? null
  const closePlayer = useCallback(() => setPlaying(null), [])

  function handleSelect(video: Video) {
    setSelected(video)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (videos === null) {
    return <div className={styles.loading} aria-busy="true" aria-label="Videos werden geladen" />
  }

  if (!featured) {
    return (
      <section className={styles.empty}>
        <h1>Noch keine Videos.</h1>
        <p>Sobald neue Videos hochgeladen sind, findest du sie hier.</p>
      </section>
    )
  }

  return (
    <>
      <Hero key={featured.id} video={featured} onPlay={() => setPlaying(featured)} />
      <div className={styles.rows}>
        {rows.map((row) => (
          <VideoRow key={row.title} row={row} selectedId={featured.id} onSelect={handleSelect} />
        ))}
      </div>
      {playing && <VideoPlayer video={playing} onClose={closePlayer} />}
    </>
  )
}
