import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore'
import { useCollection } from 'vuefire'
import type { Note } from '~/types'

export function useNotes(projectId?: MaybeRef<string | null>) {
  const db = useFirestore()
  const user = useCurrentUser()

  function notesRef() {
    return collection(db, 'users', user.value!.uid, 'pm_notes')
  }

  const _notes = useCollection<Note>(
    computed(() => {
      if (!user.value) return null
      const pid = projectId ? toValue(projectId) : undefined
      if (pid !== undefined) {
        return query(notesRef(), where('projectId', '==', pid))
      }
      return query(notesRef())
    })
  )

  const notes = computed<Note[]>(() => {
    const raw = _notes.value ?? []
    if (!raw.length) return raw
    return [...raw].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      const aTime = a.updatedAt?.toMillis() ?? 0
      const bTime = b.updatedAt?.toMillis() ?? 0
      return bTime - aTime
    })
  })

  async function createNote(data: {
    title: string
    content?: string
    tags?: string[]
    projectId?: string | null
  }) {
    await addDoc(notesRef(), {
      projectId: data.projectId ?? (projectId ? toValue(projectId) : null),
      title: data.title,
      content: data.content ?? '',
      tags: data.tags ?? [],
      pinned: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  async function updateNote(id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) {
    await updateDoc(doc(db, 'users', user.value!.uid, 'pm_notes', id), {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  async function togglePin(id: string, pinned: boolean) {
    await updateNote(id, { pinned: !pinned })
  }

  async function deleteNote(id: string) {
    await deleteDoc(doc(db, 'users', user.value!.uid, 'pm_notes', id))
  }

  return { notes, createNote, updateNote, togglePin, deleteNote }
}
