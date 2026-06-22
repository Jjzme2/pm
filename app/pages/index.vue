<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const user = useCurrentUser()
const { projects } = useProjects()
const timerStore = useTimerStore()
const { openTasks } = useAllTasks()
const { notes } = useNotes()
const { sessions } = useTimers()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const displayName = computed(() =>
  user.value?.displayName || user.value?.email?.split('@')[0] || 'there'
)

const totalHours = computed(() => {
  const ms = (sessions.value ?? []).reduce((sum, s) => sum + (s.duration || 0), 0)
  return (ms / 3600000).toFixed(1)
})
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {{ greeting }}, {{ displayName }} 👋
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        {{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}
      </p>
    </div>

    <!-- Active timer -->
    <div v-if="timerStore.active" class="mb-6">
      <div class="flex items-center gap-3 p-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl">
        <span class="size-3 rounded-full bg-violet-500 animate-pulse shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-violet-800 dark:text-violet-200">Timer running</p>
          <p class="text-xs text-violet-600 dark:text-violet-400 truncate">{{ timerStore.active.label }}</p>
        </div>
        <span class="font-mono text-lg font-bold text-violet-700 dark:text-violet-300 tabular-nums">
          {{ timerStore.formattedElapsed }}
        </span>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <UCard class="text-center py-4">
        <p class="text-2xl font-bold text-violet-600 dark:text-violet-400">{{ projects?.length ?? 0 }}</p>
        <p class="text-xs text-zinc-500 mt-0.5">Projects</p>
      </UCard>
      <UCard class="text-center py-4">
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ openTasks?.length ?? 0 }}</p>
        <p class="text-xs text-zinc-500 mt-0.5">Open Tasks</p>
      </UCard>
      <UCard class="text-center py-4">
        <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ notes?.length ?? 0 }}</p>
        <p class="text-xs text-zinc-500 mt-0.5">Notes</p>
      </UCard>
      <UCard class="text-center py-4">
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ totalHours }}h</p>
        <p class="text-xs text-zinc-500 mt-0.5">Hours Tracked</p>
      </UCard>
    </div>

    <!-- Projects -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Projects</h2>
        <UButton to="/projects" label="View all" color="neutral" variant="ghost" size="sm" trailing-icon="i-lucide-arrow-right" />
      </div>

      <div v-if="projects?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard
          v-for="project in projects.slice(0, 6)"
          :key="project.id"
          :project="project"
        />
      </div>
      <div v-else class="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
        <UIcon name="i-lucide-folder-plus" class="size-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
        <p class="text-sm text-zinc-500">No projects yet</p>
        <UButton to="/projects" label="Create your first project" color="violet" variant="ghost" size="sm" class="mt-2" />
      </div>
    </div>

    <!-- Quick actions -->
    <div>
      <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Quick Access</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NuxtLink
          v-for="item in [
            { label: 'Kanban', icon: 'i-lucide-layout-dashboard', to: '/projects', color: 'text-violet-500' },
            { label: 'Notes', icon: 'i-lucide-notebook-pen', to: '/notes', color: 'text-amber-500' },
            { label: 'Timers', icon: 'i-lucide-timer', to: '/timers', color: 'text-emerald-500' },
            { label: 'Quick Links', icon: 'i-lucide-link', to: '/links', color: 'text-sky-500' }
          ]"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-2 py-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-sm transition-all"
        >
          <UIcon :name="item.icon" class="size-6" :class="item.color" />
          <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
