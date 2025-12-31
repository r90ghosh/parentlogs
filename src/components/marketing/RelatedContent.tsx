'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ArticleCard } from './ArticleCard'
import type { Article } from '@/lib/content'

interface RelatedContentProps {
  articles: Article[]
  currentStage: string
}

export function RelatedContent({ articles, currentStage }: RelatedContentProps) {
  if (articles.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Related Articles</h2>
        <Link
          href={`/resources?stage=${currentStage}`}
          className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
