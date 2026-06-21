<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const projectId = computed(() => route.params.id as string)

const { projects } = useProjects()
const project = computed(() => projects.value?.find(p => p.id === projectId.value))
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Project header -->
    <div class="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3">
      <div v-if="project" class="flex items-center gap-3">
        <UIcon :name="project.icon || 'i-lucide-folder'" class="size-5 text-violet-500" />
        <div>
          <div class="flex items-center gap-2">
            <h1 class="font-semibold text-zinc-900 dark:text-zinc-100">{{ project.name }}</h1>
          </div>
          <p v-if="project.description" class="text-xs text-zinc-500 dark:text-zinc-400">{{ project.description }}</p>
        </div>
      </div>

      <!-- Sub-tabs -->
      <div class="flex items-center gap-0.5 mt-3">
        <NuxtLink
          v-for="tab in [
            { label: 'Board', icon: 'i-lucide-layout-dashboard', to: `/projects/${projectId}` },
            { label: 'Notes', icon: 'i-lucide-notebook-pen', to: `/projects/${projectId}/notes` },
            { label: 'Timers', icon: 'i-lucide-timer', to: `/projects/${projectId}/timers` },
            { label: 'Links', icon: 'i-lucide-link', to: `/projects/${projectId}/links` }
          ]"
          :key="tab.to"
          :to="tab.to"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === tab.to
            ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400'
            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
        >
          <UIcon :name="tab.icon" class="size-4" />
          {{ tab.label }}
        </NuxtLink>
      </div>
    </div>

    <!-- Kanban board -->
    <div class="flex-1 min-h-0 overflow-hidden p-6">
      <KanbanBoard :project-id="projectId" />
    </div>
  </div>
</template>
