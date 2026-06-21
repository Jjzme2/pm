import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { useCollection } from 'vuefire'
import type { TimerSession } from '~/types'

export function useTimers(projectId?: MaybeRef<string | null>) {
  const db = useFirestore()
  const user = useCurrentUser()
  const timerStore = useTimerStore()

  function sessionsRef() {
    return collection(db, 'users', user.value!.uid, 'pm_timers')
  }

  const sessions = useCollection<TimerSession>(
    computed(() => {
      if (!user.value) return null
      const pid = projectId ? toValue(projectId) : undefined
      if (pid !== undefined && pid !== null) {
        return query(
          sessionsRef(),
          where('projectId', '==', pid),
          orderBy('createdAt', 'desc')
        )
      }
      return query(sessionsRef(), orderBy('createdAt', 'desc'))
    })
  )

  async function startTimer(opts: {
    label?: string
    projectId?: string | null
    taskId?: string | null
  } = {}) {
    const sessionRef = doc(sessionsRef())
    const startTime = Date.now()

    timerStore.start({
      id: sessionRef.id,
      projectId: opts.projectId ?? (projectId ? toValue(projectId) : null),
      taskId: opts.taskId ?? null,
      label: opts.label ?? 'Work session',
      startTime
    })

    await setDoc(sessionRef, {
      projectId: opts.projectId ?? (projectId ? toValue(projectId) : null),
      taskId: opts.taskId ?? null,
      label: opts.label ?? 'Work session',
      startTime: Timestamp.fromMillis(startTime),
      endTime: null,
      duration: 0,
      createdAt: serverTimestamp()
    })
  }

  async function stopTimer() {
    const snapshot = timerStore.stop()
    if (!snapshot || !user.value) return

    const duration = Date.now() - snapshot.startTime
    await updateDoc(doc(db, 'users', user.value.uid, 'pm_timers', snapshot.id), {
      endTime: Timestamp.now(),
      duration
    })
  }

  async function deleteSession(id: string) {
    await deleteDoc(doc(db, 'users', user.value!.uid, 'pm_timers', id))
  }

  const totalDuration = computed(() =>
    (sessions.value ?? []).reduce((sum, s) => sum + (s.duration || 0), 0)
  )

  return { sessions, totalDuration, startTimer, stopTimer, deleteSession }
}
