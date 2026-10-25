import { API_BASE_URL, apiFetch } from './client'

export type Video = {
  id: number
  created_at: string
  title: string
  description: string
  thumbnail_url: string
  category: string
}

export const RESOLUTIONS = ['480p', '720p', '1080p'] as const
export type Resolution = (typeof RESOLUTIONS)[number]

export function getVideos() {
  return apiFetch<Video[]>('video/')
}

export function getStreamUrl(id: number, resolution: Resolution) {
  return `${API_BASE_URL}video/${id}/${resolution}/index.m3u8`
}
