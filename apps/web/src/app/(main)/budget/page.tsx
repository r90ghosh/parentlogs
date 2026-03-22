import type { Metadata } from 'next'
import BudgetClient from './budget-client'

export const metadata: Metadata = {
  title: 'Budget Planner | Rooftop Crest',
}

export default function BudgetPage() {
  return <BudgetClient />
}
