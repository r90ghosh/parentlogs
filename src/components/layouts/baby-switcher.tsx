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
import { isPregnancyStage } from '@/lib/pregnancy-utils'
import { Baby as BabyType } from '@/types'
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

export function BabySwitcher() {
  const { activeBaby } = useUser()
  const { data: babies } = useBabies()
  const switchBaby = useSwitchBaby()
  const [open, setOpen] = useState(false)

  // Don't render if no babies or only one baby
  if (!babies || babies.length <= 1) {
    // Still show the week display for single baby
    if (activeBaby) {
      return (
        <span className="font-ui text-[11px] font-medium tracking-[0.05em] text-[--muted] leading-none">
          {activeBaby.baby_name ? `${activeBaby.baby_name} \u00b7 ` : ''}{getWeekLabel(activeBaby)}
        </span>
      )
    }
    return null
  }

  const handleSwitch = (babyId: string) => {
    if (babyId !== activeBaby?.id) {
      switchBaby.mutate(babyId)
    }
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 font-ui text-[11px] font-medium tracking-[0.05em] text-[--muted] leading-none hover:text-copper transition-colors">
          {activeBaby?.baby_name ? `${activeBaby.baby_name} \u00b7 ` : ''}{activeBaby ? getWeekLabel(activeBaby) : ''}
          <ChevronDown className="h-3 w-3" />
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
