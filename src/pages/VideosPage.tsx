import { useCallback, useEffect, useMemo, useState } from 'react'
import { getVideos, type Video } from '../api/videos'
import { Hero } from '../components/Hero'
import { VideoPlayer } from '../components/VideoPlayer'
import { VideoRow } from '../components/VideoRow'
import { buildRows } from '../lib/categories'
import { useMyList } from '../lib/useMyList'
import { useWatchProgress } from '../lib/useWatchProgress'
import { useToast } from '../toast/ToastContext'
import styles from './VideosPage.module.css'

type Playing = { video: Video; startAt: number }

export function VideosPage() {
  const showToast = useToast()
  const { progress, saveProgress } = useWatchProgress()
  const { myList, toggleMyList } = useMyList()
  const [videos, setVideos] = useState<Video[] | null>(null)
  const [selected, setSelected] = useState<Video | null>(null)
  const [playing, setPlaying] = useState<Playing | null>(null)

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch(() => {
        setVideos([])
        showToast('error', 'Die Videos konnten nicht geladen werden.')
      })
  }, [showToast])

  const rows = useMemo(() => buildRows(videos ?? [], progress, myList), [videos, progress, myList])
  const featured = selected ?? videos?.[0] ?? null
  const closePlayer = useCallback(() => setPlaying(null), [])

  /** Starts a video where it was left, or from the beginning. */
  function play(video: Video) {
    setPlaying({ video, startAt: progress[video.id]?.time ?? 0 })
  }

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
      <Hero
        key={featured.id}
        video={featured}
        watched={progress[featured.id]}
        inMyList={myList.includes(featured.id)}
        onPlay={() => play(featured)}
        onToggleMyList={() => toggleMyList(featured.id)}
      />
      <div className={styles.rows}>
        {rows.map((row) => (
          <VideoRow
            key={row.title}
            row={row}
            selectedId={featured.id}
            progress={progress}
            myList={myList}
            onToggleMyList={(video) => toggleMyList(video.id)}
            // In "Weiterschauen" a click continues right away, elsewhere it shows the video in the hero
            onSelect={row.resume ? play : handleSelect}
          />
        ))}
      </div>
      {playing && (
        <VideoPlayer
          video={playing.video}
          startAt={playing.startAt}
          onClose={closePlayer}
          onProgress={(time, duration) => saveProgress(playing.video.id, time, duration)}
        />
      )}
    </>
  )
}
