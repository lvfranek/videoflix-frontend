import Hls from 'hls.js'
import { useEffect, useRef, type RefObject } from 'react'

type Callbacks = {
  onReady?: () => void
  onError?: () => void
}

/**
 * Plays an HLS stream in a <video>. Uses hls.js where possible and the
 * browser's native HLS support (Safari, iOS) otherwise. Auth cookies are
 * sent with every playlist and segment request.
 */
export function useHls(videoRef: RefObject<HTMLVideoElement | null>, src: string | null, callbacks: Callbacks = {}) {
  const callbacksRef = useRef(callbacks)

  useEffect(() => {
    callbacksRef.current = callbacks
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return
    const ready = () => callbacksRef.current.onReady?.()
    const fail = () => callbacksRef.current.onError?.()

    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          xhr.withCredentials = true
        },
      })
      hls.on(Hls.Events.MANIFEST_PARSED, ready)
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) fail()
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', ready, { once: true })
      video.addEventListener('error', fail, { once: true })
      return () => {
        video.removeEventListener('loadedmetadata', ready)
        video.removeEventListener('error', fail)
        video.removeAttribute('src')
        video.load()
      }
    }

    fail()
  }, [videoRef, src])
}
