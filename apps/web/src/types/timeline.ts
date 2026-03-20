export type TimelineDomain =
  | 'health'
  | 'budget'
  | 'childcare'
  | 'relationship'
  | 'logistics'

export interface TimelineDot {
  id: string
  milestone_id: string
  title: string
  description: string
  domain: TimelineDomain
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface TimelineMilestone {
  id: string
  slug: string
  label: string
  sub_label: string
  sort_order: number
  direction: 'ltr' | 'rtl'
  created_at: string
  dots: TimelineDot[]
}
