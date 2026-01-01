interface DadFocusListProps {
  items: string[]
}

// Map common keywords to icons
const iconMap: Record<string, string> = {
  plan: '📱',
  announce: '📱',
  nursery: '🛏️',
  room: '🛏️',
  clear: '🛏️',
  schedule: '📅',
  appointment: '📅',
  book: '📅',
  celebrate: '🎉',
  milestone: '🎉',
  date: '🎉',
  support: '💪',
  help: '💪',
  research: '🔍',
  learn: '📚',
  read: '📚',
  buy: '🛒',
  shop: '🛒',
  prepare: '📋',
  organize: '📋',
  talk: '💬',
  discuss: '💬',
  ask: '💬',
  hospital: '🏥',
  doctor: '🏥',
  medical: '🏥',
}

function getIconForItem(text: string): string {
  const lowerText = text.toLowerCase()
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (lowerText.includes(keyword)) {
      return icon
    }
  }
  return '✓' // Default icon
}

// Try to split "Title: Description" format
function parseItem(item: string): { title: string; description?: string } {
  // Check for common separators
  const separators = [': ', ' - ', '. ']
  for (const sep of separators) {
    const idx = item.indexOf(sep)
    if (idx > 0 && idx < 50) {
      return {
        title: item.slice(0, idx),
        description: item.slice(idx + sep.length),
      }
    }
  }
  // If no separator found, use first sentence as title
  const periodIdx = item.indexOf('. ')
  if (periodIdx > 0 && periodIdx < 60) {
    return {
      title: item.slice(0, periodIdx),
      description: item.slice(periodIdx + 2),
    }
  }
  return { title: item }
}

export function DadFocusList({ items }: DadFocusListProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">No focus items for this week.</p>
    )
  }

  return (
    <ul className="space-y-0">
      {items.map((item, idx) => {
        const { title, description } = parseItem(item)
        const icon = getIconForItem(item)

        return (
          <li
            key={idx}
            className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0"
          >
            <div className="w-6 h-6 rounded-md bg-amber-500/15 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              {icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-zinc-200 text-sm">{title}</div>
              {description && (
                <div className="text-xs text-zinc-500 mt-1">{description}</div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
