import type { Metadata } from 'next'
import TaskDetailClient from './task-detail-client'

export const metadata: Metadata = {
  title: 'Task Details | Rooftop Crest',
}

export default function TaskDetailPage() {
  return <TaskDetailClient />
}
