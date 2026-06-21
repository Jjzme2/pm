import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { useCollection } from 'vuefire'
import type { Project, ProjectColor } from '~/types'

export function useProjects() {
  const db = useFirestore()
  const user = useCurrentUser()

  function projectsRef() {
    return collection(db, 'users', user.value!.uid, 'pm_projects')
  }

  const projects = useCollection<Project>(
    computed(() => user.value
      ? query(projectsRef(), orderBy('order', 'asc'))
      : null
    )
  )

  async function createProject(data: {
    name: string
    description: string
    color: ProjectColor
    icon: string
  }) {
    const order = (projects.value?.length ?? 0)
    await addDoc(projectsRef(), {
      ...data,
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>) {
    await updateDoc(doc(db, 'users', user.value!.uid, 'pm_projects', id), {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  async function deleteProject(id: string) {
    await deleteDoc(doc(db, 'users', user.value!.uid, 'pm_projects', id))
  }

  async function reorderProjects(ordered: Project[]) {
    const batch = writeBatch(db)
    ordered.forEach((p, i) => {
      batch.update(doc(db, 'users', user.value!.uid, 'pm_projects', p.id), { order: i })
    })
    await batch.commit()
  }

  return { projects, createProject, updateProject, deleteProject, reorderProjects }
}
