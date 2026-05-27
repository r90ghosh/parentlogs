import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { BlogPost } from '@/lib/blog'
import { blogCategories, type BlogCategory } from '@/lib/blog'

const heroConfigs: Record<string, { gradient: string; emoji: string; pattern: 'dots' | 'lines' | 'waves' }> = {
  budget: { gradient: 'from-gold/8 to-gold/15', emoji: '💰', pattern: 'dots' },
  guides: { gradient: 'from-copper/8 to-copper/15', emoji: '📋', pattern: 'lines' },
  lifestyle: { gradient: 'from-sage/8 to-sage/15', emoji: '👶', pattern: 'waves' },
}

const patternStyles: Record<string, React.CSSProperties> = {
  dots: {
    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
    backgroundSize: '16px 16px',
  },
  lines: {
    backgroundImage: 'repeating-linear-gradient(135deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 12px)',
  },
  waves: {
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 Q10 0 20 10 T40 10\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
    backgroundSize: '40px 20px',
  },
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const categoryConfig = blogCategories[post.category as BlogCategory] || {
    label: post.category,
    color: 'bg-[--card] text-[--muted]',
  }

  const hero = heroConfigs[post.category] || heroConfigs.guides

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col p-6 rounded-2xl bg-[--surface]/50 border border-[--border] hover:border-[--border-hover] transition-all duration-300"
    >
      {/* Hero visual */}
      <div
        className={cn(
          'relative h-32 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden',
          `bg-gradient-to-r ${hero.gradient}`
        )}
      >
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl select-none opacity-30 transition-transform duration-300 group-hover:scale-110">
          {hero.emoji}
        </span>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={patternStyles[hero.pattern]}
        />
      </div>

      {/* Category + Date */}
      <div className="flex items-center justify-between mb-4">
        <span className={`font-ui px-2.5 py-1 rounded-md text-xs font-medium ${categoryConfig.color}`}>
          {categoryConfig.label}
        </span>
        <time className="font-ui text-xs text-[--dim]" dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-semibold text-[--white] mb-2 group-hover:text-copper transition-colors line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="font-body text-sm text-[--muted] line-clamp-3 flex-1 mb-4">{post.excerpt}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[--border]/50">
        <div className="flex items-center gap-1.5 text-[--dim]">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-ui text-xs">{post.readTime} min read</span>
        </div>
        <span className="flex items-center gap-1 font-ui text-xs text-copper opacity-0 group-hover:opacity-100 transition-opacity">
          Read more
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-copper/5 to-transparent" />
    </Link>
  )
}
