'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  activeCategory: string | null
  onCategoryChange: (cat: string | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  hasCatchUp?: boolean
}

const tabs = [
  { id: 'active', label: 'Active' },
  { id: 'catchup', label: 'Catch-Up' },
  { id: 'my-tasks', label: 'My Tasks' },
  { id: 'partner', label: "Partner's" },
  { id: 'completed', label: 'Completed' },
]

const categories = [
  { id: null, label: 'All', icon: null },
  { id: 'medical', label: 'Medical', icon: '🏥', bgClass: 'bg-red-500/10', textClass: 'text-red-400', borderClass: 'border-red-500/20' },
  { id: 'shopping', label: 'Shopping', icon: '🛒', bgClass: 'bg-blue-500/10', textClass: 'text-blue-500', borderClass: 'border-blue-500/20' },
  { id: 'planning', label: 'Planning', icon: '📋', bgClass: 'bg-purple-500/10', textClass: 'text-purple-400', borderClass: 'border-purple-500/20' },
  { id: 'financial', label: 'Financial', icon: '💰', bgClass: 'bg-green-500/10', textClass: 'text-green-500', borderClass: 'border-green-500/20' },
]

export function FilterBar({
  activeTab,
  onTabChange,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  hasCatchUp = true,
}: FilterBarProps) {
  // Filter out catch-up tab if no backlog
  const visibleTabs = hasCatchUp ? tabs : tabs.filter(t => t.id !== 'catchup')

  return (
    <div className="space-y-3 mb-6 pb-6 border-b border-white/[0.06]">
      {/* Search - mobile first */}
      <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 md:hidden">
        <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent border-none text-[13px] text-zinc-200 w-full outline-none placeholder:text-zinc-600"
        />
      </div>

      {/* Tabs - horizontally scrollable on mobile */}
      <div className="flex overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
        <div className="flex bg-white/[0.04] rounded-[10px] p-1 flex-shrink-0">
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'px-3 md:px-4 py-2 rounded-lg text-[12px] md:text-[13px] font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-500 hover:text-zinc-400'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category chips - horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible pb-1">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id
          const isAll = cat.id === null

          return (
            <button
              key={cat.id ?? 'all'}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap flex-shrink-0',
                isAll
                  ? isActive
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-white/[0.08] text-zinc-300 border-transparent hover:bg-white/10'
                  : isActive
                    ? cn(cat.bgClass, cat.textClass, cat.borderClass)
                    : cn('bg-transparent border-transparent', cat.textClass, 'opacity-60 hover:opacity-100')
              )}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.label}
            </button>
          )
        })}

        {/* Search - desktop only, inline */}
        <div className="hidden md:flex ml-auto items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 flex-shrink-0">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none text-[13px] text-zinc-200 w-[180px] outline-none placeholder:text-zinc-600"
          />
        </div>
      </div>
    </div>
  )
}
