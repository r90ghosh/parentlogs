import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import type { BlogPost } from '@/lib/blog'
import { blogCategories, type BlogCategory } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const categoryConfig = blogCategories[post.category as BlogCategory] || {
    label: post.category,
    color: 'bg-[--card] text-[--muted]',
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col p-6 rounded-2xl bg-[--surface]/50 border border-[--border] hover:border-[--border-hover] transition-all duration-300"
    >
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
