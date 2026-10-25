import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { getStreamUrl, RESOLUTIONS, type Resolution, type Video } from '../api/videos'
import { formatTime } from '../lib/time'
import { useHls } from '../lib/useHls'
import {
  BackIcon,
  ExitFullscreenIcon,
  Forward10Icon,
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PlayIcon,
  Rewind10Icon,
  VolumeIcon,
} from './icons'
import styles from './VideoPlayer.module.css'

const HIDE_CONTROLS_MS = 2500
const SKIP_SECONDS = 10

type PlayerProps = {
  video: Video
  onClose: () => void
  /** Where playback should start, e.g. from "Weiterschauen" */
  startAt?: number
}

/** Full-screen player with custom controls, quality switch and keyboard shortcuts. */
export function VideoPlayer({ video, onClose, startAt = 0 }: PlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const resumeAt = useRef(startAt)
  const hideTimer = useRef<number | undefined>(undefined)

  const [resolution, setResolution] = useState<Resolution>('720p')
  const [qualityOpen, setQualityOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [waiting, setWaiting] = useState(true)
  const [time, setTime] = useState(startAt)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)

  useHls(videoRef, getStreamUrl(video.id, resolution), {
    onReady: () => {
      const player = videoRef.current
      if (!player) return
      player.currentTime = resumeAt.current
      player.play().catch(() => setWaiting(false))
    },
    onError: () => setFailed(true),
  })

  /** Shows the controls and hides them again after a moment while playing. */
  const revealControls = useCallback(() => {
    setControlsVisible(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (!videoRef.current?.paused) {
        setControlsVisible(false)
        setQualityOpen(false)
      }
    }, HIDE_CONTROLS_MS)
  }, [])

  const togglePlay = useCallback(() => {
    const player = videoRef.current
    if (!player) return
    if (player.paused) player.play().catch(() => {})
    else player.pause()
  }, [])

  const skip = useCallback((seconds: number) => {
    const player = videoRef.current
    if (!player) return
    player.currentTime = Math.min(Math.max(player.currentTime + seconds, 0), player.duration || 0)
  }, [])

  const changeVolume = useCallback((next: number) => {
    const player = videoRef.current
    if (!player) return
    player.volume = Math.min(Math.max(next, 0), 1)
    player.muted = player.volume === 0
  }, [])

  const toggleMute = useCallback(() => {
    const player = videoRef.current
    if (!player) return
    player.muted = !player.muted
    if (!player.muted && player.volume === 0) player.volume = 0.5
  }, [])

  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current
    const player = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else if (root?.requestFullscreen) {
      root.requestFullscreen().catch(() => {})
    } else {
      // iPhone Safari only supports fullscreen on the video element itself
      player?.webkitEnterFullscreen?.()
    }
  }, [])

  function changeResolution(next: Resolution) {
    resumeAt.current = videoRef.current?.currentTime ?? 0
    setFailed(false)
    setWaiting(true)
    setQualityOpen(false)
    setResolution(next)
  }

  function updateBuffered() {
    const player = videoRef.current
    if (!player || !player.buffered.length) return
    setBuffered(player.buffered.end(player.buffered.length - 1))
  }

  // Keyboard shortcuts like on YouTube; Esc closes the player (or leaves fullscreen first)
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const onButton = target instanceof HTMLButtonElement || target instanceof HTMLInputElement
      const actions: Record<string, () => void> = {
        ' ': togglePlay,
        k: togglePlay,
        ArrowLeft: () => skip(-SKIP_SECONDS),
        ArrowRight: () => skip(SKIP_SECONDS),
        ArrowUp: () => changeVolume((videoRef.current?.volume ?? 1) + 0.1),
        ArrowDown: () => changeVolume((videoRef.current?.volume ?? 1) - 0.1),
        f: toggleFullscreen,
        m: toggleMute,
      }
      if (event.key === 'Escape') {
        if (!document.fullscreenElement) onClose()
        return
      }
      // Space and arrows already work on focused buttons and sliders
      if (onButton && [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
      const action = actions[event.key]
      if (!action) return
      event.preventDefault()
      action()
      revealControls()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [togglePlay, skip, changeVolume, toggleFullscreen, toggleMute, onClose, revealControls])

  // Page behind the player must not scroll; remember fullscreen changes
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreen)
    rootRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('fullscreenchange', onFullscreen)
      window.clearTimeout(hideTimer.current)
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  const showControls = controlsVisible || !playing || qualityOpen
  const progressStyle = {
    '--played': `${duration ? (time / duration) * 100 : 0}%`,
    '--buffered': `${duration ? (buffered / duration) * 100 : 0}%`,
  } as CSSProperties
  const volumeStyle = { '--played': `${(muted ? 0 : volume) * 100}%`, '--buffered': '0%' } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={showControls ? styles.player : `${styles.player} ${styles.idle}`}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      tabIndex={-1}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
    >
      <video
        ref={videoRef}
        className={styles.video}
        playsInline
        poster={video.thumbnail_url}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => {
          setPlaying(true)
          revealControls()
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onProgress={updateBuffered}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume)
          setMuted(event.currentTarget.muted)
        }}
      />

      {waiting && !failed && <div className={styles.spinner} aria-label="Lädt" role="status" />}

      {!playing && !waiting && !failed && (
        <button type="button" className={styles.bigPlay} onClick={togglePlay} aria-label="Abspielen">
          <PlayIcon size={40} />
        </button>
      )}

      <div className={styles.top}>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Zurück">
          <BackIcon />
        </button>
        <h2>{video.title}</h2>
      </div>

      <div className={styles.bottom}>
        <div className={styles.timeline}>
          <input
            type="range"
            className={styles.range}
            style={progressStyle}
            min={0}
            max={duration || 0}
            step="any"
            value={time}
            onChange={(event) => {
              const player = videoRef.current
              if (player) player.currentTime = Number(event.target.value)
            }}
            aria-label="Position"
            aria-valuetext={`${formatTime(time)} von ${formatTime(duration)}`}
          />
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Abspielen'}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className={styles.iconButton} onClick={() => skip(-SKIP_SECONDS)} aria-label="10 Sekunden zurück">
            <Rewind10Icon />
          </button>
          <button type="button" className={styles.iconButton} onClick={() => skip(SKIP_SECONDS)} aria-label="10 Sekunden vor">
            <Forward10Icon />
          </button>

          <div className={styles.volume}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={toggleMute}
              aria-label={muted || volume === 0 ? 'Ton an' : 'Stumm'}
            >
              {muted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
            </button>
            <input
              type="range"
              className={`${styles.range} ${styles.volumeRange}`}
              style={volumeStyle}
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              aria-label="Lautstärke"
            />
          </div>

          <span className={styles.time}>
            {formatTime(time)} / {formatTime(duration)}
          </span>

          <div className={styles.quality}>
            <button
              type="button"
              className={styles.qualityButton}
              onClick={() => setQualityOpen((open) => !open)}
              aria-expanded={qualityOpen}
              aria-haspopup="true"
              aria-label={`Qualität: ${resolution}`}
            >
              {resolution}
            </button>
            {qualityOpen && (
              <ul className={styles.qualityMenu}>
                {[...RESOLUTIONS].reverse().map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      className={option === resolution ? styles.activeQuality : undefined}
                      aria-pressed={option === resolution}
                      onClick={() => changeResolution(option)}
                    >
                      {option}
                      {option === '1080p' && <span>HD</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleFullscreen}
            aria-label={fullscreen ? 'Vollbild beenden' : 'Vollbild'}
          >
            {fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
          </button>
        </div>
      </div>

      {failed && (
        <p className={styles.error} role="alert">
          Das Video konnte nicht geladen werden. Versuch eine andere Qualität oder später noch einmal.
        </p>
      )}
    </div>
  )
}
