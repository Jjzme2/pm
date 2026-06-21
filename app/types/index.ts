import type { Timestamp } from 'firebase/firestore'

export type ProjectColor =
  | 'violet' | 'red' | 'orange' | 'amber' | 'yellow'
  | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan'
  | 'sky' | 'blue' | 'indigo' | 'purple' | 'fuchsia'
  | 'pink' | 'rose'

export type TaskStatus = 'todo' | 'inprogress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Project {
  id: string
  name: string
  description: string
  color: ProjectColor
  icon: string
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  dueDate: Timestamp | null
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Note {
  id: string
  projectId: string | null
  title: string
  content: string
  tags: string[]
  pinned: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface QuickLink {
  id: string
  projectId: string | null
  title: string
  url: string
  description: string
  color: ProjectColor
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface TimerSession {
  id: string
  projectId: string | null
  taskId: string | null
  label: string
  startTime: Timestamp
  endTime: Timestamp | null
  duration: number
  createdAt: Timestamp
}

export interface ActiveTimer {
  id: string
  projectId: string | null
  taskId: string | null
  label: string
  startTime: number
}

export const TASK_COLUMNS: { id: TaskStatus; label: string; icon: string; color: string }[] = [
  { id: 'todo', label: 'To Do', icon: 'i-lucide-circle', color: 'text-zinc-400' },
  { id: 'inprogress', label: 'In Progress', icon: 'i-lucide-circle-dot', color: 'text-blue-400' },
  { id: 'review', label: 'Review', icon: 'i-lucide-circle-dot-dashed', color: 'text-amber-400' },
  { id: 'done', label: 'Done', icon: 'i-lucide-circle-check', color: 'text-emerald-400' }
]

export const PROJECT_ICONS = [
  'i-lucide-folder',
  'i-lucide-folder-kanban',
  'i-lucide-briefcase',
  'i-lucide-rocket',
  'i-lucide-star',
  'i-lucide-zap',
  'i-lucide-heart',
  'i-lucide-code-2',
  'i-lucide-database',
  'i-lucide-globe',
  'i-lucide-layers',
  'i-lucide-cpu',
  'i-lucide-palette',
  'i-lucide-music',
  'i-lucide-camera',
  'i-lucide-shopping-bag',
  'i-lucide-graduation-cap',
  'i-lucide-home'
]

export const PROJECT_COLORS: ProjectColor[] = [
  'violet', 'blue', 'emerald', 'amber', 'rose',
  'sky', 'green', 'orange', 'purple', 'teal',
  'pink', 'indigo', 'lime', 'red', 'cyan', 'fuchsia'
]
