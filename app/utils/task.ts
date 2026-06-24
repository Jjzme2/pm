import type { Task } from '~/types'

export function dueDateClass(task: Task): string {
  if (!task.dueDate || task.status === 'done') return 'text-zinc-400'
  const diff = task.dueDate.toDate().getTime() - Date.now()
  if (diff < 0) return 'text-rose-500 font-medium'
  if (diff < 86400000) return 'text-amber-500 font-medium'
  return 'text-zinc-400'
}

export function formatDuration(ms: number): string {
  if (!ms) return '—'
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

export function checklistProgress(checklist: { done: boolean }[]): number {
  if (!checklist.length) return 0
  return Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)
}
