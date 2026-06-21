import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { useCollection } from 'vuefire'
import type { Task, TaskStatus, TaskPriority } from '~/types'

export function useTasks(projectId: MaybeRef<string>) {
  const db = useFirestore()
  const user = useCurrentUser()

  function tasksRef() {
    return collection(db, 'users', user.value!.uid, 'pm_tasks')
  }

  const tasks = useCollection<Task>(
    computed(() => user.value
      ? query(
          tasksRef(),
          where('projectId', '==', toValue(projectId)),
          orderBy('order', 'asc')
        )
      : null
    )
  )

  const tasksByStatus = computed(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      inprogress: [],
      review: [],
      done: []
    }
    for (const t of (tasks.value ?? [])) {
      map[t.status]?.push(t)
    }
    return map
  })

  async function createTask(data: {
    title: string
    description?: string
    status: TaskStatus
    priority?: TaskPriority
    tags?: string[]
    dueDate?: Date | null
  }) {
    const pid = toValue(projectId)
    const statusTasks = (tasks.value ?? []).filter(t => t.status === data.status)
    await addDoc(tasksRef(), {
      projectId: pid,
      title: data.title,
      description: data.description ?? '',
      status: data.status,
      priority: data.priority ?? 'medium',
      tags: data.tags ?? [],
      dueDate: data.dueDate ?? null,
      order: statusTasks.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>) {
    await updateDoc(doc(db, 'users', user.value!.uid, 'pm_tasks', id), {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  async function moveTask(taskId: string, newStatus: TaskStatus) {
    const statusTasks = (tasks.value ?? []).filter(t => t.status === newStatus && t.id !== taskId)
    await updateTask(taskId, { status: newStatus, order: statusTasks.length })
  }

  async function deleteTask(id: string) {
    await deleteDoc(doc(db, 'users', user.value!.uid, 'pm_tasks', id))
  }

  async function reorderColumn(status: TaskStatus, ordered: Task[]) {
    const batch = writeBatch(db)
    ordered.forEach((t, i) => {
      batch.update(doc(db, 'users', user.value!.uid, 'pm_tasks', t.id), { order: i })
    })
    await batch.commit()
  }

  return { tasks, tasksByStatus, createTask, updateTask, moveTask, deleteTask, reorderColumn }
}
