import type { Timestamp } from 'firebase/firestore'

export type SuiteEventType =
  | 'task.created'
  | 'task.completed'
  | 'project.created'
  | 'project.completed'
  | 'timer.stopped'
  | 'note.created'

export interface ActivityEvent {
  id: string
  type: SuiteEventType
  source: 'pm' | 'hub'
  summary: string
  data: Record<string, unknown>
  createdAt: Timestamp
}

export interface SuiteNotification {
  id: string
  type: SuiteEventType
  source: 'pm' | 'hub'
  title: string
  body: string
  data: Record<string, unknown>
  read: boolean
  createdAt: Timestamp
}

export type ProjectColor =
  | 'violet' | 'red' | 'orange' | 'amber' | 'yellow'
  | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan'
  | 'sky' | 'blue' | 'indigo' | 'purple' | 'fuchsia'
  | 'pink' | 'rose'

export type TaskStatus = 'todo' | 'inprogress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived'

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  color: ProjectColor
  icon: string
  order: number
  status: ProjectStatus
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
  checklist: ChecklistItem[]
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

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; icon: string; color: string }> = {
  high: { label: 'High', icon: 'i-lucide-chevrons-up', color: 'text-rose-500' },
  medium: { label: 'Medium', icon: 'i-lucide-minus', color: 'text-amber-500' },
  low: { label: 'Low', icon: 'i-lucide-chevrons-down', color: 'text-sky-500' }
}

export const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: string; color: string }> = {
  todo: { label: 'To Do', icon: 'i-lucide-circle', color: 'text-zinc-400' },
  inprogress: { label: 'In Progress', icon: 'i-lucide-circle-dot', color: 'text-blue-400' },
  review: { label: 'Review', icon: 'i-lucide-circle-dot-dashed', color: 'text-amber-400' },
  done: { label: 'Done', icon: 'i-lucide-circle-check', color: 'text-emerald-400' }
}

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
  on_hold: { label: 'On Hold', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  completed: { label: 'Completed', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
  archived: { label: 'Archived', color: 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800' }
}

export const COLOR_TEXT_MAP: Record<ProjectColor, string> = {
  violet: 'text-violet-500',
  red: 'text-red-500',
  orange: 'text-orange-500',
  amber: 'text-amber-500',
  yellow: 'text-yellow-500',
  lime: 'text-lime-500',
  green: 'text-green-500',
  emerald: 'text-emerald-500',
  teal: 'text-teal-500',
  cyan: 'text-cyan-500',
  sky: 'text-sky-500',
  blue: 'text-blue-500',
  indigo: 'text-indigo-500',
  purple: 'text-purple-500',
  fuchsia: 'text-fuchsia-500',
  pink: 'text-pink-500',
  rose: 'text-rose-500'
}

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
