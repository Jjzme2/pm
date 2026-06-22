import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import type { SuiteEventType } from '~/types'

export function useSuiteEvents() {
  const db = useFirestore()
  const user = useCurrentUser()

  function activityRef() {
    return collection(db, 'users', user.value!.uid, 'activity')
  }

  function notificationsRef() {
    return collection(db, 'users', user.value!.uid, 'notifications')
  }

  async function emitActivity(
    type: SuiteEventType,
    summary: string,
    data: Record<string, unknown> = {}
  ) {
    if (!user.value) return
    await addDoc(activityRef(), {
      type,
      source: 'pm',
      summary,
      data,
      createdAt: serverTimestamp()
    })
  }

  async function emitNotification(
    type: SuiteEventType,
    title: string,
    body: string,
    data: Record<string, unknown> = {}
  ) {
    if (!user.value) return
    await addDoc(notificationsRef(), {
      type,
      source: 'pm',
      title,
      body,
      data,
      read: false,
      createdAt: serverTimestamp()
    })
  }

  return { emitActivity, emitNotification }
}
