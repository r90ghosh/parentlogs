import type { BriefingTemplate } from '@tdc/shared/types'
import type { BabySize } from '@tdc/shared/utils/baby-sizes'
import { formatLength, formatWeight } from '@tdc/shared/utils/baby-sizes'
import type { ColorTokens } from '@/lib/colors'
import { firstSentence } from '@/lib/text'

export type DigestCategoryKey = 'baby' | 'her' | 'do' | 'tip' | 'next'

/** Optional authored one-liners (the future `digest` jsonb column on briefing_templates). */
export interface BriefingDigestJson {
  tldr?: string | null
  headlines?: {
    baby?: string | null
    her?: string | null
    tip?: string | null
    next?: string | null
  } | null
}

export type BriefingWithDigest = BriefingTemplate & { digest?: BriefingDigestJson | null }

export interface DigestItem {
  key: string
  categoryKey: DigestCategoryKey
  label: string
  headline: string
  detail?: string | null
  checkable?: boolean
  /** 0-based index among dad_focus[] — used for persistence. */
  doIndex?: number
}

export interface BriefingDigest {
  hero: { week: number; sub: string; progressPct: number; tldr: string }
  /** The "This week" feed: baby → her → do(s) → tip. */
  items: DigestItem[]
  fieldNote: string | null
  /** "Coming up" — rendered after the field note. */
  next: DigestItem | null
}

function trimesterLabel(week: number): string {
  if (week <= 13) return 'First trimester'
  if (week <= 27) return 'Second trimester'
  return 'Third trimester'
}

function pluralWeeks(n: number): string {
  return `${n} week${n === 1 ? '' : 's'}`
}

function babyAgeLabel(week: number): string {
  if (week < 9) return `${pluralWeeks(week)} old`
  const months = Math.round(week / 4.345)
  return `${months} month${months === 1 ? '' : 's'} old`
}

/**
 * Transform a briefing row into the digest view-model. Headlines come from the
 * authored `digest` jsonb when present, else fall back to firstSentence() of the
 * paragraph (§2.1 v1 fallback). Colors are resolved at render time, not here.
 */
export function buildBriefingDigest(
  briefing: BriefingWithDigest,
  babySize: BabySize | undefined,
  role: string,
  opts?: { isPregnancy?: boolean }
): BriefingDigest {
  const isPregnancy = opts?.isPregnancy ?? !!babySize
  const total = isPregnancy ? 40 : 104
  const week = briefing.week
  const h = briefing.digest?.headlines ?? null

  const sub = isPregnancy
    ? `${trimesterLabel(week)} · ${week >= 40 ? 'due any day' : `${pluralWeeks(Math.max(0, 40 - week))} to go`}`
    : babyAgeLabel(week)

  let babyDetail = briefing.baby_update
  if (babySize) {
    babyDetail = `${briefing.baby_update}\n\nBaby is about the size of a ${babySize.fruit} — ${formatLength(babySize)} long, ${formatWeight(babySize)}.`
  }

  const items: DigestItem[] = [
    {
      key: 'baby',
      categoryKey: 'baby',
      label: 'Baby',
      headline: h?.baby || firstSentence(briefing.baby_update) || briefing.baby_update,
      detail: babyDetail,
    },
    {
      key: 'her',
      categoryKey: 'her',
      label: role === 'dad' ? "What She's Experiencing" : 'Your Body',
      headline: h?.her || firstSentence(briefing.mom_update) || briefing.mom_update,
      detail: briefing.mom_update,
    },
  ]

  ;(briefing.dad_focus ?? []).forEach((focus, idx) => {
    items.push({
      key: `do-${idx}`,
      categoryKey: 'do',
      label: 'Do this',
      headline: focus,
      detail: null, // dad_focus strings are already short
      checkable: true,
      doIndex: idx,
    })
  })

  if (briefing.relationship_tip) {
    items.push({
      key: 'tip',
      categoryKey: 'tip',
      label: 'Tip',
      headline: h?.tip || firstSentence(briefing.relationship_tip) || briefing.relationship_tip,
      detail: briefing.relationship_tip,
    })
  }

  const next: DigestItem | null = briefing.coming_up
    ? {
        key: 'next',
        categoryKey: 'next',
        label: 'Coming up',
        headline: h?.next || firstSentence(briefing.coming_up) || briefing.coming_up,
        detail: briefing.coming_up,
      }
    : null

  return {
    hero: {
      week,
      sub,
      progressPct: Math.min(Math.max(week / total, 0), 1),
      tldr: briefing.digest?.tldr || briefing.title,
    },
    items,
    fieldNote: briefing.field_notes ?? null,
    next,
  }
}

/** Resolve a category key to its theme-aware scanning-dot color. */
export function categoryColor(key: DigestCategoryKey, colors: ColorTokens): string {
  switch (key) {
    case 'baby':
      return colors.dotBaby
    case 'her':
      return colors.dotHer
    case 'do':
      return colors.dotDo
    case 'tip':
      return colors.dotTip
    case 'next':
      return colors.dotNext
  }
}
