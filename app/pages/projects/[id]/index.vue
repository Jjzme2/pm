<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)

const { projects } = useProjects()
const project = computed(() => projects.value?.find(p => p.id === projectId.value))
useSeoMeta({ title: computed(() => project.value?.name ?? 'Project') })
</script>

<template>
  <div class="flex flex-col h-full">
    <ProjectTabHeader :project-id="projectId" :project="project" />

    <!-- Kanban board -->
    <div class="flex-1 min-h-0 overflow-hidden p-6">
      <KanbanBoard :project-id="projectId" />
    </div>
  </div>
</template>
