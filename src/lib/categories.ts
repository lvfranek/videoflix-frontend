import type { Video } from '../api/videos'

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

export type VideoRow = { title: string; videos: Video[] }

/** "Neu auf Videoflix" (last 5 days, like the original app) plus one row per category. */
export function buildRows(videos: Video[]): VideoRow[] {
  const since = Date.now() - NEW_DAYS * DAY_MS
  const fresh = videos.filter((video) => new Date(video.created_at).getTime() >= since)

  const byCategory = new Map<string, Video[]>()
  for (const video of videos) {
    byCategory.set(video.category, [...(byCategory.get(video.category) ?? []), video])
  }

  const rows = [...byCategory].map(([category, list]) => ({ title: categoryLabel(category), videos: list }))
  return fresh.length ? [{ title: 'Neu auf Videoflix', videos: fresh }, ...rows] : rows
}
