import { BacklogCategory, TriageAction } from '@tdc/shared/types'

export const categoryConfig: Record<string, {
  icon: string
  label: string
  bgClass: string
  textClass: string
  borderClass: string
}> = {
  medical: {
    icon: '🏥',
    label: 'Medical',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/30'
  },
  shopping: {
    icon: '🛒',
    label: 'Shopping',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30'
  },
  planning: {
    icon: '📋',
    label: 'Planning',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30'
  },
  financial: {
    icon: '💰',
    label: 'Financial',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-400',
    borderClass: 'border-green-500/30'
  },
  partner: {
    icon: '💬',
    label: 'Partner',
    bgClass: 'bg-pink-500/10',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-500/30'
  },
  self_care: {
    icon: '🧘',
    label: 'Self Care',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30'
  }
}

export const backlogCategoryConfig: Record<BacklogCategory, {
  label: string
  bgClass: string
  textClass: string
  description: string
  suggestedAction: TriageAction
}> = {
  still_relevant: {
    label: 'Still Relevant',
    bgClass: 'bg-green-500/15',
    textClass: 'text-green-400',
    description: 'You can still do this! We recommend adding it to your list.',
    suggestedAction: 'added'
  },
  window_passed: {
    label: 'Window Passed',
    bgClass: 'bg-zinc-500/15',
    textClass: 'text-zinc-400',
    description: 'This was time-sensitive and the window has closed.',
    suggestedAction: 'skipped'
  },
  probably_done: {
    label: 'Probably Done?',
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-400',
    description: 'Most people complete this early. Did you already do this?',
    suggestedAction: 'completed'
  }
}

export function getCategoryConfig(category: string) {
  return categoryConfig[category] || {
    icon: '📌',
    label: category || 'Other',
    bgClass: 'bg-zinc-500/10',
    textClass: 'text-zinc-400',
    borderClass: 'border-zinc-500/30'
  }
}
