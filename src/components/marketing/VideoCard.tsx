'use client'

import { Video, Play, ExternalLink } from 'lucide-react'
import type { Video as VideoType } from '@/lib/content'

interface VideoCardProps {
  video: VideoType
}

const stageColors: Record<string, { bg: string; text: string }> = {
  'first-trimester': { bg: 'bg-pink-500/10', text: 'text-pink-400' },
  'second-trimester': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'third-trimester': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'delivery': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'fourth-trimester': { bg: 'bg-green-500/10', text: 'text-green-400' },
  '3-6-months': { bg: 'bg-teal-500/10', text: 'text-teal-400' },
  '6-12-months': { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  '12-18-months': { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  '18-24-months': { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  'cross-phase': { bg: 'bg-slate-500/10', text: 'text-slate-400' },
}

export function VideoCard({ video }: VideoCardProps) {
  const colors = stageColors[video.stage] || { bg: 'bg-slate-500/10', text: 'text-slate-400' }

  // Default thumbnail for non-YouTube videos
  const thumbnail =
    video.thumbnail || '/images/video-placeholder.jpg'

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-800 overflow-hidden">
        {video.youtubeId ? (
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Video className="h-12 w-12 text-slate-600" />
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <Play className="h-6 w-6 text-slate-900 ml-1" fill="currentColor" />
          </div>
        </div>

        {/* FREE badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/90 text-white">
            FREE
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5 flex-1">
        {/* Stage badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
            {video.stageLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
          {video.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 flex-1 mb-3">{video.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Video className="h-3.5 w-3.5" />
            <span className="text-xs">{video.source}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 group-hover:text-amber-400 transition-colors">
            <span className="text-xs">Watch</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-amber-500/5 to-transparent" />
    </a>
  )
}
