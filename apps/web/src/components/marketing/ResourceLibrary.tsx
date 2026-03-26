'use client'

import { useState, useMemo } from 'react'
import { BookOpen, Video, Loader2 } from 'lucide-react'
import { ArticleCard } from './ArticleCard'
import { VideoCard } from './VideoCard'
import { Button } from '@/components/ui/button'
import type { Article, Video as VideoType, StageInfo } from '@/lib/content'

interface ResourceLibraryProps {
  articles: Article[]
  videos: VideoType[]
  stages: StageInfo[]
  currentStage: string
  currentFormat: string
  searchQuery: string
  totalArticles: number
  totalVideos: number
}

const ITEMS_PER_PAGE = 12

export function ResourceLibrary({
  articles,
  videos,
  stages,
  currentStage,
  currentFormat,
  searchQuery,
  totalArticles,
  totalVideos,
}: ResourceLibraryProps) {
  const [visibleArticles, setVisibleArticles] = useState(ITEMS_PER_PAGE)
  const [visibleVideos, setVisibleVideos] = useState(ITEMS_PER_PAGE)

  // Combine and interleave articles and videos for "all" format
  const displayedArticles = useMemo(() => articles.slice(0, visibleArticles), [articles, visibleArticles])
  const displayedVideos = useMemo(() => videos.slice(0, visibleVideos), [videos, visibleVideos])

  const hasMoreArticles = visibleArticles < articles.length
  const hasMoreVideos = visibleVideos < videos.length
  const hasMore = currentFormat === 'all'
    ? hasMoreArticles || hasMoreVideos
    : currentFormat === 'articles'
      ? hasMoreArticles
      : hasMoreVideos

  const handleLoadMore = () => {
    if (currentFormat === 'all' || currentFormat === 'articles') {
      setVisibleArticles((prev) => prev + ITEMS_PER_PAGE)
    }
    if (currentFormat === 'all' || currentFormat === 'videos') {
      setVisibleVideos((prev) => prev + ITEMS_PER_PAGE)
    }
  }

  const isEmpty = articles.length === 0 && videos.length === 0

  if (isEmpty) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[--card] mb-6">
          <BookOpen className="h-8 w-8 text-[--dim]" />
        </div>
        <h3 className="font-display text-xl font-semibold text-[--white] mb-2">No content found</h3>
        <p className="font-body text-[--muted] mb-6">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : 'No content matches your current filters.'}
        </p>
        <Button
          variant="outline"
          onClick={() => (window.location.href = '/content')}
          className="border-[--border] text-[--cream] hover:bg-[--card] font-ui font-semibold"
        >
          Clear Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Articles Section */}
      {(currentFormat === 'all' || currentFormat === 'articles') && displayedArticles.length > 0 && (
        <section>
          {currentFormat === 'all' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-[--muted]">
                <BookOpen className="h-5 w-5" />
                <h2 className="font-display text-lg font-semibold text-[--white]">Articles</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full font-ui text-xs font-medium bg-[--card] text-[--muted]">
                {totalArticles}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Videos Section */}
      {(currentFormat === 'all' || currentFormat === 'videos') && displayedVideos.length > 0 && (
        <section>
          {currentFormat === 'all' && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-[--muted]">
                <Video className="h-5 w-5" />
                <h2 className="font-display text-lg font-semibold text-[--white]">Videos</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full font-ui text-xs font-medium bg-[--card] text-[--muted]">
                {totalVideos}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedVideos.map((video) => (
              <VideoCard key={video.slug} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="border-[--border] text-[--cream] hover:bg-[--card] hover:text-[--white] font-ui font-semibold"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
