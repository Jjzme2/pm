import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { useCollection } from 'vuefire'
import type { QuickLink, ProjectColor } from '~/types'

export function useLinks(projectId?: MaybeRef<string | null>) {
  const db = useFirestore()
  const user = useCurrentUser()

  function linksRef() {
    return collection(db, 'users', user.value!.uid, 'pm_links')
  }

  const links = useCollection<QuickLink>(
    computed(() => {
      if (!user.value) return null
      const pid = projectId ? toValue(projectId) : undefined
      if (pid !== undefined) {
        return query(
          linksRef(),
          where('projectId', '==', pid),
          orderBy('createdAt', 'desc')
        )
      }
      return query(linksRef(), orderBy('createdAt', 'desc'))
    })
  )

  async function createLink(data: {
    title: string
    url: string
    description?: string
    color?: ProjectColor
    projectId?: string | null
  }) {
    await addDoc(linksRef(), {
      projectId: data.projectId ?? (projectId ? toValue(projectId) : null),
      title: data.title,
      url: data.url,
      description: data.description ?? '',
      color: data.color ?? 'violet',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  async function updateLink(id: string, data: Partial<Omit<QuickLink, 'id' | 'createdAt'>>) {
    await updateDoc(doc(db, 'users', user.value!.uid, 'pm_links', id), {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  async function deleteLink(id: string) {
    await deleteDoc(doc(db, 'users', user.value!.uid, 'pm_links', id))
  }

  return { links, createLink, updateLink, deleteLink }
}
