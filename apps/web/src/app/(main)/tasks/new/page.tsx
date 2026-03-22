import type { Metadata } from 'next'
import NewTaskClient from './new-task-client'

export const metadata: Metadata = {
  title: 'New Task | The Dad Center',
}

export default function NewTaskPage() {
  return <NewTaskClient />
}
