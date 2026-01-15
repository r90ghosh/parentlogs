'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, BookOpen, Video, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StageInfo } from '@/lib/content'

interface ContentFiltersProps {
  stages: StageInfo[]
  currentStage: string
  currentFormat: string
  searchQuery: string
}

export function ContentFilters({
  stages,
  currentStage,
  currentFormat,
  searchQuery,
}: ContentFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '' || value === 'all') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      const queryString = params.toString()
      router.push(`/resources${queryString ? `?${queryString}` : ''}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handleStageChange = (stage: string) => {
    updateFilters({ stage: stage === 'all' ? null : stage })
  }

  const handleFormatChange = (format: string) => {
    updateFilters({ format: format === 'all' ? null : format })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value || null })
  }

  const handleClearFilters = () => {
    router.push('/resources', { scroll: false })
  }

  const hasActiveFilters = currentStage !== 'all' || currentFormat !== 'all' || searchQuery !== ''

  return (
    <div className="md:sticky md:top-20 z-40 bg-slate-950 md:bg-slate-950/95 md:backdrop-blur-md border-b border-slate-800/50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Stage filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStageChange('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                currentStage === 'all'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
              )}
            >
              All Stages
            </button>
            {stages.map((stage) => {
              const count =
                currentFormat === 'articles'
                  ? stage.articleCount
                  : currentFormat === 'videos'
                    ? stage.videoCount
                    : stage.articleCount + stage.videoCount

              if (count === 0) return null

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageChange(stage.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    currentStage === stage.id
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  )}
                >
                  {stage.label}
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                </button>
              )
            })}
          </div>

          {/* Format filters and search */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Format buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFormatChange('all')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                  currentFormat === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                )}
              >
                All
              </button>
              <button
                onClick={() => handleFormatChange('articles')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                  currentFormat === 'articles'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                )}
              >
                <BookOpen className="h-4 w-4" />
                Articles
              </button>
              <button
                onClick={() => handleFormatChange('videos')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                  currentFormat === 'videos'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                )}
              >
                <Video className="h-4 w-4" />
                Videos
              </button>
            </div>

            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search articles and videos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
              />
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
