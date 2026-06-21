<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { projects, deleteProject } = useProjects()
const { success } = useNotification()

const showModal = ref(false)
const editingProject = ref(null)

function openEdit(project: any) {
  editingProject.value = project
  showModal.value = true
}

function openCreate() {
  editingProject.value = null
  showModal.value = true
}

async function handleDelete(id: string) {
  await deleteProject(id)
  success('Project deleted')
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Projects</h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ projects?.length ?? 0 }} project{{ projects?.length !== 1 ? 's' : '' }}</p>
      </div>
      <UButton
        label="New Project"
        icon="i-lucide-plus"
        color="violet"
        @click="openCreate"
      />
    </div>

    <div v-if="projects?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
      <UIcon name="i-lucide-folder-open" class="size-14 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
      <p class="text-lg font-medium text-zinc-600 dark:text-zinc-400 mb-1">No projects yet</p>
      <p class="text-sm text-zinc-400 mb-4">Create a project to start tracking tasks, notes, and time</p>
      <UButton label="Create First Project" color="violet" icon="i-lucide-plus" @click="openCreate" />
    </div>

    <ProjectModal
      v-if="showModal"
      :project="editingProject"
      @close="showModal = false"
      @saved="showModal = false"
    />
  </div>
</template>
