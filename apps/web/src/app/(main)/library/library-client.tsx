'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, ArrowUpRight, BookOpen } from 'lucide-react'
import { useUser } from '@/components/user-provider'
import { Panel, SectionLabel, Badge } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { ARTICLE_STAGE_ORDER } from '@/lib/article-stage'
import { cn } from '@/lib/utils'

export interface LibraryArticle {
  slug: string
  title: string
  stage: string
  stageLabel: string
  excerpt: string
  readTime: number
  isFree: boolean
}

export interface LibraryVideo {
  title: string
  source: string
  url: string
  stage: string
}

export default function LibraryClient({
  articles,
  videos,
  defaultStage,
}: {
  articles: LibraryArticle[]
  videos: LibraryVideo[]
  defaultStage: string
}) {
  const { profile } = useUser()
  const isPremiumUser = profile.subscription_tier !== 'free'
  const [stage, setStage] = useState<string>(defaultStage)

  usePageHeader({ title: 'Library', subtitle: 'Articles & resources for your stage' }, [])

  const stageChips = useMemo(() => {
    const map = new Map<string, string>()
    articles.forEach((a) => map.set(a.stage, a.stageLabel))
    return Array.from(map.entries())
      .sort((a, b) => ARTICLE_STAGE_ORDER.indexOf(a[0]) - ARTICLE_STAGE_ORDER.indexOf(b[0]))
      .map(([key, label]) => ({ key, label }))
  }, [articles])

  const filtered = stage === 'all' ? articles : articles.filter((a) => a.stage === stage)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  const resources = useMemo(() => {
    const byStage = stage === 'all' ? videos : videos.filter((v) => v.stage === stage)
    return (byStage.length ? byStage : videos).slice(0, 6)
  }, [videos, stage])

  const articleHref = (a: LibraryArticle) => (!a.isFree && !isPremiumUser ? '/upgrade' : `/blog/${a.slug}`)

  return (
    <div>
      {/* Stage chips */}
      <div className="mb-1 flex flex-wrap gap-2.5">
        <button
          onClick={() => setStage('all')}
          className={cn(
            'rounded-full border px-[15px] py-2 text-[13px] font-bold transition-colors',
            stage === 'all' ? 'border-clay bg-clay text-white' : 'border-line bg-card text-ink2 hover:border-faint'
          )}
        >
          All
        </button>
        {stageChips.map((c) => (
          <button
            key={c.key}
            onClick={() => setStage(c.key)}
            className={cn(
              'rounded-full border px-[15px] py-2 text-[13px] font-bold transition-colors',
              stage === c.key ? 'border-clay bg-clay text-white' : 'border-line bg-card text-ink2 hover:border-faint'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Panel className="mt-6 p-12 text-center">
          <p className="text-[15px] text-mute">No articles for this stage yet — try “All”.</p>
        </Panel>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <>
              <SectionLabel>Featured</SectionLabel>
              <Link href={articleHref(featured)}>
                <div className="rounded-[20px] border border-line border-l-[3px] border-l-clay bg-card p-[26px] shadow-[var(--shadow)] transition-shadow hover:shadow-[var(--shadow)]">
                  <div className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-clay-ink">{featured.stageLabel}</div>
                  <h2 className="mt-[11px] text-[27px] font-extrabold leading-[1.18] tracking-[-0.5px] text-ink">{featured.title}</h2>
                  {featured.excerpt && <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.6] text-ink2">{featured.excerpt}</p>}
                  <div className="mt-[18px] inline-flex items-center gap-2 text-[14.5px] font-bold text-clay-ink">
                    {!featured.isFree && !isPremiumUser ? (
                      <>
                        <Lock className="h-4 w-4" /> Unlock · {featured.readTime} min
                      </>
                    ) : (
                      <>
                        Read · {featured.readTime} min <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </>
          )}

          {/* More reads */}
          {rest.length > 0 && (
            <>
              <SectionLabel>More reads</SectionLabel>
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => {
                  const locked = !a.isFree && !isPremiumUser
                  return (
                    <Link
                      key={a.slug}
                      href={articleHref(a)}
                      className="flex flex-col rounded-[18px] border border-line bg-card p-[18px] shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow)]"
                    >
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.9px] text-mute">{a.stageLabel}</div>
                      <h4 className="mt-2 text-[16.5px] font-bold leading-[1.3] text-ink">{a.title}</h4>
                      {a.excerpt && <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.5] text-ink2">{a.excerpt}</p>}
                      <div className="mt-auto flex items-center justify-between gap-2 pt-3.5">
                        <span className="text-[12px] font-semibold text-mute">{a.readTime} min read</span>
                        {a.isFree ? (
                          <Badge tone="sage">Free</Badge>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[--gold]/15 px-[9px] py-[3px] text-[10px] font-extrabold uppercase tracking-[0.5px] text-[--gold]">
                            {locked && <Lock className="h-2.5 w-2.5" />} Premium
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Watch & learn */}
      {resources.length > 0 && (
        <>
          <SectionLabel>Watch &amp; learn</SectionLabel>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            {resources.map((v) => (
              <a
                key={v.url}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 rounded-2xl border border-line bg-card px-[18px] py-4 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow)]"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl" style={{ background: 'color-mix(in srgb, var(--sky) 15%, transparent)' }}>
                  <BookOpen className="h-[19px] w-[19px] text-[--sky]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold leading-[1.3] text-ink">{v.title}</span>
                  <span className="mt-1 block text-[11.5px] font-bold uppercase tracking-[0.4px] text-mute">{v.source}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 flex-none text-faint" />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
