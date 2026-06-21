'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { ArrowLeft, Moon, Sun, Monitor } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Panel } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { cn } from '@/lib/utils'

type FontSize = 'small' | 'medium' | 'large'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('relative h-7 w-[46px] flex-none rounded-full transition-colors', checked ? 'bg-clay' : 'bg-line')}
    >
      <span
        className={cn('absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-[left]', checked ? 'left-[21px]' : 'left-[3px]')}
      />
    </button>
  )
}

export default function AppearanceClient() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [reducedMotion, setReducedMotion] = useState(false)

  usePageHeader({ title: 'Appearance' }, [])

  useEffect(() => {
    setMounted(true)
    const sf = localStorage.getItem('fontSize') as FontSize
    if (sf) setFontSize(sf)
    setReducedMotion(localStorage.getItem('reducedMotion') === 'true')
  }, [])

  const handleTheme = (t: string) => {
    setTheme(t)
    toast({ title: 'Theme updated' })
  }
  const handleFont = (s: FontSize) => {
    setFontSize(s)
    localStorage.setItem('fontSize', s)
    document.documentElement.style.fontSize = s === 'small' ? '15px' : s === 'large' ? '18px' : '17px'
    toast({ title: 'Font size updated' })
  }
  const handleMotion = (v: boolean) => {
    setReducedMotion(v)
    localStorage.setItem('reducedMotion', String(v))
    document.documentElement.classList.toggle('reduce-motion', v)
    toast({ title: v ? 'Reduced motion enabled' : 'Animations enabled' })
  }

  const current = mounted ? theme : 'system'

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, swatch: '#F6F5F2', dot: '#C0673D' },
    { value: 'dark', label: 'Dark', icon: Moon, swatch: '#000000', dot: '#d2814e' },
    { value: 'system', label: 'System', icon: Monitor, swatch: 'linear-gradient(135deg,#F6F5F2 50%,#000 50%)', dot: '#9C8A56' },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/settings" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
        <ArrowLeft className="h-4 w-4" /> Settings
      </Link>

      <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Theme</div>
      <div className="grid grid-cols-3 gap-3.5">
        {themeOptions.map(({ value, label, icon: Icon, swatch, dot }) => (
          <button
            key={value}
            onClick={() => handleTheme(value)}
            className={cn(
              'flex flex-col items-center gap-3 rounded-[18px] border-2 p-4 transition-colors',
              current === value ? 'border-clay bg-clay-soft' : 'border-line hover:border-faint'
            )}
          >
            <span className="relative h-12 w-full overflow-hidden rounded-lg border border-line" style={{ background: swatch }}>
              <span className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
            </span>
            <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-ink">
              <Icon className="h-4 w-4" /> {label}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Text size</div>
      <Panel className="p-2">
        <div className="grid grid-cols-3 gap-2">
          {(['small', 'medium', 'large'] as FontSize[]).map((s) => (
            <button
              key={s}
              onClick={() => handleFont(s)}
              className={cn(
                'rounded-xl px-3 py-2.5 text-[13.5px] font-bold capitalize transition-colors',
                fontSize === s ? 'bg-clay text-white' : 'text-ink2 hover:bg-card-hover'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Panel>

      <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Accessibility</div>
      <Panel className="px-[18px]">
        <div className="flex items-center justify-between py-4">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink">Reduced motion</p>
            <p className="text-[12.5px] text-mute">Minimize animations and transitions</p>
          </div>
          <Toggle checked={reducedMotion} onChange={handleMotion} />
        </div>
      </Panel>
    </div>
  )
}
