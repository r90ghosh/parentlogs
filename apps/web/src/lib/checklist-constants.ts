import {
  Baby,
  Briefcase,
  Home,
  Heart,
  ShoppingBag,
  Plane,
  Camera,
  FileText,
  Shield,
  Stethoscope,
  Car,
  Gift,
  Users,
  Sparkles,
} from 'lucide-react'

export const CHECKLIST_ICONS: Record<string, React.ElementType> = {
  'CL-01': Baby,        // Hospital Bag
  'CL-02': Home,        // Nursery Setup
  'CL-03': ShoppingBag, // Baby Essentials
  'CL-04': FileText,    // Documents & Legal
  'CL-05': Shield,      // Baby Proofing (Premium)
  'CL-06': Stethoscope, // Pediatrician Prep (Premium)
  'CL-07': Car,         // Car Safety (Premium)
  'CL-08': Gift,        // Baby Shower (Premium)
  'CL-09': Plane,       // Travel with Baby (Premium)
  'CL-10': Camera,      // Photo Milestones (Premium)
  'CL-11': Users,       // Partner Prep (Premium)
  'CL-12': Heart,       // Self-Care
  'CL-13': Briefcase,   // Return to Work
  'CL-14': Home,        // Postpartum Home
  'CL-15': Sparkles,    // First Year Firsts
}

export const CHECKLIST_COLORS: Record<string, { bg: string; text: string; progress: string }> = {
  'CL-01': { bg: 'bg-blue-500/20', text: 'text-blue-400', progress: 'bg-blue-500' },
  'CL-02': { bg: 'bg-purple-500/20', text: 'text-purple-400', progress: 'bg-purple-500' },
  'CL-03': { bg: 'bg-gold/20', text: 'text-gold', progress: 'bg-gold' },
  'CL-04': { bg: 'bg-sage/20', text: 'text-sage', progress: 'bg-sage' },
  'CL-05': { bg: 'bg-coral/20', text: 'text-coral', progress: 'bg-coral' },
  'CL-06': { bg: 'bg-sky/20', text: 'text-sky', progress: 'bg-sky' },
  'CL-07': { bg: 'bg-orange-500/20', text: 'text-orange-400', progress: 'bg-orange-500' },
  'CL-08': { bg: 'bg-pink-500/20', text: 'text-pink-400', progress: 'bg-pink-500' },
  'CL-09': { bg: 'bg-copper/20', text: 'text-copper', progress: 'bg-copper' },
  'CL-10': { bg: 'bg-rose-500/20', text: 'text-rose-400', progress: 'bg-rose-500' },
  'CL-11': { bg: 'bg-sage/20', text: 'text-sage', progress: 'bg-sage' },
  'CL-12': { bg: 'bg-violet-500/20', text: 'text-violet-400', progress: 'bg-violet-500' },
  'CL-13': { bg: 'bg-[--dim]/20', text: 'text-[--muted]', progress: 'bg-[--muted]' },
  'CL-14': { bg: 'bg-sage/20', text: 'text-sage', progress: 'bg-sage' },
  'CL-15': { bg: 'bg-copper/20', text: 'text-copper', progress: 'bg-copper' },
}

// Premium checklists: CL-05 through CL-11
export const PREMIUM_CHECKLIST_IDS = ['CL-05', 'CL-06', 'CL-07', 'CL-08', 'CL-09', 'CL-10', 'CL-11']
