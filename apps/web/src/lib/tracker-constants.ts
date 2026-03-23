import { type LucideIcon } from 'lucide-react'
import {
  Baby,
  Milk,
  Moon,
  Thermometer,
  Pill,
  Sun,
  Smile,
  Scale,
  Ruler,
  Star,
  Plus,
} from 'lucide-react'
import type { LogType } from '@tdc/services'

export const LOG_TYPE_CONFIG: Record<LogType, { icon: LucideIcon; color: string; bgColor: string; label: string }> = {
  feeding: { icon: Milk, color: 'text-sky', bgColor: 'bg-sky-dim', label: 'Feeding' },
  diaper: { icon: Baby, color: 'text-gold', bgColor: 'bg-gold-dim', label: 'Diaper' },
  sleep: { icon: Moon, color: 'text-rose', bgColor: 'bg-rose-dim', label: 'Sleep' },
  temperature: { icon: Thermometer, color: 'text-coral', bgColor: 'bg-coral-dim', label: 'Temperature' },
  medicine: { icon: Pill, color: 'text-sage', bgColor: 'bg-sage-dim', label: 'Medicine' },
  vitamin_d: { icon: Sun, color: 'text-gold', bgColor: 'bg-gold-dim', label: 'Vitamin D' },
  mood: { icon: Smile, color: 'text-rose', bgColor: 'bg-rose-dim', label: 'Mood' },
  weight: { icon: Scale, color: 'text-sky', bgColor: 'bg-sky-dim', label: 'Weight' },
  height: { icon: Ruler, color: 'text-sky', bgColor: 'bg-sky-dim', label: 'Height' },
  milestone: { icon: Star, color: 'text-copper', bgColor: 'bg-copper-dim', label: 'Milestone' },
  custom: { icon: Plus, color: 'text-[--muted]', bgColor: 'bg-[--card]', label: 'Custom' },
}
