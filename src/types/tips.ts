export interface TipStep {
  stepNumber: number
  title: string
  description: string
  proTip?: string
  illustrationId: string
}

export interface TipTopic {
  id: string
  emoji: string
  name: string
  description: string
  steps: TipStep[]
}
