'use client'

import { useState } from 'react'
import { ChevronDown, Baby, Plus, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/components/user-provider'
import { useBabies, useSwitchBaby } from '@/hooks/use-babies'
import { cn } from '@/lib/utils'
import { isPregnancyStage } from '@tdc/shared/utils'
import { Baby as BabyType } from '@tdc/shared/types'
import Link from 'next/link'

function getWeekLabel(baby: BabyType): string {
  if (isPregnancyStage(baby.stage)) {
    return `Week ${baby.current_week}`
  }
  if (baby.current_week <= 12) {
    return `Week ${baby.current_week}`
  }
  const months = Math.floor(baby.current_week / 4)
  return `${months} mo`
}

function getStageBadge(baby: BabyType): string {
  if (isPregnancyStage(baby.stage)) return 'Expecting'
  return 'Born'
}

function BabyInfoBlock({ baby }: { baby: BabyType }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-copper-dim flex items-center justify-center">
        <Baby className="h-4 w-4 text-copper" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-body text-sm font-medium text-[--cream] truncate">
          {baby.baby_name || 'Baby'}
        </p>
        <p className="font-ui text-[10px] text-[--muted] tracking-wide">
          {getStageBadge(baby)} &middot; {getWeekLabel(baby)}
        </p>
      </div>
    </div>
  )
}

export function BabySwitcher() {
  const { activeBaby } = useUser()
  const { data: babies } = useBabies()
  const switchBaby = useSwitchBaby()
  const [open, setOpen] = useState(false)

  if (!activeBaby) return null

  const isMultiBaby = babies && babies.length > 1

  const handleSwitch = (babyId: string) => {
    if (babyId !== activeBaby?.id) {
      switchBaby.mutate(babyId)
    }
    setOpen(false)
  }

  // Single baby — static info block
  if (!isMultiBaby) {
    return (
      <div className="bg-[--card] border border-[--border] rounded-lg p-3">
        <BabyInfoBlock baby={activeBaby} />
      </div>
    )
  }

  // Multi baby — dropdown trigger
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="w-full bg-[--card] border border-[--border] rounded-lg p-3 hover:bg-[--card-hover] hover:border-[--border-hover] transition-colors text-left">
          <div className="flex items-center justify-between gap-2">
            <BabyInfoBlock baby={activeBaby} />
            <ChevronDown className={cn(
              'h-4 w-4 text-[--muted] flex-shrink-0 transition-transform duration-200',
              open && 'rotate-180'
            )} />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {babies.map((baby) => {
          const isActive = baby.id === activeBaby?.id
          return (
            <DropdownMenuItem
              key={baby.id}
              onClick={() => handleSwitch(baby.id)}
              className={cn(
                'flex items-center gap-3 py-2.5',
                isActive && 'bg-copper-dim'
              )}
            >
              <Baby className={cn('h-4 w-4', isActive ? 'text-copper' : 'text-[--muted]')} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'font-body text-sm font-medium truncate',
                  isActive ? 'text-copper' : 'text-[--cream]'
                )}>
                  {baby.baby_name || `Baby ${baby.sort_order + 1}`}
                </p>
                <p className="font-ui text-[10px] text-[--muted]">
                  {getStageBadge(baby)} &middot; {getWeekLabel(baby)}
                </p>
              </div>
              {isActive && <Check className="h-4 w-4 text-copper flex-shrink-0" />}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/family" className="flex items-center gap-3 py-2.5">
            <Plus className="h-4 w-4 text-[--muted]" />
            <span className="font-body text-sm text-[--cream]">Add baby</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
