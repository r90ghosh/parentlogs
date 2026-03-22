import type { Metadata } from 'next'
import NewTaskClient from './new-task-client'

export const metadata: Metadata = {
  title: 'New Task | Rooftop Crest',
}

export default function NewTaskPage() {
  return <NewTaskClient />
}
