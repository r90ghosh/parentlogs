import type { ComponentType } from 'react'

export interface TipSection {
  number: number
  title: string
  illustrationId: string
  points: string[]
  proTip: string
}

export interface TipTopic {
  id: string
  emoji: string
  name: string
  sections: TipSection[]
}

export interface IllustrationProps {
  className?: string
}

export type IllustrationComponent = ComponentType<IllustrationProps>
