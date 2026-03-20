import type { Metadata } from 'next'
import BudgetClient from './budget-client'

export const metadata: Metadata = {
  title: 'Budget Planner | The Dad Center',
}

export default function BudgetPage() {
  return <BudgetClient />
}
