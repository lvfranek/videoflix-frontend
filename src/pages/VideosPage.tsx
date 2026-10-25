import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getVideos, type Video } from '../api/videos'
import { Hero } from '../components/Hero'
import { VideoCard } from '../components/VideoCard'
import { VideoInfoModal } from '../components/VideoInfoModal'
import { VideoPlayer } from '../components/VideoPlayer'
import { VideoRow } from '../components/VideoRow'
import { buildRows, searchVideos } from '../lib/categories'
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
  const [info, setInfo] = useState<Video | null>(null)
  const [playing, setPlaying] = useState<Playing | null>(null)
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch(() => {
        setVideos([])
        showToast('error', 'Die Videos konnten nicht geladen werden.')
      })
  }, [showToast])

  const rows = useMemo(() => buildRows(videos ?? [], progress, myList), [videos, progress, myList])
  const results = useMemo(() => searchVideos(videos ?? [], query), [videos, query])
  const featured = videos?.[0] ?? null
  const closePlayer = useCallback(() => setPlaying(null), [])
  const closeInfo = useCallback(() => setInfo(null), [])
  const toggle = useCallback((video: Video) => toggleMyList(video.id), [toggleMyList])

  /** Starts a video where it was left, or from the beginning. */
  function play(video: Video) {
    setInfo(null)
    setPlaying({ video, startAt: progress[video.id]?.time ?? 0 })
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

  const overlays = (
    <>
      {info && (
        <VideoInfoModal
          video={info}
          videos={videos}
          watched={progress[info.id]}
          inMyList={myList.includes(info.id)}
          onPlay={play}
          onToggleMyList={toggle}
          onShow={setInfo}
          onClose={closeInfo}
        />
      )}
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

  if (query) {
    return (
      <section className={styles.search}>
        <h1>{results.length ? `Ergebnisse für „${query}“` : `Keine Treffer für „${query}“`}</h1>
        {results.length ? (
          <div className={styles.grid}>
            {results.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                watched={progress[video.id]}
                inMyList={myList.includes(video.id)}
                onSelect={setInfo}
                onToggleMyList={toggle}
              />
            ))}
          </div>
        ) : (
          <p className={styles.noResults}>Versuch einen anderen Titel oder eine Kategorie wie „Drama“.</p>
        )}
        {overlays}
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
        onToggleMyList={() => toggle(featured)}
        onInfo={() => setInfo(featured)}
      />
      <div className={styles.rows}>
        {rows.map((row) => (
          <VideoRow
            key={row.title}
            row={row}
            progress={progress}
            myList={myList}
            onToggleMyList={toggle}
            // In "Weiterschauen" a click continues right away, elsewhere it opens the details
            onSelect={row.resume ? play : setInfo}
          />
        ))}
      </div>
      {overlays}
    </>
  )
}
