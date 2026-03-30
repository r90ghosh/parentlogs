import Link from 'next/link'
import { BookOpen, Clock, Lock } from 'lucide-react'
import type { Article } from '@/lib/content'

interface ArticleCardProps {
  article: Article
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
}

export function ArticleCard({ article }: ArticleCardProps) {
  const colors = stageColors[article.stage] || { bg: 'bg-[--card]', text: 'text-[--muted]' }

  // Create a display badge (e.g., "Week 24" or stage label)
  const badge = article.week ? `Week ${article.week}` : article.stageLabel

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group relative flex flex-col p-6 rounded-2xl bg-[--surface]/50 border border-[--border] hover:border-[--border-hover] transition-all duration-300"
    >
      {/* Stage badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`font-ui px-2.5 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
          {badge}
        </span>
        {article.isFree ? (
          <span className="font-ui px-2 py-0.5 rounded text-xs font-medium bg-sage/10 text-sage">
            FREE
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded font-ui text-xs font-medium bg-[--card]/50 text-[--muted]">
            <Lock className="h-3 w-3" />
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-semibold text-[--white] mb-2 group-hover:text-copper transition-colors line-clamp-2">
        {article.title}
      </h3>

      {/* Excerpt */}
      <p className="font-body text-sm text-[--muted] line-clamp-3 flex-1 mb-4">{article.excerpt}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[--border]/50">
        <div className="flex items-center gap-1.5 text-[--dim]">
          <BookOpen className="h-3.5 w-3.5" />
          <span className="font-ui text-xs">Article</span>
        </div>
        <div className="flex items-center gap-1.5 text-[--dim]">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-ui text-xs">{article.readTime} min read</span>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-copper/5 to-transparent" />
    </Link>
  )
}
