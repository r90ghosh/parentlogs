import {
  DollarSign,
  Baby,
  Home,
  Car,
  Heart,
  Utensils,
  Shield,
  Monitor,
  FileText,
  Shirt,
  Sparkles,
  Users,
  Briefcase,
  Camera,
  BookOpen,
  PersonStanding,
  Dumbbell,
} from 'lucide-react'

// Extract primary category from compound names like "Baby Care - Diapering"
export function getPrimaryCategory(category: string): string {
  return category.split(' - ')[0].trim()
}

export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Admin': FileText,
  'Nursery': Home,
  'Gear': Car,
  'Health': Heart,
  'Feeding': Utensils,
  'Diapering': Baby,
  'Tech': Monitor,
  'Safety': Shield,
  'Clothing': Shirt,
  'Baby Care': Sparkles,
  'Childcare': Users,
  'Travel': Briefcase,
  'Maternity': PersonStanding,
  'Memories': Camera,
  'Books': BookOpen,
  'Mom': PersonStanding,
  'Activities': Dumbbell,
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Admin': { bg: 'bg-[--dim]/20', text: 'text-[--muted]', border: 'border-[--border-hover]' },
  'Nursery': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Gear': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Health': { bg: 'bg-coral/20', text: 'text-coral', border: 'border-coral/30' },
  'Feeding': { bg: 'bg-gold/20', text: 'text-gold', border: 'border-gold/30' },
  'Diapering': { bg: 'bg-sky/20', text: 'text-sky', border: 'border-sky/30' },
  'Tech': { bg: 'bg-sky/20', text: 'text-sky', border: 'border-sky/30' },
  'Safety': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Clothing': { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  'Baby Care': { bg: 'bg-sage/20', text: 'text-sage', border: 'border-sage/30' },
  'Childcare': { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  'Travel': { bg: 'bg-sage/20', text: 'text-sage', border: 'border-sage/30' },
  'Maternity': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Memories': { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
  'Books': { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/30' },
  'Mom': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Activities': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
}

export function getCategoryStyle(category: string) {
  const primary = getPrimaryCategory(category)
  return {
    colors: CATEGORY_COLORS[primary] || CATEGORY_COLORS['Admin'],
    Icon: CATEGORY_ICONS[primary] || DollarSign,
  }
}
