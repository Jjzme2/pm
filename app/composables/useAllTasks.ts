import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { useCollection } from 'vuefire'
import type { Task, TaskStatus } from '~/types'

export function useAllTasks() {
  const db = useFirestore()
  const user = useCurrentUser()

  const tasks = useCollection<Task>(
    computed(() => user.value
      ? query(
          collection(db, 'users', user.value.uid, 'pm_tasks'),
          orderBy('createdAt', 'desc')
        )
      : null
    )
  )

  async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>) {
    await updateDoc(doc(db, 'users', user.value!.uid, 'pm_tasks', id), {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  async function deleteTask(id: string) {
    await deleteDoc(doc(db, 'users', user.value!.uid, 'pm_tasks', id))
  }

  const openTasks = computed(() =>
    (tasks.value ?? []).filter(t => t.status !== 'done')
  )

  const overdueTasks = computed(() => {
    const now = new Date()
    return (tasks.value ?? []).filter(t =>
      t.status !== 'done' && t.dueDate && t.dueDate.toDate() < now
    )
  })

  return { tasks, openTasks, overdueTasks, updateTask, deleteTask }
}
