<script setup lang="ts">
import type { Project } from '~/types'

const props = defineProps<{
  projectId: string
  project?: Project | null
}>()

const tabs = computed(() => [
  { label: 'Board', icon: 'i-lucide-layout-dashboard', to: `/projects/${props.projectId}` },
  { label: 'List', icon: 'i-lucide-list', to: `/projects/${props.projectId}/list` },
  { label: 'Notes', icon: 'i-lucide-notebook-pen', to: `/projects/${props.projectId}/notes` },
  { label: 'Timers', icon: 'i-lucide-timer', to: `/projects/${props.projectId}/timers` },
  { label: 'Links', icon: 'i-lucide-link', to: `/projects/${props.projectId}/links` }
])

const route = useRoute()
</script>

<template>
  <div class="shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3">
    <div v-if="project" class="flex items-center gap-3">
      <UIcon :name="project.icon || 'i-lucide-folder'" class="size-5 text-violet-500" />
      <div>
        <h1 class="font-semibold text-zinc-900 dark:text-zinc-100">{{ project.name }}</h1>
        <p v-if="project.description" class="text-xs text-zinc-500 dark:text-zinc-400">{{ project.description }}</p>
      </div>
    </div>

    <div class="flex items-center gap-0.5 mt-3 overflow-x-auto scrollbar-none -mx-1 px-1">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0"
        :class="route.path === tab.to
          ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400'
          : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
      >
        <UIcon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </NuxtLink>
    </div>
  </div>
</template>
