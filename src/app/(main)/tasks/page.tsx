import type { Metadata } from 'next'
import TasksClient from './tasks-client'

export const metadata: Metadata = {
  title: 'Tasks | The Dad Center',
}

export default function TasksPage() {
  return <TasksClient />
}
