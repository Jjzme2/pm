<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)

const { projects } = useProjects()
const project = computed(() => projects.value?.find(p => p.id === projectId.value))
useSeoMeta({ title: computed(() => project.value?.name ? `${project.value.name} — Timers` : 'Timers') })
</script>

<template>
  <div class="flex flex-col h-full">
    <ProjectTabHeader :project-id="projectId" :project="project" />

    <div class="flex-1 overflow-y-auto scrollbar-thin p-6 max-w-2xl mx-auto w-full">
      <h2 class="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Time Tracking</h2>
      <TimerWidget :project-id="projectId" class="mb-6" />
      <TimerHistory :project-id="projectId" />
    </div>
  </div>
</template>
