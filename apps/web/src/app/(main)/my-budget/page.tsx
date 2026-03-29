import type { Metadata } from 'next'
import MyBudgetClient from './my-budget-client'

export const metadata: Metadata = {
  title: 'My Budget | The Dad Center',
}

export default function MyBudgetPage() {
  return <MyBudgetClient />
}
