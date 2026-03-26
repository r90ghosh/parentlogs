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
  ClipboardList,
  PaintBucket,
  CarFront,
  MapPin,
  Droplets,
  Moon,
  HeartHandshake,
  TreePalm,
  House,
  Cake,
  Search,
  Trophy,
  Activity,
  FileCheck,
  Calendar,
} from 'lucide-react'

export const CHECKLIST_ICONS: Record<string, React.ElementType> = {
  'CL-01': Baby,            // Hospital Bag — Mom
  'CL-02': Home,            // Hospital Bag — Dad
  'CL-03': ShoppingBag,     // First Car Ride Home
  'CL-04': FileText,        // First Pediatrician Visit
  'CL-05': Shield,          // First Flight with Baby
  'CL-06': Stethoscope,     // First Restaurant Outing
  'CL-07': Car,             // First Road Trip
  'CL-08': Gift,            // First Night Away from Baby
  'CL-09': Plane,           // First Hotel Stay
  'CL-10': Camera,          // Daycare Tour Questions
  'CL-11': Users,           // Returning to Work
  'CL-12': Heart,           // Babyproofing Home
  'CL-13': Briefcase,       // Starting Solid Foods
  'CL-14': Home,            // Baby's First Illness
  'CL-15': Sparkles,        // Emergency Info Sheet
  'CL-16': ClipboardList,   // Birth Plan Decisions
  'CL-17': PaintBucket,     // Nursery Setup
  'CL-18': CarFront,        // Car Seat Installation
  'CL-19': MapPin,          // First Solo Outing with Baby
  'CL-20': Droplets,        // First Bath at Home
  'CL-21': Moon,            // Newborn Sleep Setup
  'CL-22': HeartHandshake,  // Postpartum Support Plan for Mom
  'CL-23': TreePalm,        // First Vacation with Baby
  'CL-24': House,           // First Overnight at Grandparents'
  'CL-25': Cake,            // First Birthday Party Planning
  'CL-26': Search,          // Choosing a Pediatrician
  'CL-27': Trophy,          // First Sports / Activity Class
  'CL-28': Camera,          // Baby Photo & Memory Keeping
  'CL-29': Activity,        // Infant CPR & First Aid Prep
  'CL-30': FileCheck,       // Life Insurance & Will Updates
  'CL-31': Calendar,        // Paternity Leave Planning
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
  'CL-16': { bg: 'bg-teal-500/20', text: 'text-teal-400', progress: 'bg-teal-500' },
  'CL-17': { bg: 'bg-amber-500/20', text: 'text-amber-400', progress: 'bg-amber-500' },
  'CL-18': { bg: 'bg-indigo-500/20', text: 'text-indigo-400', progress: 'bg-indigo-500' },
  'CL-19': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', progress: 'bg-emerald-500' },
  'CL-20': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', progress: 'bg-cyan-500' },
  'CL-21': { bg: 'bg-violet-500/20', text: 'text-violet-400', progress: 'bg-violet-500' },
  'CL-22': { bg: 'bg-rose-500/20', text: 'text-rose-400', progress: 'bg-rose-500' },
  'CL-23': { bg: 'bg-gold/20', text: 'text-gold', progress: 'bg-gold' },
  'CL-24': { bg: 'bg-lime-500/20', text: 'text-lime-400', progress: 'bg-lime-500' },
  'CL-25': { bg: 'bg-pink-500/20', text: 'text-pink-400', progress: 'bg-pink-500' },
  'CL-26': { bg: 'bg-sky/20', text: 'text-sky', progress: 'bg-sky' },
  'CL-27': { bg: 'bg-orange-500/20', text: 'text-orange-400', progress: 'bg-orange-500' },
  'CL-28': { bg: 'bg-copper/20', text: 'text-copper', progress: 'bg-copper' },
  'CL-29': { bg: 'bg-red-500/20', text: 'text-red-400', progress: 'bg-red-500' },
  'CL-30': { bg: 'bg-slate-500/20', text: 'text-slate-400', progress: 'bg-slate-500' },
  'CL-31': { bg: 'bg-purple-500/20', text: 'text-purple-400', progress: 'bg-purple-500' },
}

// All checklists are free for SEO
export const PREMIUM_CHECKLIST_IDS: string[] = []
