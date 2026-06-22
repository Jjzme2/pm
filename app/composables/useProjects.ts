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
import type { Project, ProjectColor, ProjectStatus } from '~/types'

export function useProjects() {
  const db = useFirestore()
  const user = useCurrentUser()
  const { emitActivity, emitNotification } = useSuiteEvents()

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
    status?: ProjectStatus
  }) {
    const order = (projects.value?.length ?? 0)
    await addDoc(projectsRef(), {
      ...data,
      status: data.status ?? 'active',
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    emitActivity('project.created', `Created project "${data.name}"`, { name: data.name })
  }

  async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>) {
    await updateDoc(doc(db, 'users', user.value!.uid, 'pm_projects', id), {
      ...data,
      updatedAt: serverTimestamp()
    })
    if (data.status === 'completed') {
      const project = projects.value?.find(p => p.id === id)
      const name = project?.name ?? data.name ?? 'Project'
      emitActivity('project.completed', `Completed project "${name}"`, { projectId: id, name })
      emitNotification('project.completed', 'Project completed', `"${name}" has been marked complete.`, { projectId: id })
    }
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
