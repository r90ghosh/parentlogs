import { PillarConfig, MoodConfig, SituationFlag, DadConcern } from '@/types/dad-journey'

export const PILLAR_CONFIG: PillarConfig[] = [
  { pillar: 'anxiety', label: 'Anxiety & Fear', icon: '🫣', color: 'amber', gradient: 'from-amber-500/20 to-amber-600/10', borderColor: 'border-l-amber-500' },
  { pillar: 'baby_bonding', label: 'Baby Bonding', icon: '👶', color: 'blue', gradient: 'from-blue-500/20 to-blue-600/10', borderColor: 'border-l-blue-500' },
  { pillar: 'relationship', label: 'Relationship', icon: '💑', color: 'pink', gradient: 'from-pink-500/20 to-pink-600/10', borderColor: 'border-l-pink-500' },
  { pillar: 'finances', label: 'Finances', icon: '💰', color: 'green', gradient: 'from-green-500/20 to-green-600/10', borderColor: 'border-l-green-500' },
  { pillar: 'knowledge', label: 'Knowledge', icon: '🧠', color: 'purple', gradient: 'from-purple-500/20 to-purple-600/10', borderColor: 'border-l-purple-500' },
  { pillar: 'planning', label: 'Planning', icon: '📋', color: 'cyan', gradient: 'from-cyan-500/20 to-cyan-600/10', borderColor: 'border-l-cyan-500' },
  { pillar: 'extended_family', label: 'Extended Family', icon: '👨‍👩‍👦', color: 'orange', gradient: 'from-orange-500/20 to-orange-600/10', borderColor: 'border-l-orange-500' },
]

export const MOOD_CONFIG: MoodConfig[] = [
  { level: 'struggling', emoji: '😞', label: 'Struggling', color: 'text-red-400' },
  { level: 'rough', emoji: '😔', label: 'Rough', color: 'text-orange-400' },
  { level: 'okay', emoji: '😐', label: 'Okay', color: 'text-yellow-400' },
  { level: 'good', emoji: '🙂', label: 'Good', color: 'text-green-400' },
  { level: 'great', emoji: '😄', label: 'Great', color: 'text-emerald-400' },
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
