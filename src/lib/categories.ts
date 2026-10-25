import type { Video } from '../api/videos'
import type { ProgressMap } from './useWatchProgress'

const CATEGORY_LABELS: Record<string, string> = {
  Action: 'Action',
  Documentary: 'Dokumentation',
  Drama: 'Drama',
  Romance: 'Romantik',
}

const NEW_DAYS = 5
const DAY_MS = 24 * 60 * 60 * 1000

export function categoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category
}

export type VideoRow = { title: string; videos: Video[]; resume?: boolean }

/**
 * "Weiterschauen" (started videos, last watched first), "Meine Liste",
 * "Neu auf Videoflix" (last 5 days, like the original app) and one row per category.
 */
export function buildRows(videos: Video[], progress: ProgressMap = {}, myList: number[] = []): VideoRow[] {
  const started = videos
    .filter((video) => progress[video.id])
    .sort((a, b) => progress[b.id].updatedAt - progress[a.id].updatedAt)

  const saved = myList
    .map((id) => videos.find((video) => video.id === id))
    .filter((video): video is Video => Boolean(video))

  const since = Date.now() - NEW_DAYS * DAY_MS
  const fresh = videos.filter((video) => new Date(video.created_at).getTime() >= since)

  const byCategory = new Map<string, Video[]>()
  for (const video of videos) {
    byCategory.set(video.category, [...(byCategory.get(video.category) ?? []), video])
  }

  const rows = [...byCategory].map(([category, list]) => ({ title: categoryLabel(category), videos: list }))
  return [
    ...(started.length ? [{ title: 'Weiterschauen', videos: started, resume: true }] : []),
    ...(saved.length ? [{ title: 'Meine Liste', videos: saved }] : []),
    ...(fresh.length ? [{ title: 'Neu auf Videoflix', videos: fresh }] : []),
    ...rows,
  ]
}

/** Videos whose title, description or category contain the search text. */
export function searchVideos(videos: Video[], query: string) {
  const needle = query.trim().toLocaleLowerCase('de')
  if (!needle) return []
  return videos.filter((video) =>
    [video.title, video.description, video.category, categoryLabel(video.category)].some((text) =>
      text.toLocaleLowerCase('de').includes(needle),
    ),
  )
}
