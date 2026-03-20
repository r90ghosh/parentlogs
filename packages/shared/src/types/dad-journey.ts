// Challenge pillar enum
export type DadChallengePillar =
  | 'knowledge' | 'planning' | 'finances' | 'anxiety'
  | 'baby_bonding' | 'relationship' | 'extended_family'

// Content phases (maps from family_stage + current_week)
export type ContentPhase =
  | 'pre-pregnancy' | 'trimester-1' | 'trimester-2' | 'trimester-3'
  | '0-3-months' | '3-6-months' | '6-12-months' | '12-18-months' | '18-plus'

// Challenge content row
export interface DadChallengeContent {
  id: string
  pillar: DadChallengePillar
  phase: ContentPhase
  headline: string
  preview: string
  icon: string
  narrative: string
  action_items: { title: string; description: string }[]
  dad_quotes: { quote: string; attribution: string }[]
  sort_order: number
  is_premium: boolean
}

// Dad profile (from onboarding + personalize card)
export interface DadProfile {
  id: string
  user_id: string
  work_situation: string | null
  is_first_time_dad: boolean | null
  concerns: string[]
  partner_relationship: string | null
  family_nearby: boolean | null
  has_friend_support: boolean | null
}

// Mood types
export type MoodLevel = 'struggling' | 'rough' | 'okay' | 'good' | 'great'

export interface MoodCheckin {
  id: string
  user_id: string
  family_id: string
  mood: MoodLevel
  situation_flags: string[]
  note: string | null
  phase: ContentPhase | null
  checked_in_at: string
}

// Pillar display config
export interface PillarConfig {
  pillar: DadChallengePillar
  label: string
  icon: string
  color: string
  gradient: string
  borderColor: string
}

// Mood display config
export interface MoodConfig {
  level: MoodLevel
  emoji: string
  label: string
  color: string
}

// Situation flag config
export interface SituationFlag {
  key: string
  emoji: string
  label: string
}

// Dad concern option (for onboarding)
export interface DadConcern {
  key: string
  emoji: string
  label: string
}
