// Design tokens for Tasks page - matching the mockup exactly

export const colors = {
  // Background
  bg: {
    app: '#0a0a0f',
    sidebar: 'linear-gradient(180deg, #111118 0%, #0d0d12 100%)',
    card: 'linear-gradient(135deg, #18181b 0%, #1f1f26 100%)',
    cardHover: 'rgba(255,255,255,0.03)',
  },

  // Borders
  border: {
    default: 'rgba(255,255,255,0.06)',
    hover: 'rgba(255,255,255,0.15)',
    active: 'rgba(245, 158, 11, 0.5)',
  },

  // Text
  text: {
    primary: '#fff',
    secondary: '#e4e4e7',
    muted: '#a1a1aa',
    dimmed: '#71717a',
    faint: '#52525b',
  },

  // Accent colors
  accent: {
    primary: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    indigo: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    green: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    teal: '#14b8a6',
  },

  // Category colors
  category: {
    medical: { bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
    shopping: { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' },
    planning: { bg: 'rgba(168, 85, 247, 0.1)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.2)' },
    financial: { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.2)' },
    partner: { bg: 'rgba(236, 72, 153, 0.1)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.2)' },
    self_care: { bg: 'rgba(14, 165, 233, 0.1)', text: '#38bdf8', border: 'rgba(14, 165, 233, 0.2)' },
  },

  // Status colors
  status: {
    warning: '#f59e0b',
    danger: '#ef4444',
    success: '#22c55e',
    info: '#3b82f6',
    purple: '#818cf8',
  },

  // Stat icon backgrounds (15% opacity)
  statIcon: {
    focus: 'rgba(245, 158, 11, 0.15)',
    today: 'rgba(239, 68, 68, 0.15)',
    week: 'rgba(59, 130, 246, 0.15)',
    completed: 'rgba(34, 197, 94, 0.15)',
    partner: 'rgba(168, 85, 247, 0.15)',
    catchup: 'rgba(99, 102, 241, 0.15)',
  },
}

export const spacing = {
  sidebar: '240px',
  rightPanel: '380px',
  contentPadding: '32px 40px',
  cardPadding: '16px 20px',
  gap: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
}

export const radius = {
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  '2xl': '16px',
}

// Category configuration for UI
export const categoryConfig: Record<string, { icon: string; label: string; bgClass: string; textClass: string }> = {
  medical: {
    icon: '🏥',
    label: 'Medical',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-400',
  },
  shopping: {
    icon: '🛒',
    label: 'Shopping',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
  },
  planning: {
    icon: '📋',
    label: 'Planning',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
  },
  financial: {
    icon: '💰',
    label: 'Financial',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-400',
  },
  partner: {
    icon: '💬',
    label: 'Partner',
    bgClass: 'bg-pink-500/10',
    textClass: 'text-pink-400',
  },
  self_care: {
    icon: '🧘',
    label: 'Self Care',
    bgClass: 'bg-sky-500/10',
    textClass: 'text-sky-400',
  },
}

// Backlog category configuration
export const backlogCategoryConfig: Record<string, { label: string; bgClass: string; textClass: string }> = {
  window_passed: {
    label: 'Window Passed',
    bgClass: 'bg-zinc-500/15',
    textClass: 'text-zinc-400',
  },
  still_relevant: {
    label: 'Still Relevant',
    bgClass: 'bg-green-500/15',
    textClass: 'text-green-500',
  },
  probably_done: {
    label: 'Probably Done?',
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-400',
  },
}
