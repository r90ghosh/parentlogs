import { PillarConfig, MoodConfig, SituationFlag, DadConcern } from '@/types/dad-journey'

export const PILLAR_CONFIG: PillarConfig[] = [
  { pillar: 'anxiety', label: 'Anxiety & Fear', icon: '🫣', color: 'coral', gradient: 'from-coral/15 to-coral/5', borderColor: 'border-l-coral' },
  { pillar: 'baby_bonding', label: 'Baby Bonding', icon: '👶', color: 'sage', gradient: 'from-sage/15 to-sage/5', borderColor: 'border-l-sage' },
  { pillar: 'relationship', label: 'Relationship', icon: '💑', color: 'rose', gradient: 'from-rose/15 to-rose/5', borderColor: 'border-l-rose' },
  { pillar: 'finances', label: 'Finances', icon: '💰', color: 'sky', gradient: 'from-sky/15 to-sky/5', borderColor: 'border-l-sky' },
  { pillar: 'knowledge', label: 'Knowledge', icon: '🧠', color: 'copper', gradient: 'from-copper/15 to-copper/5', borderColor: 'border-l-copper' },
  { pillar: 'planning', label: 'Planning', icon: '📋', color: 'gold', gradient: 'from-gold/15 to-gold/5', borderColor: 'border-l-gold' },
  { pillar: 'extended_family', label: 'Extended Family', icon: '👨‍👩‍👦', color: 'muted', gradient: 'from-[--muted]/15 to-[--muted]/5', borderColor: 'border-l-[--muted]' },
]

export const MOOD_CONFIG: MoodConfig[] = [
  { level: 'struggling', emoji: '😞', label: 'Struggling', color: 'text-coral' },
  { level: 'rough', emoji: '😔', label: 'Rough', color: 'text-copper' },
  { level: 'okay', emoji: '😐', label: 'Okay', color: 'text-gold' },
  { level: 'good', emoji: '🙂', label: 'Good', color: 'text-sage' },
  { level: 'great', emoji: '😄', label: 'Great', color: 'text-[--cream]' },
]

export const SITUATION_FLAGS: SituationFlag[] = [
  { key: 'sleep_deprived', emoji: '😴', label: 'Sleep deprived' },
  { key: 'argued_partner', emoji: '💔', label: 'Argued with partner' },
  { key: 'feeling_disconnected', emoji: '🔌', label: 'Feeling disconnected' },
  { key: 'overwhelmed_work', emoji: '💼', label: 'Overwhelmed at work' },
  { key: 'family_pressure', emoji: '👨‍👩‍👦', label: 'Family pressure' },
  { key: 'feeling_great', emoji: '🌟', label: 'Feeling great' },
  { key: 'bonding_moment', emoji: '🥰', label: 'Bonding moment' },
  { key: 'anxious', emoji: '😰', label: 'Anxious' },
]

export const DAD_CONCERNS: DadConcern[] = [
  { key: 'finances', emoji: '💰', label: 'Finances' },
  { key: 'relationship_changes', emoji: '💑', label: 'Relationship changes' },
  { key: 'being_good_dad', emoji: '👨', label: 'Being a good dad' },
  { key: 'work_life_balance', emoji: '⚖️', label: 'Work-life balance' },
  { key: 'family_interference', emoji: '👨‍👩‍👦', label: 'Family interference' },
  { key: 'health_anxiety', emoji: '🏥', label: 'Health anxiety' },
  { key: 'labor_delivery', emoji: '🍼', label: 'Labor & delivery' },
  { key: 'losing_identity', emoji: '🪞', label: 'Losing my identity' },
]
