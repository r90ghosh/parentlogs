'use client'

import Link from 'next/link'
import { BookOpen, Clock, Lock } from 'lucide-react'
import type { Article } from '@/lib/content'

interface ArticleCardProps {
  article: Article
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
}

export function ArticleCard({ article }: ArticleCardProps) {
  const colors = stageColors[article.stage] || { bg: 'bg-slate-500/10', text: 'text-slate-400' }

  // Create a display badge (e.g., "Week 24" or stage label)
  const badge = article.week ? `Week ${article.week}` : article.stageLabel

  return (
    <Link
      href={`/resources/articles/${article.slug}`}
      className="group relative flex flex-col p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
    >
      {/* Stage badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
          {badge}
        </span>
        {article.isFree ? (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">
            FREE
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-700/50 text-slate-400">
            <Lock className="h-3 w-3" />
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
        {article.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-slate-400 line-clamp-3 flex-1 mb-4">{article.excerpt}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="flex items-center gap-1.5 text-slate-500">
          <BookOpen className="h-3.5 w-3.5" />
          <span className="text-xs">Article</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs">{article.readTime} min read</span>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-amber-500/5 to-transparent" />
    </Link>
  )
}
