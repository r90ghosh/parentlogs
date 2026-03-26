'use client'

import { Video, Play, ExternalLink } from 'lucide-react'
import type { Video as VideoType } from '@/lib/content'

interface VideoCardProps {
  video: VideoType
}

const stageColors: Record<string, { bg: string; text: string }> = {
  'first-trimester': { bg: 'bg-rose-500/10', text: 'text-rose-400' },
  'second-trimester': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'third-trimester': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'delivery': { bg: 'bg-copper/10', text: 'text-copper' },
  'fourth-trimester': { bg: 'bg-sage/10', text: 'text-sage' },
  '3-6-months': { bg: 'bg-sky/10', text: 'text-sky' },
  '6-12-months': { bg: 'bg-sky/10', text: 'text-sky' },
  '12-18-months': { bg: 'bg-copper/10', text: 'text-copper' },
  '18-24-months': { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  'cross-phase': { bg: 'bg-[--card]', text: 'text-[--muted]' },
}

export function VideoCard({ video }: VideoCardProps) {
  const colors = stageColors[video.stage] || { bg: 'bg-[--card]', text: 'text-[--muted]' }

  // Default thumbnail for non-YouTube videos
  const thumbnail =
    video.thumbnail || '/images/video-placeholder.jpg'

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-2xl bg-[--surface]/50 border border-[--border] hover:border-[--border-hover] transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[--card] overflow-hidden">
        {video.youtubeId ? (
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[--card] to-[--surface]">
            <Video className="h-12 w-12 text-[--dim]" />
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-copper flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>

        {/* FREE badge */}
        <div className="absolute top-3 right-3">
          <span className="font-ui px-2 py-0.5 rounded text-xs font-medium bg-sage text-white">
            FREE
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5 flex-1">
        {/* Stage badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`font-ui px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
            {video.stageLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-semibold text-[--white] mb-2 group-hover:text-copper transition-colors line-clamp-2">
          {video.title}
        </h3>

        {/* Description */}
        <p className="font-body text-sm text-[--muted] line-clamp-2 flex-1 mb-3">{video.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[--border]/50">
          <div className="flex items-center gap-1.5 text-[--dim]">
            <Video className="h-3.5 w-3.5" />
            <span className="font-ui text-xs">{video.source}</span>
          </div>
          <div className="flex items-center gap-1 text-[--dim] group-hover:text-copper transition-colors">
            <span className="font-ui text-xs">Watch</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-copper/5 to-transparent" />
    </a>
  )
}
