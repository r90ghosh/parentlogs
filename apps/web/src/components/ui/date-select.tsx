'use client'

import { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getDaysInMonth(month: number, year: number): number {
  if (!month || !year) return 31
  return new Date(year, month, 0).getDate()
}

interface DateSelectProps {
  value: string // ISO format: YYYY-MM-DD
  onChange: (value: string) => void
  /** 'future' for due dates, 'past' for birth dates */
  mode?: 'future' | 'past'
  className?: string
}

export function DateSelect({ value, onChange, mode = 'future', className }: DateSelectProps) {
  // Parse current value
  const [selectedYear, selectedMonth, selectedDay] = useMemo(() => {
    if (!value) return ['', '', '']
    const parts = value.split('-')
    return [parts[0] || '', parts[1] || '', parts[2] || '']
  }, [value])

  // Generate year range
  const years = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    if (mode === 'future') {
      // Due dates: current year + 1 year ahead
      return Array.from({ length: 2 }, (_, i) => currentYear + i)
    }
    // Birth dates: 2 years back + current year
    return Array.from({ length: 3 }, (_, i) => currentYear - 2 + i).reverse()
  }, [mode])

  // Days in the selected month
  const daysCount = useMemo(() => {
    const m = parseInt(selectedMonth)
    const y = parseInt(selectedYear)
    return getDaysInMonth(m, y || new Date().getFullYear())
  }, [selectedMonth, selectedYear])

  const handleChange = (part: 'year' | 'month' | 'day', val: string) => {
    let y = selectedYear
    let m = selectedMonth
    let d = selectedDay

    if (part === 'year') y = val
    if (part === 'month') m = val
    if (part === 'day') d = val

    // Clamp day if it exceeds new month's days
    if (y && m && d) {
      const maxDays = getDaysInMonth(parseInt(m), parseInt(y))
      if (parseInt(d) > maxDays) d = String(maxDays).padStart(2, '0')
    }

    // Only emit when all parts are set
    if (y && m && d) {
      onChange(`${y}-${m}-${d}`)
    } else {
      // Store partial selections via an interim format
      onChange([y || '', m || '', d || ''].join('-'))
    }
  }

  const triggerClass = 'bg-[--card] border-[--border] text-[--cream] hover:border-[--border-hover] w-full'

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {/* Month */}
      <Select value={selectedMonth} onValueChange={(v) => handleChange('month', v)}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="bg-[--card] border-[--border] max-h-[280px]">
          {MONTHS.map((month, i) => (
            <SelectItem key={month} value={String(i + 1).padStart(2, '0')}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Day */}
      <Select value={selectedDay} onValueChange={(v) => handleChange('day', v)}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="bg-[--card] border-[--border] max-h-[280px]">
          {Array.from({ length: daysCount }, (_, i) => (
            <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select value={selectedYear} onValueChange={(v) => handleChange('year', v)}>
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="bg-[--card] border-[--border]">
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
